import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadDocument(
  fileBuffer: Buffer,
  fileName: string,
  folder = "govassist/documents"
): Promise<{ url: string; publicId: string }> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY
  ) {
    return {
      url: `/mock-uploads/${fileName}`,
      publicId: `mock-${Date.now()}`,
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`,
        },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(fileBuffer);
  });
}

export function mockOCR(documentType: string): {
  name: string;
  dateOfBirth: string;
  documentNumber: string;
  maskedNumber: string;
} {
  const mockData: Record<string, ReturnType<typeof mockOCR>> = {
    "Aadhaar Card": {
      name: "Demo User",
      dateOfBirth: "1995-06-15",
      documentNumber: "123456789012",
      maskedNumber: "XXXX-XXXX-9012",
    },
    "PAN Card": {
      name: "Demo User",
      dateOfBirth: "1995-06-15",
      documentNumber: "ABCDE1234F",
      maskedNumber: "ABCXX1234F",
    },
  };

  return (
    mockData[documentType] || {
      name: "Extracted Name",
      dateOfBirth: "1990-01-01",
      documentNumber: "DOC" + Math.random().toString(36).slice(2, 10).toUpperCase(),
      maskedNumber: "XXXX-XXXX",
    }
  );
}

export async function deleteDocument(publicId: string): Promise<void> {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    await cloudinary.uploader.destroy(publicId);
  }
}
