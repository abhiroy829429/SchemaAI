"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface App {
  schemeName: string;
  status: string;
  confidenceScore: number;
  tracker: {
    progress: number;
    timeline: { status: string; label: string; completed: boolean; current: boolean }[];
    nextStep?: string;
  };
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => { if (d.success) setApplications(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Application Tracker</h1>
          <p className="text-sm text-muted-foreground">Track your scheme applications from submission to approval.</p>
        </div>

        {loading ? (
          <div className="animate-pulse h-48 bg-muted rounded-2xl" />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Apply for eligible schemes to start tracking your progress."
            action={{ label: "View Eligibility", href: "/dashboard/eligibility" }}
          />
        ) : (
          <div className="space-y-6">
            {applications.map((app, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{app.schemeName}</CardTitle>
                    <Badge variant="info">{app.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{app.tracker?.progress || 0}%</span>
                    </div>
                    <Progress value={app.tracker?.progress || 0} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.tracker?.timeline?.map((t) => (
                      <div key={t.status} className="flex items-center gap-1.5 text-xs">
                        {t.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : t.current ? (
                          <Clock className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={t.current ? "font-medium" : "text-muted-foreground"}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                  {app.tracker?.nextStep && (
                    <p className="text-xs text-muted-foreground">Next: {app.tracker.nextStep}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
