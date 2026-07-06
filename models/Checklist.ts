import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChecklist extends Document {
  userId: Types.ObjectId;
  schemeId: string;
  requiredDocuments: string[];
  uploadedDocuments: string[];
  missingDocuments: string[];
  expiredDocuments: string[];
  completionPercentage: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistSchema = new Schema<IChecklist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    schemeId: { type: String, required: true, index: true },
    requiredDocuments: [{ type: String }],
    uploadedDocuments: [{ type: String }],
    missingDocuments: [{ type: String }],
    expiredDocuments: [{ type: String }],
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ChecklistSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const Checklist: Model<IChecklist> =
  mongoose.models.Checklist ||
  mongoose.model<IChecklist>("Checklist", ChecklistSchema);
