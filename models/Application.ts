import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { APPLICATION_STATUSES } from "@/lib/constants";

export interface IApplication extends Document {
  userId: Types.ObjectId;
  schemeId: string;
  schemeName: string;
  status: string;
  eligibilityStatus: string;
  confidenceScore: number;
  notes?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    schemeId: { type: String, required: true, index: true },
    schemeName: { type: String, required: true },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "draft",
      index: true,
    },
    eligibilityStatus: { type: String, default: "eligible" },
    confidenceScore: { type: Number, min: 0, max: 100, default: 0 },
    notes: { type: String },
    submittedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

ApplicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });
ApplicationSchema.index({ userId: 1, status: 1 });

export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
