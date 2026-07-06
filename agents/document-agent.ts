import type { EligibilityResult } from "@/types";

interface SchemeDocInput {
  schemeId: string;
  requiredDocuments: string[];
}

export function documentAgent(
  results: EligibilityResult[],
  schemes: SchemeDocInput[]
): Record<string, string[]> {
  const schemeMap = new Map(schemes.map((s) => [s.schemeId, s.requiredDocuments]));
  const documents: Record<string, string[]> = {};

  for (const result of results) {
    if (result.status !== "not_eligible") {
      documents[result.schemeId] = schemeMap.get(result.schemeId) || [
        "Aadhaar Card",
        "Income Certificate",
        "Residence Certificate",
      ];
    }
  }

  return documents;
}

export function getAllRequiredDocuments(
  requiredDocs: Record<string, string[]>
): string[] {
  const all = new Set<string>();
  Object.values(requiredDocs).forEach((docs) => docs.forEach((d) => all.add(d)));
  return Array.from(all);
}
