import { connectDB } from "@/lib/mongodb";
import { GovernmentScheme } from "@/models/GovernmentScheme";
import { EligibilityRule } from "@/models/EligibilityRule";
import { User } from "@/models/User";
import { Application } from "@/models/Application";
import { UserDocument } from "@/models/Document";
import { Notification } from "@/models/Notification";
import { ApplicationTimeline } from "@/models/ApplicationTimeline";
import { Checklist } from "@/models/Checklist";
import { SCHEMES_SEED } from "./schemes";
import { INDIAN_STATES, OCCUPATIONS, EDUCATION_LEVELS, SOCIAL_CATEGORIES, DOCUMENT_TYPES, APPLICATION_STATUSES } from "@/lib/constants";

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB");

  await Promise.all([
    GovernmentScheme.deleteMany({}),
    EligibilityRule.deleteMany({}),
    User.deleteMany({ clerkId: /^seed_/ }),
    Application.deleteMany({}),
    UserDocument.deleteMany({}),
    Notification.deleteMany({}),
    ApplicationTimeline.deleteMany({}),
    Checklist.deleteMany({}),
  ]);

  console.log("Cleared existing seed data");

  const schemes = await GovernmentScheme.insertMany(SCHEMES_SEED);
  console.log(`Seeded ${schemes.length} government schemes`);

  const rules = SCHEMES_SEED.map((s) => ({
    schemeId: s.schemeId,
    ruleName: `${s.name} Eligibility Rules`,
    conditions: s.eligibilityRules.conditions,
    logic: s.eligibilityRules.logic,
    priority: 1,
    isActive: true,
  }));
  await EligibilityRule.insertMany(rules);
  console.log(`Seeded ${rules.length} eligibility rules`);

  const users = [];
  for (let i = 1; i <= 100; i++) {
    users.push({
      clerkId: `seed_user_${i}`,
      email: `demo${i}@govassist.ai`,
      name: `Demo User ${i}`,
      dateOfBirth: new Date(1980 + (i % 30), i % 12, (i % 28) + 1),
      age: 20 + (i % 45),
      gender: i % 3 === 0 ? "female" : "male",
      phone: `98765${String(i).padStart(5, "0")}`,
      annualIncome: 50000 + (i * 15000) % 800000,
      occupation: OCCUPATIONS[i % OCCUPATIONS.length],
      education: EDUCATION_LEVELS[i % EDUCATION_LEVELS.length],
      category: SOCIAL_CATEGORIES[i % SOCIAL_CATEGORIES.length],
      state: INDIAN_STATES[i % INDIAN_STATES.length],
      district: `District ${i % 20}`,
      isStudent: i % 5 === 0,
      isFarmer: i % 7 === 0,
      isBusinessOwner: i % 11 === 0,
      hasDisability: i % 23 === 0,
      isWidow: i % 17 === 0 && i % 3 === 0,
      profileCompletion: 60 + (i % 40),
      role: i === 1 ? "admin" : "user",
    });
  }
  const insertedUsers = await User.insertMany(users);
  console.log(`Seeded ${insertedUsers.length} demo users`);

  const applications = [];
  for (let i = 0; i < 250; i++) {
    const user = insertedUsers[i % insertedUsers.length];
    const scheme = schemes[i % schemes.length];
    applications.push({
      userId: user._id,
      schemeId: scheme.schemeId,
      schemeName: scheme.name,
      status: APPLICATION_STATUSES[i % APPLICATION_STATUSES.length],
      eligibilityStatus: i % 3 === 0 ? "eligible" : i % 3 === 1 ? "possibly_eligible" : "not_eligible",
      confidenceScore: 40 + (i % 55),
      submittedAt: i % 2 === 0 ? new Date(Date.now() - i * 86400000) : undefined,
    });
  }
  const insertedApps = await Application.insertMany(applications, { ordered: false }).catch(() =>
    Application.find({}).limit(250)
  );
  console.log(`Seeded applications`);

  const docs = [];
  for (let i = 0; i < 150; i++) {
    const user = insertedUsers[i % insertedUsers.length];
    docs.push({
      userId: user._id,
      name: `Document_${i}.pdf`,
      documentType: DOCUMENT_TYPES[i % DOCUMENT_TYPES.length],
      fileUrl: `/mock-uploads/doc-${i}.pdf`,
      mimeType: "application/pdf",
      fileSize: 102400 + i * 1000,
      extractedData: {
        name: user.name,
        dateOfBirth: "1990-01-01",
        documentNumber: "XXXX",
        maskedNumber: "XXXX-XXXX",
      },
      status: i % 4 === 0 ? "verified" : "pending",
    });
  }
  await UserDocument.insertMany(docs);
  console.log(`Seeded ${docs.length} documents`);

  const notifications = [];
  for (let i = 0; i < 200; i++) {
    notifications.push({
      userId: insertedUsers[i % insertedUsers.length]._id,
      title: i % 2 === 0 ? "Eligibility Updated" : "Document Verified",
      message: i % 2 === 0 ? "Your eligibility analysis is ready." : "Your uploaded document has been verified.",
      type: i % 3 === 0 ? "success" : "info",
      isRead: i % 4 === 0,
      link: "/dashboard/eligibility",
    });
  }
  await Notification.insertMany(notifications);
  console.log(`Seeded ${notifications.length} notifications`);

  const timelines = [];
  const apps = Array.isArray(insertedApps) ? insertedApps : await Application.find({}).limit(100);
  for (const app of apps.slice(0, 100)) {
    timelines.push({
      applicationId: app._id,
      userId: app.userId,
      schemeId: app.schemeId,
      events: [
        { title: "Application Submitted", description: "Application received", status: "completed", order: 1, timestamp: new Date() },
        { title: "Document Verification", description: "Documents under review", status: "in_progress", order: 2 },
        { title: "Final Approval", description: "Pending approval", status: "pending", order: 3 },
      ],
      currentStep: 1,
    });
  }
  await ApplicationTimeline.insertMany(timelines);
  console.log(`Seeded ${timelines.length} application timelines`);

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
