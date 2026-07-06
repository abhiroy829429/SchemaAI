import { z } from "zod";
import { INDIAN_STATES, OCCUPATIONS, EDUCATION_LEVELS, SOCIAL_CATEGORIES } from "@/lib/constants";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  phone: z.string().min(10, "Valid phone number required").optional(),
  annualIncome: z.union([z.string(), z.number()]).optional().transform((val) => typeof val === 'string' ? Number(val) : val),
  occupation: z.enum(OCCUPATIONS as unknown as [string, ...string[]]).optional(),
  education: z.enum(EDUCATION_LEVELS as unknown as [string, ...string[]]).optional(),
  category: z.enum(SOCIAL_CATEGORIES as unknown as [string, ...string[]]).optional(),
  state: z.enum(INDIAN_STATES as unknown as [string, ...string[]]).optional(),
  district: z.string().optional(),
  isStudent: z.boolean().optional(),
  isFarmer: z.boolean().optional(),
  isBusinessOwner: z.boolean().optional(),
  hasDisability: z.boolean().optional(),
  isWidow: z.boolean().optional(),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().optional(),
});

export const applicationSchema = z.object({
  schemeId: z.string().min(1),
  schemeName: z.string().min(1),
});

export const checklistSchema = z.object({
  schemeId: z.string().min(1),
});
