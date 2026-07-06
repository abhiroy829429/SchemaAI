import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, FileSearch, BarChart3, MessageSquare, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Brain, title: "Multi-Agent AI System", desc: "8 specialized agents powered by LangGraph orchestrate the entire eligibility workflow." },
  { icon: Shield, title: "Hybrid Architecture", desc: "Rule engine for decisions, AI for explanations — transparent and auditable." },
  { icon: FileSearch, title: "Document Management", desc: "Upload, OCR extraction, checklist tracking, and missing document alerts." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time stats on eligible schemes, applications, and profile completion." },
  { icon: MessageSquare, title: "Bilingual AI Chat", desc: "Ask questions in English or Hindi about any scheme or application process." },
  { icon: CheckCircle2, title: "Application Tracking", desc: "End-to-end timeline from document collection to benefits release." },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-4 text-center">Platform Features</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to navigate India&apos;s government scheme ecosystem.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-6">
                  <f.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
