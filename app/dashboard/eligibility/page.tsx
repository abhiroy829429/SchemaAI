"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Search, Filter, Download, Sparkles, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SchemeCard } from "@/components/shared/scheme-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SCHEME_CATEGORIES } from "@/lib/constants";
import type { EligibilityResult } from "@/types";

interface Scheme {
  schemeId: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  logo: string;
  colorTheme: string;
  benefits: string[];
}

export default function EligibilityPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("confidence");

  useEffect(() => {
    Promise.all([
      fetch("/api/schemes").then((r) => r.json()),
      fetch("/api/eligibility", { method: "POST" }).then((r) => r.json()).catch(() => null),
    ]).then(([schemesRes, eligibilityRes]) => {
      if (schemesRes.success) setSchemes(schemesRes.data);
      if (eligibilityRes?.success) {
        setResults(eligibilityRes.data.results || []);
        setExplanations(eligibilityRes.data.explanations || {});
      }
    }).finally(() => setLoading(false));
  }, []);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/eligibility", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResults(data.data.results);
        setExplanations(data.data.explanations);
        toast.success("Eligibility analysis complete!");
      }
    } catch {
      toast.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleApply(scheme: Scheme) {
    const res = await fetch("/api/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schemeId: scheme.schemeId, schemeName: scheme.name }),
    });
    const data = await res.json();
    if (data.success) toast.success(`Application started for ${scheme.name}`);
    else toast.error(data.error || "Failed to create application");
  }

  const filtered = useMemo(() => {
    let items = schemes.map((s) => ({
      scheme: s,
      result: results.find((r) => r.schemeId === s.schemeId),
    }));

    if (search) items = items.filter((i) => i.scheme.name.toLowerCase().includes(search.toLowerCase()));
    if (category) items = items.filter((i) => i.scheme.category === category);
    if (statusFilter) items = items.filter((i) => i.result?.status === statusFilter);

    if (sortBy === "name") items.sort((a, b) => a.scheme.name.localeCompare(b.scheme.name));
    else if (sortBy === "category") items.sort((a, b) => a.scheme.category.localeCompare(b.scheme.category));
    else items.sort((a, b) => (b.result?.confidenceScore || 0) - (a.result?.confidenceScore || 0));

    return items;
  }, [schemes, results, search, category, statusFilter, sortBy]);

  const eligibleCount = results.filter((r) => r.status === "eligible").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Eligibility Results</h1>
            <p className="text-sm text-muted-foreground">
              {results.length > 0 ? `${eligibleCount} schemes matched your profile` : "Run analysis to discover eligible schemes"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="gradient" onClick={runAnalysis} disabled={analyzing}>
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {analyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4" /> Report
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search schemes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-40">
            <option value="">All Categories</option>
            {SCHEME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
            <option value="">All Status</option>
            <option value="eligible">Eligible</option>
            <option value="possibly_eligible">Possibly Eligible</option>
            <option value="not_eligible">Not Eligible</option>
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-36">
            <option value="confidence">By Score</option>
            <option value="name">By Name</option>
            <option value="category">By Category</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No schemes found"
            description="Try adjusting your filters or run eligibility analysis."
            action={{ label: "Run Analysis", href: "#" }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(({ scheme, result }) => (
              <SchemeCard
                key={scheme.schemeId}
                scheme={scheme}
                result={result}
                explanation={explanations[scheme.schemeId]}
                onApply={() => handleApply(scheme)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
