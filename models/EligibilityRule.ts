import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEligibilityRule extends Document {
  schemeId: string;
  ruleName: string;
  conditions: {
    field: string;
    operator: string;
    value: Schema.Types.Mixed;
    label?: string;
  }[];
  logic: "AND" | "OR";
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EligibilityRuleSchema = new Schema<IEligibilityRule>(
  {
    schemeId: { type: String, required: true, index: true },
    ruleName: { type: String, required: true },
    conditions: [
      {
        field: { type: String, required: true },
        operator: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
        label: { type: String },
      },
    ],
    logic: { type: String, enum: ["AND", "OR"], default: "AND" },
    priority: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EligibilityRuleSchema.index({ schemeId: 1, isActive: 1 });

export const EligibilityRule: Model<IEligibilityRule> =
  mongoose.models.EligibilityRule ||
  mongoose.model<IEligibilityRule>("EligibilityRule", EligibilityRuleSchema);
