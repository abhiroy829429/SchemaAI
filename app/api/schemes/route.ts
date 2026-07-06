import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { GovernmentScheme } from "@/models/GovernmentScheme";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const scheme = await GovernmentScheme.findOne({ slug, isActive: true }).lean();
      if (!scheme) return handleApiError(new Error("Scheme not found"));
      return apiSuccess(scheme);
    }

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const schemes = await GovernmentScheme.find(filter).sort({ name: 1 }).lean();
    return apiSuccess(schemes);
  } catch (error) {
    return handleApiError(error);
  }
}
