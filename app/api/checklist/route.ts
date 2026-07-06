import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { GovernmentScheme } from "@/models/GovernmentScheme";
import { UserDocument } from "@/models/Document";
import { Checklist } from "@/models/Checklist";
import { checklistAgent } from "@/agents/checklist-agent";
import { checklistSchema } from "@/lib/validations";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    const body = await req.json();
    const { schemeId } = checklistSchema.parse(body);

    await connectDB();

    const scheme = await GovernmentScheme.findOne({ schemeId }).lean();
    if (!scheme) return handleApiError(new Error("Scheme not found"));

    const uploadedDocs = await UserDocument.find({ userId: user._id }).lean();
    const result = checklistAgent(
      schemeId,
      scheme.requiredDocuments,
      uploadedDocs.map((d) => ({
        documentType: d.documentType,
        status: d.status,
        expiryDate: d.expiryDate,
      }))
    );

    await Checklist.findOneAndUpdate(
      { userId: user._id, schemeId },
      {
        userId: user._id,
        schemeId,
        requiredDocuments: scheme.requiredDocuments,
        uploadedDocuments: result.uploaded,
        missingDocuments: result.missing,
        expiredDocuments: result.expired,
        completionPercentage: result.completionPercentage,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    await connectDB();
    const checklists = await Checklist.find({ userId: user._id }).lean();
    return apiSuccess(checklists);
  } catch (error) {
    return handleApiError(error);
  }
}
