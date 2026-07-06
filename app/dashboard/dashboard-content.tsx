"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, FileText, FolderOpen, User, TrendingUp, ArrowRight, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  stats: {
    eligibleSchemes: number;
    totalApplications: number;
    missingDocuments: number;
    profileCompletion: number;
    totalDocuments: number;
  };
  recentActivity: { id: string; type: string; title: string; description: string; timestamp: string }[];
  applications: { schemeName: string; status: string; confidenceScore: number }[];
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    { label: "Eligible Schemes", value: stats?.eligibleSchemes ?? 0, icon: CheckCircle2, color: "text-emerald-500", href: "/dashboard/eligibility" },
    { label: "Applications", value: stats?.totalApplications ?? 0, icon: FileText, color: "text-blue-500", href: "/dashboard/tracker" },
    { label: "Missing Documents", value: stats?.missingDocuments ?? 0, icon: FolderOpen, color: "text-amber-500", href: "/dashboard/checklist" },
    { label: "Profile Complete", value: `${stats?.profileCompletion ?? 0}%`, icon: User, color: "text-violet-500", href: "/dashboard/profile" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here&apos;s your scheme overview.</p>
        </div>
        <Link href="/dashboard/eligibility">
          <Button variant="gradient">
            <Sparkles className="h-4 w-4" /> Run AI Analysis
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={s.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{stats?.profileCompletion ?? 0}%</span>
              </div>
              <Progress value={stats?.profileCompletion ?? 0} />
              {(stats?.profileCompletion ?? 0) < 100 && (
                <Link href="/dashboard/profile">
                  <Button variant="outline" size="sm" className="mt-2">
                    Complete Profile <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.applications && data.applications.length > 0 ? (
              <div className="space-y-3">
                {data.applications.map((app, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="text-sm font-medium">{app.schemeName}</p>
                      <Badge variant="info" className="mt-1">{app.status}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{app.confidenceScore}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No applications yet. Explore eligible schemes!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {data.recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
