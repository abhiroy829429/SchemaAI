import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { intakeAgent } from "./intake-agent";
import { eligibilityAgent } from "./eligibility-agent";
import { explanationAgent } from "./explanation-agent";
import { documentAgent } from "./document-agent";
import { recommendationAgent } from "./recommendation-agent";
import type {
  AgentState,
  EligibilityResult,
  EligibilityRuleSet,
  Recommendation,
  StructuredProfile,
} from "@/types";

const AgentAnnotation = Annotation.Root({
  profile: Annotation<StructuredProfile>,
  rawProfile: Annotation<Record<string, unknown>>,
  schemes: Annotation<
    {
      schemeId: string;
      name: string;
      category: string;
      eligibilityRules: EligibilityRuleSet;
      requiredDocuments: string[];
    }[]
  >,
  eligibilityResults: Annotation<EligibilityResult[]>,
  explanations: Annotation<Record<string, string>>,
  requiredDocuments: Annotation<Record<string, string[]>>,
  recommendations: Annotation<Recommendation[]>,
  chatContext: Annotation<string>,
});

type GraphState = typeof AgentAnnotation.State;

async function intakeNode(state: GraphState) {
  const profile = intakeAgent(state.rawProfile);
  return { profile };
}

async function eligibilityNode(state: GraphState) {
  const results = eligibilityAgent(state.profile, state.schemes);
  return { eligibilityResults: results };
}

async function explanationNode(state: GraphState) {
  const explanations = await explanationAgent(state.profile, state.eligibilityResults);
  return { explanations };
}

async function documentNode(state: GraphState) {
  const requiredDocuments = documentAgent(
    state.eligibilityResults,
    state.schemes.map((s) => ({
      schemeId: s.schemeId,
      requiredDocuments: s.requiredDocuments,
    }))
  );
  return { requiredDocuments };
}

async function recommendationNode(state: GraphState) {
  const recommendations = recommendationAgent(
    state.profile,
    state.eligibilityResults,
    state.schemes.map((s) => ({
      schemeId: s.schemeId,
      name: s.name,
      category: s.category,
    }))
  );
  return { recommendations };
}

async function contextNode(state: GraphState) {
  const eligible = state.eligibilityResults.filter((r) => r.status === "eligible");
  const chatContext = `User profile: Age ${state.profile.age}, Income ₹${state.profile.annualIncome}, ${state.profile.state}. Eligible for ${eligible.length} schemes: ${eligible.map((e) => e.schemeName).join(", ")}.`;
  return { chatContext };
}

export function buildEligibilityGraph() {
  const graph = new StateGraph(AgentAnnotation)
    .addNode("intake", intakeNode)
    .addNode("eligibility", eligibilityNode)
    .addNode("explanation", explanationNode)
    .addNode("documents", documentNode)
    .addNode("generateRecommendations", recommendationNode)
    .addNode("context", contextNode)
    .addEdge(START, "intake")
    .addEdge("intake", "eligibility")
    .addEdge("eligibility", "explanation")
    .addEdge("explanation", "documents")
    .addEdge("documents", "generateRecommendations")
    .addEdge("generateRecommendations", "context")
    .addEdge("context", END);

  return graph.compile();
}

export async function runEligibilityPipeline(
  rawProfile: Record<string, unknown>,
  schemes: GraphState["schemes"]
): Promise<Partial<AgentState>> {
  const graph = buildEligibilityGraph();
  const result = await graph.invoke({
    rawProfile,
    schemes,
    profile: {} as StructuredProfile,
    eligibilityResults: [],
    explanations: {},
    requiredDocuments: {},
    recommendations: [],
    chatContext: "",
  });

  return {
    profile: result.profile,
    eligibilityResults: result.eligibilityResults,
    explanations: result.explanations,
    requiredDocuments: result.requiredDocuments,
    recommendations: result.recommendations,
    chatContext: result.chatContext,
  };
}
