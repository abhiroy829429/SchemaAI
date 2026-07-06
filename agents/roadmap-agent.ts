import type { RoadmapStep } from "@/types";

export function roadmapAgent(schemeName: string): RoadmapStep[] {
  return [
    {
      step: 1,
      title: "Collect Documents",
      description: `Gather all required documents for ${schemeName} including Aadhaar, income proof, and category certificates.`,
      status: "pending",
      estimatedDays: 7,
    },
    {
      step: 2,
      title: "Registration",
      description: "Register on the official portal or visit the nearest Common Service Centre (CSC).",
      status: "pending",
      estimatedDays: 1,
    },
    {
      step: 3,
      title: "Application Submission",
      description: "Fill the application form with accurate details and upload scanned documents.",
      status: "pending",
      estimatedDays: 2,
    },
    {
      step: 4,
      title: "Verification",
      description: "Authorities verify your documents and eligibility criteria.",
      status: "pending",
      estimatedDays: 15,
    },
    {
      step: 5,
      title: "Approval",
      description: "Application reviewed and approved by the concerned department.",
      status: "pending",
      estimatedDays: 10,
    },
    {
      step: 6,
      title: "Benefits Received",
      description: "Scheme benefits credited to your bank account or delivered as applicable.",
      status: "pending",
      estimatedDays: 7,
    },
  ];
}

export function updateRoadmapProgress(
  roadmap: RoadmapStep[],
  currentStep: number
): RoadmapStep[] {
  return roadmap.map((step) => ({
    ...step,
    status:
      step.step < currentStep
        ? "completed"
        : step.step === currentStep
          ? "in_progress"
          : "pending",
  }));
}
