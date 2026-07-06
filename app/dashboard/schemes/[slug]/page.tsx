"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ExternalLink, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { roadmapAgent } from "@/agents/roadmap-agent";

interface SchemeDetail {
  schemeId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  ministry: string;
  level: string;
  benefits: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  approvalTime: string;
  faqs: { question: string; answer: string }[];
  officialWebsite: string;
  helpline: string;
  icon: string;
  colorTheme: string;
  eligibilityRules: { conditions: { label?: string; field: string }[] };
}

export default function SchemeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [scheme, setScheme] = useState<SchemeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/schemes?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setScheme(d.data); })
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleApply() {
    if (!scheme) return;
    const res = await fetch("/api/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schemeId: scheme.schemeId, schemeName: scheme.name }),
    });
    const data = await res.json();
    if (data.success) toast.success("Application created!");
    else toast.error(data.error);
  }

  if (loading) {
    return <DashboardLayout><Skeleton className="h-96" /></DashboardLayout>;
  }

  if (!scheme) {
    return (
      <DashboardLayout>
        <p>Scheme not found.</p>
        <Link href="/dashboard/eligibility"><Button variant="outline" className="mt-4">Back</Button></Link>
      </DashboardLayout>
    );
  }

  const roadmap = roadmapAgent(scheme.name);

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <Link href="/dashboard/eligibility" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Eligibility
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl" style={{ background: `${scheme.colorTheme}20` }}>
            {scheme.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{scheme.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="info">{scheme.category}</Badge>
              <Badge variant="outline">{scheme.level === "central" ? "Central Govt" : "State Govt"}</Badge>
              <Badge variant="outline">{scheme.ministry}</Badge>
            </div>
          </div>
          <Button variant="gradient" onClick={handleApply}>Apply Now</Button>
        </div>

        <p className="text-muted-foreground">{scheme.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Benefits</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {scheme.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  {b}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Required Documents</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {scheme.requiredDocuments.map((d) => (
                <Badge key={d} variant="outline">{d}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Eligibility Criteria</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {scheme.eligibilityRules.conditions.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {c.label || `${c.field} requirement`}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Application Process</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {scheme.applicationProcess.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground mt-4">Estimated approval: {scheme.approvalTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Application Timeline</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {roadmap.map((r) => (
              <div key={r.step} className="text-center">
                <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">{r.step}</div>
                <p className="text-xs">{r.title}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">FAQs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {scheme.faqs.map((f) => (
              <div key={f.question}>
                <p className="font-medium text-sm">{f.question}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <a href={scheme.officialWebsite} target="_blank" rel="noopener noreferrer">
            <Button variant="outline"><ExternalLink className="h-4 w-4" /> Official Website</Button>
          </a>
          <Button variant="outline"><Phone className="h-4 w-4" /> Helpline: {scheme.helpline}</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
