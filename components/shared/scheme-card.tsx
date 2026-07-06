"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { EligibilityResult } from "@/types";

interface SchemeCardProps {
  scheme: {
    schemeId: string;
    name: string;
    category: string;
    icon?: string;
    logo?: string;
    colorTheme?: string;
    benefits?: string[];
    slug?: string;
  };
  result?: EligibilityResult;
  explanation?: string;
  onApply?: () => void;
}

export function SchemeCard({ scheme, result, explanation, onApply }: SchemeCardProps) {
  const status = result?.status || "not_eligible";
  const statusVariant = status === "eligible" ? "success" : status === "possibly_eligible" ? "warning" : "destructive";
  const statusLabel = status === "eligible" ? "Eligible" : status === "possibly_eligible" ? "Possibly Eligible" : "Not Eligible";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="h-1" style={{ background: scheme.colorTheme || "#3B82F6" }} />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ background: `${scheme.colorTheme || "#3B82F6"}20` }}
              >
                {scheme.icon || scheme.logo || "🏛️"}
              </div>
              <div>
                <CardTitle className="text-base group-hover:text-primary transition-colors">{scheme.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{scheme.category}</p>
              </div>
            </div>
            <Badge variant={statusVariant as "success"}>{statusLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {result && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{result.confidenceScore}%</span>
              </div>
              <Progress value={result.confidenceScore} />
            </div>
          )}
          {scheme.benefits && scheme.benefits.length > 0 && (
            <p className="text-sm text-muted-foreground line-clamp-2">{scheme.benefits[0]}</p>
          )}
          {explanation && (
            <p className="text-xs text-muted-foreground line-clamp-2 italic">{explanation}</p>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          <Link href={`/dashboard/schemes/${scheme.slug || scheme.schemeId}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">View Details</Button>
          </Link>
          {status !== "not_eligible" && onApply && (
            <Button variant="gradient" size="sm" onClick={onApply}>Apply</Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
