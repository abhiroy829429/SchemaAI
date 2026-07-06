import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-6">About GovAssist AI</h1>
          <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground">
            <p>
              GovAssist AI is an AI-powered government scheme eligibility platform built for the &ldquo;Agents for Good&rdquo; hackathon track. Our mission is to help every Indian citizen discover, understand, and apply for government schemes they qualify for.
            </p>
            <p>
              We use a hybrid AI architecture where a deterministic rule engine evaluates eligibility against structured criteria, and specialized AI agents explain results, recommend schemes, manage documents, and guide applications — without letting AI decide who qualifies.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Our Architecture</h2>
            <p>
              Eight LangGraph agents work together: Intake, Eligibility, Explanation, Document, Checklist, Roadmap, Tracker, and Recommendation agents — each handling a specific part of the citizen journey.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
