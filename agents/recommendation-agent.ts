import type { EligibilityResult, Recommendation, StructuredProfile } from "@/types";

interface SchemeInfo {
  schemeId: string;
  name: string;
  category: string;
}

export function recommendationAgent(
  profile: StructuredProfile,
  results: EligibilityResult[],
  allSchemes: SchemeInfo[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const eligibleIds = new Set(
    results.filter((r) => r.status === "eligible").map((r) => r.schemeId)
  );

  for (const result of results.filter((r) => r.status === "possibly_eligible")) {
    recommendations.push({
      schemeId: result.schemeId,
      schemeName: result.schemeName,
      reason: `You partially qualify. Complete missing requirements to become fully eligible.`,
      futureEligible: false,
    });
  }

  if (profile.age < 60 && profile.annualIncome > 300000) {
    const seniorSchemes = allSchemes.filter(
      (s) => s.category === "Senior Citizens" && !eligibleIds.has(s.schemeId)
    );
    seniorSchemes.slice(0, 2).forEach((s) => {
      recommendations.push({
        schemeId: s.schemeId,
        schemeName: s.name,
        reason: "You may qualify when you turn 60 years old.",
        futureEligible: true,
        condition: "Age >= 60",
      });
    });
  }

  if (profile.annualIncome > 200000 && profile.annualIncome <= 500000) {
    const welfareSchemes = allSchemes.filter(
      (s) =>
        (s.category === "Social Welfare" || s.category === "Healthcare") &&
        !eligibleIds.has(s.schemeId)
    );
    welfareSchemes.slice(0, 2).forEach((s) => {
      recommendations.push({
        schemeId: s.schemeId,
        schemeName: s.name,
        reason: "If your annual income falls below ₹2 lakh, you may qualify for this scheme.",
        futureEligible: true,
        condition: "Annual income < ₹2,00,000",
      });
    });
  }

  if (!profile.isFarmer && profile.occupation !== "Farmer") {
    const farmerSchemes = allSchemes.filter(
      (s) => s.category === "Agriculture" && !eligibleIds.has(s.schemeId)
    );
    farmerSchemes.slice(0, 1).forEach((s) => {
      recommendations.push({
        schemeId: s.schemeId,
        schemeName: s.name,
        reason: "Register as a farmer to access agricultural benefit schemes.",
        futureEligible: true,
        condition: "Farmer registration required",
      });
    });
  }

  if (profile.isStudent) {
    const eduSchemes = results.filter(
      (r) => r.status === "eligible" && r.schemeName.toLowerCase().includes("scholarship")
    );
    eduSchemes.forEach((r) => {
      recommendations.push({
        schemeId: r.schemeId,
        schemeName: r.schemeName,
        reason: "Highly recommended based on your student profile.",
        futureEligible: false,
      });
    });
  }

  return recommendations.slice(0, 8);
}
