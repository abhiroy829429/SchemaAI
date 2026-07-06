import type { StructuredProfile } from "@/types";
import { calculateAge } from "@/lib/utils";

export function intakeAgent(rawProfile: Record<string, unknown>): StructuredProfile {
  const dob = rawProfile.dateOfBirth
    ? new Date(rawProfile.dateOfBirth as string)
    : null;
  const age =
    (rawProfile.age as number) ||
    (dob ? calculateAge(dob) : 0);

  return {
    age,
    annualIncome: Number(rawProfile.annualIncome) || 0,
    occupation: String(rawProfile.occupation || ""),
    education: String(rawProfile.education || ""),
    gender: String(rawProfile.gender || ""),
    state: String(rawProfile.state || ""),
    district: String(rawProfile.district || ""),
    category: String(rawProfile.category || ""),
    isStudent: Boolean(rawProfile.isStudent),
    isFarmer: Boolean(rawProfile.isFarmer),
    isBusinessOwner: Boolean(rawProfile.isBusinessOwner),
    hasDisability: Boolean(rawProfile.hasDisability),
    isSeniorCitizen: age >= 60,
    isWidow: Boolean(rawProfile.isWidow),
    isVeteran: Boolean(rawProfile.isVeteran),
  };
}
