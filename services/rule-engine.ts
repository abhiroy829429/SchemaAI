import type {
  EligibilityResult,
  EligibilityRuleSet,
  EligibilityStatus,
  RuleCondition,
  StructuredProfile,
} from "@/types";

function getProfileValue(profile: StructuredProfile, field: string): unknown {
  const map: Record<string, unknown> = {
    age: profile.age,
    annualIncome: profile.annualIncome,
    income: profile.annualIncome,
    occupation: profile.occupation,
    education: profile.education,
    gender: profile.gender,
    state: profile.state,
    district: profile.district,
    category: profile.category,
    isStudent: profile.isStudent,
    student: profile.isStudent,
    isFarmer: profile.isFarmer,
    farmer: profile.isFarmer,
    isBusinessOwner: profile.isBusinessOwner,
    businessOwner: profile.isBusinessOwner,
    hasDisability: profile.hasDisability,
    disability: profile.hasDisability,
    isSeniorCitizen: profile.isSeniorCitizen,
    seniorCitizen: profile.isSeniorCitizen,
    isWidow: profile.isWidow,
    widow: profile.isWidow,
    isVeteran: profile.isVeteran,
    veteran: profile.isVeteran,
  };
  return map[field];
}

function evaluateCondition(
  condition: RuleCondition,
  profile: StructuredProfile
): boolean {
  const value = getProfileValue(profile, condition.field);

  switch (condition.operator) {
    case "eq":
      return value === condition.value;
    case "neq":
      return value !== condition.value;
    case "gt":
      return typeof value === "number" && value > (condition.value as number);
    case "gte":
      return typeof value === "number" && value >= (condition.value as number);
    case "lt":
      return typeof value === "number" && value < (condition.value as number);
    case "lte":
      return typeof value === "number" && value <= (condition.value as number);
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(value as string);
    case "nin":
      return Array.isArray(condition.value) && !condition.value.includes(value as string);
    case "contains":
      return (
        typeof value === "string" &&
        typeof condition.value === "string" &&
        value.toLowerCase().includes(condition.value.toLowerCase())
      );
    case "boolean":
      return value === condition.value;
    default:
      return false;
  }
}

function evaluateRuleSet(
  rules: EligibilityRuleSet,
  profile: StructuredProfile
): { passed: boolean; matched: string[]; failed: string[] } {
  const matched: string[] = [];
  const failed: string[] = [];

  const results = rules.conditions.map((condition) => {
    const pass = evaluateCondition(condition, profile);
    const label = condition.label || `${condition.field} ${condition.operator} ${condition.value}`;
    if (pass) matched.push(label);
    else failed.push(label);
    return pass;
  });

  const passed =
    rules.logic === "AND" ? results.every(Boolean) : results.some(Boolean);

  return { passed, matched, failed };
}

export function evaluateEligibility(
  schemeId: string,
  schemeName: string,
  rules: EligibilityRuleSet,
  profile: StructuredProfile
): EligibilityResult {
  const { passed, matched, failed } = evaluateRuleSet(rules, profile);
  const totalConditions = rules.conditions.length;
  const matchedCount = matched.length;

  let status: EligibilityStatus;
  let confidenceScore: number;

  if (passed) {
    status = "eligible";
    confidenceScore = Math.min(95, 70 + (matchedCount / totalConditions) * 25);
  } else if (matchedCount > 0 && matchedCount >= totalConditions * 0.5) {
    status = "possibly_eligible";
    confidenceScore = Math.round((matchedCount / totalConditions) * 60);
  } else {
    status = "not_eligible";
    confidenceScore = Math.max(10, Math.round((matchedCount / totalConditions) * 30));
  }

  const reasons =
    status === "eligible"
      ? matched.map((m) => `Meets requirement: ${m}`)
      : failed.map((f) => `Does not meet: ${f}`);

  return {
    schemeId,
    schemeName,
    status,
    confidenceScore,
    matchedRules: matched,
    failedRules: failed,
    reasons,
  };
}

export function evaluateAllSchemes(
  schemes: { schemeId: string; name: string; eligibilityRules: EligibilityRuleSet }[],
  profile: StructuredProfile
): EligibilityResult[] {
  return schemes
    .map((scheme) =>
      evaluateEligibility(scheme.schemeId, scheme.name, scheme.eligibilityRules, profile)
    )
    .sort((a, b) => {
      const statusOrder = { eligible: 0, possibly_eligible: 1, not_eligible: 2 };
      const diff = statusOrder[a.status] - statusOrder[b.status];
      if (diff !== 0) return diff;
      return b.confidenceScore - a.confidenceScore;
    });
}

export function profileFromUser(user: Record<string, unknown>): StructuredProfile {
  const dob = user.dateOfBirth ? new Date(user.dateOfBirth as string) : null;
  let age = (user.age as number) || 0;
  if (dob && !user.age) {
    const today = new Date();
    age = today.getFullYear() - dob.getFullYear();
  }

  return {
    age,
    annualIncome: (user.annualIncome as number) || 0,
    occupation: (user.occupation as string) || "",
    education: (user.education as string) || "",
    gender: (user.gender as string) || "",
    state: (user.state as string) || "",
    district: (user.district as string) || "",
    category: (user.category as string) || "",
    isStudent: Boolean(user.isStudent),
    isFarmer: Boolean(user.isFarmer),
    isBusinessOwner: Boolean(user.isBusinessOwner),
    hasDisability: Boolean(user.hasDisability),
    isSeniorCitizen: age >= 60,
    isWidow: Boolean(user.isWidow),
    isVeteran: Boolean(user.isVeteran),
  };
}
