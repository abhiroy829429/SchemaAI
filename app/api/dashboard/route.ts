import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/services/auth";
import { Application } from "@/models/Application";
import { UserDocument } from "@/models/Document";
import { Notification } from "@/models/Notification";
import { Checklist } from "@/models/Checklist";
import { GovernmentScheme } from "@/models/GovernmentScheme";
import { runEligibilityPipeline } from "@/agents/graph";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return handleApiError(new Error("Unauthorized"));

    await connectDB();

    const [applications, documents, notifications, schemes] = await Promise.all([
      Application.find({ userId: user._id }).lean(),
      UserDocument.find({ userId: user._id }).lean(),
      Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5).lean(),
      GovernmentScheme.find({ isActive: true }).lean(),
    ]);

    let eligibleCount = 0;
    try {
      const pipeline = await runEligibilityPipeline(
        user.toObject(),
        schemes.map((s) => ({
          schemeId: s.schemeId,
          name: s.name,
          category: s.category,
          eligibilityRules: {
            conditions: s.eligibilityRules.conditions.map((c) => ({
              ...c,
              operator: c.operator as "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains" | "boolean",
              value: c.value as unknown as string | number | boolean | string[],
            })),
            logic: s.eligibilityRules.logic,
          },
          requiredDocuments: s.requiredDocuments,
        }))
      );
      eligibleCount = pipeline.eligibilityResults?.filter((r) => r.status === "eligible").length || 0;
    } catch {
      eligibleCount = 0;
    }

    const checklists = await Checklist.find({ userId: user._id }).lean();
    const missingDocs = checklists.reduce((acc, c) => acc + c.missingDocuments.length, 0);

    const recentActivity = [
      ...notifications.map((n) => ({
        id: n._id.toString(),
        type: "notification" as const,
        title: n.title,
        description: n.message,
        timestamp: n.createdAt,
      })),
      ...applications.slice(0, 3).map((a) => ({
        id: a._id.toString(),
        type: "application" as const,
        title: a.schemeName,
        description: `Status: ${a.status}`,
        timestamp: a.updatedAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

    return apiSuccess({
      stats: {
        eligibleSchemes: eligibleCount,
        totalApplications: applications.length,
        missingDocuments: missingDocs || Math.max(0, 5 - documents.length),
        profileCompletion: user.profileCompletion,
        totalDocuments: documents.length,
      },
      recentActivity,
      applications: applications.slice(0, 5),
      notifications: notifications.slice(0, 5),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
