"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight, Shield, Brain, FileSearch, BarChart3, MessageSquare,
  CheckCircle2, Users, Sparkles, ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Brain, title: "Multi-Agent AI", desc: "8 specialized AI agents analyze your profile, evaluate eligibility, and explain results." },
  { icon: Shield, title: "Rule-Based Engine", desc: "Deterministic eligibility rules — AI explains, never decides your qualification." },
  { icon: FileSearch, title: "Document Center", desc: "Upload documents with mock OCR, track missing items, and complete checklists." },
  { icon: BarChart3, title: "Smart Dashboard", desc: "Track eligible schemes, applications, and progress in one beautiful dashboard." },
  { icon: MessageSquare, title: "AI Assistant", desc: "Chat in English or Hindi. Compare schemes, get advice, and understand benefits." },
  { icon: CheckCircle2, title: "Application Tracker", desc: "Follow your application from submission to benefits release with timeline view." },
];

const stats = [
  { value: "30+", label: "Government Schemes" },
  { value: "8", label: "AI Agents" },
  { value: "100%", label: "Rule-Based Accuracy" },
  { value: "24/7", label: "AI Support" },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up securely with Clerk authentication." },
  { step: "02", title: "Complete Profile", desc: "Add your age, income, occupation, state, and category details." },
  { step: "03", title: "AI Analysis", desc: "Our multi-agent system evaluates 30+ schemes against your profile." },
  { step: "04", title: "Apply & Track", desc: "Upload documents, follow roadmaps, and track application progress." },
];

const testimonials = [
  { name: "Priya Sharma", role: "Student, Maharashtra", text: "Found 5 scholarships I never knew existed. The AI explained everything in simple Hindi!" },
  { name: "Rajesh Kumar", role: "Farmer, UP", text: "PM Kisan eligibility was instant. The document checklist saved me multiple trips to the CSC." },
  { name: "Anita Devi", role: "Homemaker, Bihar", text: "Ujjwala Yojana application was so easy to track. GovAssist AI is a game changer." },
];

const faqs = [
  { q: "How does eligibility work?", a: "Our rule engine evaluates structured criteria — age, income, occupation, state, and more. AI only explains the results in natural language." },
  { q: "Is my data secure?", a: "Yes. We use Clerk for authentication, mask sensitive numbers like Aadhaar, and never store plain-text personal data." },
  { q: "Which schemes are covered?", a: "30+ central and state government schemes including PM Kisan, Ayushman Bharat, scholarships, pensions, and more." },
  { q: "Can I chat in Hindi?", a: "Absolutely! Ask the AI assistant anything in Hindi or English about schemes, documents, or application processes." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 hero-gradient overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                Agents for Good Hackathon 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                Discover Government Schemes{" "}
                <span className="gradient-text">You Qualify For</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                GovAssist AI uses a multi-agent system to analyze your profile against 30+ Indian government schemes — with transparent, rule-based eligibility and AI-powered explanations.
              </p>
              <div className="flex flex-wrap gap-3">
                <SignUpButton mode="modal">
                  <Button variant="gradient" size="lg">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
                <Link href="/dashboard/eligibility">
                  <Button variant="outline" size="lg">Explore Schemes</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl border border-border bg-card/80 glass p-6 shadow-2xl">
                <div className="space-y-4">
                  {[
                    { name: "PM Kisan", status: "Eligible", score: 92, color: "#16A34A" },
                    { name: "Ayushman Bharat", status: "Eligible", score: 88, color: "#DC2626" },
                    { name: "NSP Scholarship", status: "Possibly Eligible", score: 65, color: "#2563EB" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center gap-4 rounded-xl bg-background/50 p-4">
                      <div className="h-10 w-10 rounded-lg" style={{ background: `${s.color}20` }} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.status} · {s.score}% match</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A complete platform to discover, understand, and apply for government schemes.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Four simple steps to discover your eligible schemes.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white font-bold">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Citizens</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-4">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  {f.q}
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Schemes?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of citizens using AI to access government benefits.</p>
          <SignUpButton mode="modal">
            <Button variant="gradient" size="lg">
              Start Free Analysis <ArrowRight className="h-4 w-4" />
            </Button>
          </SignUpButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
