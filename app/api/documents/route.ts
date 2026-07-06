import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { UserDocument } from "@/models/Document";
import { uploadDocument, mockOCR } from "@/services/cloudinary";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    await connectDB();
    const documents = await UserDocument.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(documents);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as string;
    const schemeId = formData.get("schemeId") as string | null;

    if (!file || !documentType) {
      return handleApiError(new Error("File and document type are required"));
    }

    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return handleApiError(new Error("Only PDF, PNG, and JPG files are allowed"));
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadDocument(buffer, file.name);
    const ocrData = mockOCR(documentType);

    await connectDB();
    const doc = await UserDocument.create({
      userId: user._id,
      name: file.name,
      documentType,
      fileUrl: url,
      filePublicId: publicId,
      mimeType: file.type,
      fileSize: file.size,
      extractedData: ocrData,
      status: "pending",
      schemeId: schemeId || undefined,
    });

    return apiSuccess(doc);
  } catch (error) {
    return handleApiError(error);
  }
}
