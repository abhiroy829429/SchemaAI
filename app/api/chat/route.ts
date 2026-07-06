import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { ChatHistory } from "@/models/ChatHistory";
import { chatAgent } from "@/agents/chat-agent";
import { runEligibilityPipeline } from "@/agents/graph";
import { GovernmentScheme } from "@/models/GovernmentScheme";
import { chatSchema } from "@/lib/validations";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    const body = await req.json();
    const { message, sessionId } = chatSchema.parse(body);
    const sid = sessionId || `session-${user.clerkId}`;

    await connectDB();

    let chatHistory = await ChatHistory.findOne({ userId: user._id, sessionId: sid });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: user._id,
        sessionId: sid,
        messages: [],
      });
    }

    const schemes = await GovernmentScheme.find({ isActive: true }).lean();
    const pipeline = await runEligibilityPipeline(
      user.toObject(),
      schemes.map((s) => ({
        schemeId: s.schemeId,
        name: s.name,
        category: s.category,
        eligibilityRules: {
          conditions: s.eligibilityRules.conditions.map((c) => ({
            ...c,
            operator: c.operator as "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains" | "boolean",
            value: c.value as unknown as string | number | boolean | string[],
          })),
          logic: s.eligibilityRules.logic,
        },
        requiredDocuments: s.requiredDocuments,
      }))
    );

    const history = chatHistory.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await chatAgent(message, {
      profile: pipeline.profile,
      eligibilityResults: pipeline.eligibilityResults,
      chatContext: pipeline.chatContext,
    }, history);

    chatHistory.messages.push(
      { role: "user", content: message, timestamp: new Date() },
      { role: "assistant", content: response, timestamp: new Date() }
    );
    await chatHistory.save();

    return apiSuccess({ response, sessionId: sid });
  } catch (error) {
    return handleApiError(error);
  }
}
