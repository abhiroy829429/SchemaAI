import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { Application } from "@/models/Application";
import { applicationSchema } from "@/lib/validations";
import { roadmapAgent } from "@/agents/roadmap-agent";
import { trackerAgent } from "@/agents/tracker-agent";
import { ApplicationTimeline } from "@/models/ApplicationTimeline";
import { Notification } from "@/models/Notification";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    await connectDB();
    const applications = await Application.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    const enriched = applications.map((app) => ({
      ...app,
      tracker: trackerAgent(app.status as Parameters<typeof trackerAgent>[0]),
      roadmap: roadmapAgent(app.schemeName),
    }));

    return apiSuccess(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    const body = await req.json();
    const parsed = applicationSchema.parse(body);

    await connectDB();

    const existing = await Application.findOne({
      userId: user._id,
      schemeId: parsed.schemeId,
    });

    if (existing) {
      return apiSuccess(existing);
    }

    const application = await Application.create({
      userId: user._id,
      schemeId: parsed.schemeId,
      schemeName: parsed.schemeName,
      status: "draft",
      eligibilityStatus: "eligible",
      confidenceScore: 80,
    });

    const roadmap = roadmapAgent(parsed.schemeName);
    await ApplicationTimeline.create({
      applicationId: application._id,
      userId: user._id,
      schemeId: parsed.schemeId,
      events: roadmap.map((r, i) => ({
        title: r.title,
        description: r.description,
        status: i === 0 ? "in_progress" : "pending",
        order: r.step,
      })),
      currentStep: 0,
    });

    await Notification.create({
      userId: user._id,
      title: "Application Started",
      message: `Your application for ${parsed.schemeName} has been created.`,
      type: "success",
      link: "/dashboard/tracker",
    });

    return apiSuccess(application);
  } catch (error) {
    return handleApiError(error);
  }
}
