import { evaluateAllSchemes } from "@/services/rule-engine";
import type { EligibilityResult, EligibilityRuleSet, StructuredProfile } from "@/types";

interface SchemeInput {
  schemeId: string;
  name: string;
  eligibilityRules: EligibilityRuleSet;
}

export function eligibilityAgent(
  profile: StructuredProfile,
  schemes: SchemeInput[]
): EligibilityResult[] {
  return evaluateAllSchemes(schemes, profile);
}
