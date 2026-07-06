import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITimelineEvent {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  timestamp?: Date;
  order: number;
}

export interface IApplicationTimeline extends Document {
  applicationId: Types.ObjectId;
  userId: Types.ObjectId;
  schemeId: string;
  events: ITimelineEvent[];
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationTimelineSchema = new Schema<IApplicationTimeline>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    schemeId: { type: String, required: true },
    events: [
      {
        title: { type: String, required: true },
        description: { type: String },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed", "failed"],
          default: "pending",
        },
        timestamp: { type: Date },
        order: { type: Number, required: true },
      },
    ],
    currentStep: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ApplicationTimelineSchema.index({ userId: 1, schemeId: 1 });

export const ApplicationTimeline: Model<IApplicationTimeline> =
  mongoose.models.ApplicationTimeline ||
  mongoose.model<IApplicationTimeline>("ApplicationTimeline", ApplicationTimelineSchema);
