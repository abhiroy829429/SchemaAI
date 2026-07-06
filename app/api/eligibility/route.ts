import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { GovernmentScheme } from "@/models/GovernmentScheme";
import { runEligibilityPipeline } from "@/agents/graph";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    await connectDB();
    const schemes = await GovernmentScheme.find({ isActive: true }).lean();

    const schemeInputs = schemes.map((s) => ({
      schemeId: s.schemeId,
      name: s.name,
      category: s.category,
      eligibilityRules: s.eligibilityRules,
      requiredDocuments: s.requiredDocuments,
    }));

    const result = await runEligibilityPipeline(user.toObject(), schemeInputs);

    return apiSuccess({
      profile: result.profile,
      results: result.eligibilityResults,
      explanations: result.explanations,
      requiredDocuments: result.requiredDocuments,
      recommendations: result.recommendations,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
