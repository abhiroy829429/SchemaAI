import {
  APPLICATION_STATUSES,
  DOCUMENT_TYPES,
  EDUCATION_LEVELS,
  ELIGIBILITY_STATUSES,
  OCCUPATIONS,
  SCHEME_CATEGORIES,
  SOCIAL_CATEGORIES,
} from "@/lib/constants";

export type SchemeCategory = (typeof SCHEME_CATEGORIES)[number];
export type Occupation = (typeof OCCUPATIONS)[number];
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];
export type SocialCategory = (typeof SOCIAL_CATEGORIES)[number];
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type EligibilityStatus = (typeof ELIGIBILITY_STATUSES)[number];

export interface StructuredProfile {
  age: number;
  annualIncome: number;
  occupation: string;
  education: string;
  gender: string;
  state: string;
  district: string;
  category: string;
  isStudent: boolean;
  isFarmer: boolean;
  isBusinessOwner: boolean;
  hasDisability: boolean;
  isSeniorCitizen: boolean;
  isWidow: boolean;
  isVeteran: boolean;
}

export interface RuleCondition {
  field: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "nin"
    | "contains"
    | "boolean";
  value: string | number | boolean | string[];
  label?: string;
}

export interface EligibilityRuleSet {
  conditions: RuleCondition[];
  logic: "AND" | "OR";
}

export interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  status: EligibilityStatus;
  confidenceScore: number;
  matchedRules: string[];
  failedRules: string[];
  reasons: string[];
}

export interface AgentState {
  profile: StructuredProfile;
  rawProfile: Record<string, unknown>;
  eligibilityResults: EligibilityResult[];
  explanations: Record<string, string>;
  requiredDocuments: Record<string, string[]>;
  checklist: ChecklistResult | null;
  roadmap: RoadmapStep[];
  recommendations: Recommendation[];
  chatContext: string;
}

export interface ChecklistResult {
  schemeId: string;
  uploaded: string[];
  missing: string[];
  expired: string[];
  completionPercentage: number;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  estimatedDays?: number;
}

export interface Recommendation {
  schemeId: string;
  schemeName: string;
  reason: string;
  futureEligible?: boolean;
  condition?: string;
}

export interface DashboardStats {
  eligibleSchemes: number;
  totalApplications: number;
  missingDocuments: number;
  profileCompletion: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "application" | "document" | "eligibility" | "notification";
  title: string;
  description: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SchemeFilters {
  search?: string;
  category?: SchemeCategory;
  state?: string;
  status?: EligibilityStatus;
  sortBy?: "name" | "confidence" | "category";
  sortOrder?: "asc" | "desc";
}
