"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ChecklistData {
  schemeId: string;
  uploaded: string[];
  missing: string[];
  expired: string[];
  completionPercentage: number;
}

export default function ChecklistPage() {
  const [schemes, setSchemes] = useState<{ schemeId: string; name: string }[]>([]);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/schemes").then((r) => r.json()).then((d) => {
      if (d.success) {
        setSchemes(d.data);
        if (d.data.length > 0) setSelectedScheme(d.data[0].schemeId);
      }
    });
  }, []);

  async function generateChecklist() {
    if (!selectedScheme) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeId: selectedScheme }),
      });
      const data = await res.json();
      if (data.success) setChecklist(data.data);
      else toast.error(data.error);
    } catch {
      toast.error("Failed to generate checklist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedScheme) generateChecklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScheme]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Document Checklist</h1>
          <p className="text-sm text-muted-foreground">Track required vs uploaded documents for each scheme.</p>
        </div>

        <div className="flex gap-3">
          <Select value={selectedScheme} onChange={(e) => setSelectedScheme(e.target.value)} className="flex-1">
            {schemes.map((s) => <option key={s.schemeId} value={s.schemeId}>{s.name}</option>)}
          </Select>
          <Button variant="gradient" onClick={generateChecklist} disabled={loading}>
            Refresh
          </Button>
        </div>

        {checklist && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion</span>
                  <span className="font-bold text-lg">{checklist.completionPercentage}%</span>
                </div>
                <Progress value={checklist.completionPercentage} />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Uploaded</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {checklist.uploaded.length > 0 ? checklist.uploaded.map((d) => (
                    <Badge key={d} variant="success">{d}</Badge>
                  )) : <p className="text-xs text-muted-foreground">None yet</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" /> Missing</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {checklist.missing.length > 0 ? checklist.missing.map((d) => (
                    <Badge key={d} variant="destructive">{d}</Badge>
                  )) : <p className="text-xs text-muted-foreground">All uploaded!</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> Expired</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {checklist.expired.length > 0 ? checklist.expired.map((d) => (
                    <Badge key={d} variant="warning">{d}</Badge>
                  )) : <p className="text-xs text-muted-foreground">None expired</p>}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
