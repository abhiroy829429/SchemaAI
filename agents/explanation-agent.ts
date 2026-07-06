import { ChatOpenAI } from "@langchain/openai";
import type { EligibilityResult, StructuredProfile } from "@/types";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function explanationAgent(
  profile: StructuredProfile,
  results: EligibilityResult[],
  schemeDetails?: { name: string; benefits: string[]; description: string }
): Promise<Record<string, string>> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackExplanations(results);
  }

  const explanations: Record<string, string> = {};
  const topResults = results.slice(0, 10);

  for (const result of topResults) {
    try {
      const prompt = `You are GovAssist AI, helping Indian citizens understand government scheme eligibility.

User Profile:
- Age: ${profile.age}
- Annual Income: ₹${profile.annualIncome}
- Occupation: ${profile.occupation}
- State: ${profile.state}
- Category: ${profile.category}
- Student: ${profile.isStudent}, Farmer: ${profile.isFarmer}

Scheme: ${result.schemeName}
Eligibility Status: ${result.status}
Confidence: ${result.confidenceScore}%
Matched Rules: ${result.matchedRules.join(", ") || "None"}
Failed Rules: ${result.failedRules.join(", ") || "None"}

Write a clear, empathetic 2-3 sentence explanation in simple English for why the user is ${result.status.replace("_", " ")} for this scheme. Be specific about their profile attributes. Do not invent eligibility criteria.`;

      const response = await model.invoke(prompt);
      explanations[result.schemeId] =
        typeof response.content === "string"
          ? response.content
          : String(response.content);
    } catch {
      explanations[result.schemeId] = fallbackExplanation(result);
    }
  }

  return explanations;
}

export async function explainSingleScheme(
  profile: StructuredProfile,
  result: EligibilityResult,
  schemeInfo: { description: string; benefits: string[] }
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackExplanation(result);
  }

  try {
    const prompt = `Explain in simple English why this Indian citizen is ${result.status.replace("_", " ")} for "${result.schemeName}".

Profile: Age ${profile.age}, Income ₹${profile.annualIncome}, ${profile.occupation}, ${profile.state}
Scheme benefits: ${schemeInfo.benefits.slice(0, 3).join(", ")}
Matched: ${result.matchedRules.join(", ")}
Failed: ${result.failedRules.join(", ")}

Keep it to 3-4 sentences. Be helpful and specific.`;

    const response = await model.invoke(prompt);
    return typeof response.content === "string"
      ? response.content
      : String(response.content);
  } catch {
    return fallbackExplanation(result);
  }
}

function fallbackExplanation(result: EligibilityResult): string {
  if (result.status === "eligible") {
    return `You appear eligible for ${result.schemeName} based on: ${result.matchedRules.slice(0, 2).join(", ")}.`;
  }
  if (result.status === "possibly_eligible") {
    return `You may qualify for ${result.schemeName}. Some criteria match but others need verification: ${result.failedRules.slice(0, 2).join(", ")}.`;
  }
  return `You are currently not eligible for ${result.schemeName} because: ${result.failedRules.slice(0, 2).join(", ")}.`;
}

function fallbackExplanations(results: EligibilityResult[]): Record<string, string> {
  return Object.fromEntries(
    results.map((r) => [r.schemeId, fallbackExplanation(r)])
  );
}
