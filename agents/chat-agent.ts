import { ChatOpenAI } from "@langchain/openai";
import type { StructuredProfile, EligibilityResult } from "@/types";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.5,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

interface ChatContext {
  profile?: StructuredProfile;
  eligibilityResults?: EligibilityResult[];
  chatContext?: string;
  schemeNames?: string[];
}

export async function chatAgent(
  message: string,
  context: ChatContext,
  history: { role: string; content: string }[] = []
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackResponse(message, context);
  }

  const systemPrompt = `You are GovAssist AI, a helpful assistant for Indian government schemes. You help citizens discover, understand, and apply for government benefits.

Rules:
- Only discuss government schemes and eligibility
- Be empathetic and use simple language
- If asked in Hindi, respond in Hindi
- Never invent eligibility - base answers on provided context
- Cite specific scheme names when relevant
- Keep responses concise (2-4 paragraphs max)

User Context:
${context.chatContext || "No analysis run yet"}
${context.profile ? `Profile: Age ${context.profile.age}, Income ₹${context.profile.annualIncome}, ${context.profile.occupation}, ${context.profile.state}, Student: ${context.profile.isStudent}, Farmer: ${context.profile.isFarmer}` : ""}
${context.eligibilityResults ? `Eligible schemes: ${context.eligibilityResults.filter(r => r.status === "eligible").map(r => r.schemeName).join(", ")}` : ""}`;

  try {
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.slice(-6).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await model.invoke(messages);
    return typeof response.content === "string"
      ? response.content
      : String(response.content);
  } catch {
    return getFallbackResponse(message, context);
  }
}

function getFallbackResponse(message: string, context: ChatContext): string {
  const lower = message.toLowerCase();

  if (lower.includes("hindi") || lower.includes("हिंदी")) {
    return "मैं GovAssist AI हूँ। सरकारी योजनाओं के बारे में आपकी मदद करने के लिए तैयार हूँ। कृपया अपनी पात्रता जांचने के लिए पहले अपनी प्रोफ़ाइल पूरी करें और विश्लेषण चलाएँ।";
  }

  if (lower.includes("eligible") || lower.includes("qualify")) {
    const eligible = context.eligibilityResults?.filter((r) => r.status === "eligible") || [];
    if (eligible.length > 0) {
      return `Based on your profile, you may be eligible for ${eligible.length} schemes including: ${eligible.slice(0, 5).map((e) => e.schemeName).join(", ")}. Visit the Eligibility page for detailed results.`;
    }
    return "Please complete your profile and run AI analysis to discover schemes you qualify for.";
  }

  if (lower.includes("compare")) {
    return "To compare schemes, visit the Scheme Details page for each scheme. Key factors to compare: eligibility criteria, benefits amount, required documents, and approval timeline.";
  }

  return "I'm GovAssist AI, your guide to Indian government schemes. Complete your profile and run eligibility analysis, then ask me about specific schemes, documents, or application processes.";
}
