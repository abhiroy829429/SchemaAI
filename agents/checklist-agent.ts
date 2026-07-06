import type { ChecklistResult } from "@/types";

interface UploadedDoc {
  documentType: string;
  status: string;
  expiryDate?: Date;
}

export function checklistAgent(
  schemeId: string,
  requiredDocuments: string[],
  uploadedDocs: UploadedDoc[]
): ChecklistResult {
  const uploadedTypes = uploadedDocs
    .filter((d) => d.status !== "rejected")
    .map((d) => d.documentType);

  const now = new Date();
  const expired = uploadedDocs
    .filter((d) => d.expiryDate && new Date(d.expiryDate) < now)
    .map((d) => d.documentType);

  const validUploaded = uploadedTypes.filter((t) => !expired.includes(t));
  const missing = requiredDocuments.filter(
    (doc) => !validUploaded.includes(doc)
  );

  const completionPercentage =
    requiredDocuments.length > 0
      ? Math.round(
          ((requiredDocuments.length - missing.length) / requiredDocuments.length) * 100
        )
      : 0;

  return {
    schemeId,
    uploaded: validUploaded,
    missing,
    expired,
    completionPercentage,
  };
}
