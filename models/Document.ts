import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { DOCUMENT_TYPES } from "@/lib/constants";

export interface IDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  documentType: string;
  fileUrl: string;
  filePublicId?: string;
  mimeType: string;
  fileSize: number;
  extractedData?: {
    name?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    maskedNumber?: string;
  };
  status: "pending" | "verified" | "rejected" | "expired";
  expiryDate?: Date;
  schemeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    documentType: { type: String, required: true, enum: DOCUMENT_TYPES },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    extractedData: {
      name: String,
      dateOfBirth: String,
      documentNumber: String,
      maskedNumber: String,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "expired"],
      default: "pending",
    },
    expiryDate: { type: Date },
    schemeId: { type: String, index: true },
  },
  { timestamps: true }
);

DocumentSchema.index({ userId: 1, documentType: 1 });

export const UserDocument: Model<IDocument> =
  mongoose.models.UserDocument ||
  mongoose.model<IDocument>("UserDocument", DocumentSchema);
