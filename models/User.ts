import mongoose, { Schema, Document, Model } from "mongoose";
import { SOCIAL_CATEGORIES, EDUCATION_LEVELS, OCCUPATIONS } from "@/lib/constants";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  age?: number;
  gender?: "male" | "female" | "other";
  phone?: string;
  profilePhoto?: string;
  annualIncome?: number;
  occupation?: string;
  education?: string;
  category?: string;
  state?: string;
  district?: string;
  isStudent: boolean;
  isFarmer: boolean;
  isBusinessOwner: boolean;
  hasDisability: boolean;
  isWidow: boolean;
  isVeteran: boolean;
  profileCompletion: number;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: { type: String, trim: true },
    profilePhoto: { type: String },
    annualIncome: { type: Number, min: 0 },
    occupation: { type: String, enum: [...OCCUPATIONS, null] },
    education: { type: String, enum: [...EDUCATION_LEVELS, null] },
    category: { type: String, enum: [...SOCIAL_CATEGORIES, null] },
    state: { type: String, index: true },
    district: { type: String },
    isStudent: { type: Boolean, default: false },
    isFarmer: { type: Boolean, default: false },
    isBusinessOwner: { type: Boolean, default: false },
    hasDisability: { type: Boolean, default: false },
    isWidow: { type: Boolean, default: false },
    isVeteran: { type: Boolean, default: false },
    profileCompletion: { type: Number, default: 0, min: 0, max: 100 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

UserSchema.index({ state: 1, category: 1 });
UserSchema.index({ occupation: 1, isFarmer: 1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
