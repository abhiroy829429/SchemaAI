import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import { getProfileCompletion } from "@/lib/utils";

export async function getAuthUser(): Promise<IUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  await connectDB();
  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await User.create({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
      profileCompletion: 0,
    });
  }

  return user;
}

export async function requireAuthUser(): Promise<IUser> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function updateUserProfile(
  clerkId: string,
  data: Partial<IUser>
): Promise<IUser> {
  await connectDB();
  const completion = getProfileCompletion(data as Record<string, unknown>);
  const user = await User.findOneAndUpdate(
    { clerkId },
    { ...data, profileCompletion: completion },
    { new: true, runValidators: true }
  );
  if (!user) throw new Error("User not found");
  return user;
}
