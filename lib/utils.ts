import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\s/g, "");
  if (cleaned.length !== 12) return "XXXX-XXXX-XXXX";
  return `XXXX-XXXX-${cleaned.slice(-4)}`;
}

export function getProfileCompletion(profile: Record<string, unknown>): number {
  const fields = [
    "name",
    "dateOfBirth",
    "gender",
    "annualIncome",
    "occupation",
    "education",
    "category",
    "state",
    "district",
    "phone",
  ];
  const filled = fields.filter((f) => {
    const val = profile[f];
    return val !== undefined && val !== null && val !== "";
  });
  return Math.round((filled.length / fields.length) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
