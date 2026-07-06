import type { ApplicationStatus } from "@/types";

const STATUS_ORDER: ApplicationStatus[] = [
  "draft",
  "submitted",
  "verification",
  "review",
  "approved",
  "benefits_released",
];

export interface TrackerResult {
  currentStatus: ApplicationStatus;
  progress: number;
  timeline: {
    status: ApplicationStatus;
    label: string;
    completed: boolean;
    current: boolean;
  }[];
  nextStep?: string;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  verification: "Verification",
  review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  benefits_released: "Benefits Released",
};

export function trackerAgent(status: ApplicationStatus): TrackerResult {
  const currentIndex = STATUS_ORDER.indexOf(status);
  const progress = status === "rejected"
    ? 0
    : Math.round(((currentIndex + 1) / STATUS_ORDER.length) * 100);

  const timeline = STATUS_ORDER.map((s, i) => ({
    status: s,
    label: STATUS_LABELS[s],
    completed: i < currentIndex,
    current: i === currentIndex,
  }));

  const nextStep =
    currentIndex < STATUS_ORDER.length - 1
      ? STATUS_LABELS[STATUS_ORDER[currentIndex + 1]]
      : undefined;

  return { currentStatus: status, progress, timeline, nextStep };
}
