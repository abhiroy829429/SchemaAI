import mongoose, { Schema, Document, Model } from "mongoose";
import { SCHEME_CATEGORIES } from "@/lib/constants";

export interface IEligibilityRuleEmbedded {
  conditions: {
    field: string;
    operator: string;
    value: Schema.Types.Mixed;
    label?: string;
  }[];
  logic: "AND" | "OR";
}

export interface IGovernmentScheme extends Document {
  schemeId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  ministry: string;
  level: "central" | "state";
  applicableStates: string[];
  eligibilityRules: IEligibilityRuleEmbedded;
  requiredDocuments: string[];
  benefits: string[];
  applicationProcess: string[];
  approvalTime: string;
  faqs: { question: string; answer: string }[];
  officialWebsite: string;
  helpline: string;
  icon: string;
  logo: string;
  colorTheme: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GovernmentSchemeSchema = new Schema<IGovernmentScheme>(
  {
    schemeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: SCHEME_CATEGORIES, index: true },
    ministry: { type: String, required: true },
    level: { type: String, enum: ["central", "state"], default: "central" },
    applicableStates: [{ type: String }],
    eligibilityRules: {
      conditions: [
        {
          field: { type: String, required: true },
          operator: { type: String, required: true },
          value: { type: Schema.Types.Mixed, required: true },
          label: { type: String },
        },
      ],
      logic: { type: String, enum: ["AND", "OR"], default: "AND" },
    },
    requiredDocuments: [{ type: String }],
    benefits: [{ type: String }],
    applicationProcess: [{ type: String }],
    approvalTime: { type: String },
    faqs: [{ question: String, answer: String }],
    officialWebsite: { type: String },
    helpline: { type: String },
    icon: { type: String },
    logo: { type: String },
    colorTheme: { type: String, default: "#3B82F6" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

GovernmentSchemeSchema.index({ category: 1, level: 1 });
GovernmentSchemeSchema.index({ name: "text", description: "text" });

export const GovernmentScheme: Model<IGovernmentScheme> =
  mongoose.models.GovernmentScheme ||
  mongoose.model<IGovernmentScheme>("GovernmentScheme", GovernmentSchemeSchema);
