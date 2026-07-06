"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { roadmapAgent } from "@/agents/roadmap-agent";
import type { RoadmapStep } from "@/types";

export default function RoadmapPage() {
  const [schemes, setSchemes] = useState<{ schemeId: string; name: string }[]>([]);
  const [selected, setSelected] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);

  useEffect(() => {
    fetch("/api/schemes").then((r) => r.json()).then((d) => {
      if (d.success && d.data.length > 0) {
        setSchemes(d.data);
        setSelected(d.data[0].schemeId);
        setRoadmap(roadmapAgent(d.data[0].name));
      }
    });
  }, []);

  function handleSchemeChange(schemeId: string) {
    setSelected(schemeId);
    const scheme = schemes.find((s) => s.schemeId === schemeId);
    if (scheme) setRoadmap(roadmapAgent(scheme.name));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Application Roadmap</h1>
          <p className="text-sm text-muted-foreground">Step-by-step guide to complete your scheme application.</p>
        </div>

        <Select value={selected} onChange={(e) => handleSchemeChange(e.target.value)}>
          {schemes.map((s) => <option key={s.schemeId} value={s.schemeId}>{s.name}</option>)}
        </Select>

        <div className="relative space-y-0">
          {roadmap.map((step, i) => (
            <div key={step.step} className="flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  step.status === "completed" ? "bg-emerald-500 text-white" :
                  step.status === "in_progress" ? "bg-primary text-white" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step.step}
                </div>
                {i < roadmap.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
              </div>
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                    {step.estimatedDays && (
                      <Badge variant="outline">~{step.estimatedDays} days</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
