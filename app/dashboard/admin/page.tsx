"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Shield, BarChart3 } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({ schemes: 0, users: 0, applications: 0 });

  useEffect(() => {
    fetch("/api/schemes").then((r) => r.json()).then((d) => {
      if (d.success) setStats((s) => ({ ...s, schemes: d.data.length }));
    });
    fetch("/api/dashboard").then((r) => r.json()).then((d) => {
      if (d.success) setStats((s) => ({
        ...s,
        applications: d.data.stats?.totalApplications || 0,
      }));
    });
  }, []);

  const adminCards = [
    { label: "Total Schemes", value: stats.schemes, icon: Shield },
    { label: "Applications", value: stats.applications, icon: FileText },
    { label: "Platform Users", value: "100+", icon: Users },
    { label: "AI Agents", value: "8", icon: BarChart3 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage schemes, users, and platform analytics.</p>
          </div>
          <Badge variant="warning">Admin</Badge>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminCards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5">
                <c.icon className="h-5 w-5 text-primary mb-3" />
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Scheme Management</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• View and edit 30+ government schemes</p>
              <p>• Modify eligibility rules (structured JSON)</p>
              <p>• Add new central and state schemes</p>
              <p>• Toggle scheme active/inactive status</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Analytics</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Total eligibility analyses run</p>
              <p>• Most popular schemes by applications</p>
              <p>• User profile completion rates</p>
              <p>• Document upload statistics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
