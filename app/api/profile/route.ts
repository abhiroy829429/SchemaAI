import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { User } from "@/models/User";
import { profileSchema } from "@/lib/validations";
import { getProfileCompletion } from "@/lib/utils";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    return apiSuccess({
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      annualIncome: user.annualIncome,
      occupation: user.occupation,
      education: user.education,
      category: user.category,
      state: user.state,
      district: user.district,
      isStudent: user.isStudent,
      isFarmer: user.isFarmer,
      isBusinessOwner: user.isBusinessOwner,
      hasDisability: user.hasDisability,
      isWidow: user.isWidow,
      isVeteran: user.isVeteran,
      profileCompletion: user.profileCompletion,
      role: user.role,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    const body = await req.json();
    await connectDB();

    const parsed = profileSchema.parse(body);
    const updateData: Record<string, unknown> = { ...parsed };

    if (parsed.dateOfBirth) {
      const dob = new Date(parsed.dateOfBirth);
      const today = new Date();
      updateData.age = today.getFullYear() - dob.getFullYear();
    }

    const completion = getProfileCompletion({ ...user.toObject(), ...updateData });

    const freshUser = await User.findOneAndUpdate(
      { clerkId: user.clerkId },
      { $set: { ...updateData, profileCompletion: completion } },
      { new: true, runValidators: true }
    );

    return apiSuccess(freshUser);
  } catch (error) {
    return handleApiError(error);
  }
}
