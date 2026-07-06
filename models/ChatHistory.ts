import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChatHistory extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  messages: IChatMessage[];
  context?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    context: { type: String },
  },
  { timestamps: true }
);

ChatHistorySchema.index({ userId: 1, sessionId: 1 });

export const ChatHistory: Model<IChatHistory> =
  mongoose.models.ChatHistory ||
  mongoose.model<IChatHistory>("ChatHistory", ChatHistorySchema);
