"use server";

import { analyzeCancellationReasons, AnalyzeCancellationReasonsOutput } from "@/ai/flows/analyze-cancellation-reasons";

const emptyState: AnalyzeCancellationReasonsOutput = { 
    summary: "Please provide some cancellation reasons to analyze.",
    suggestions: ""
};

export async function getCancellationAnalysis(reasons: string[]): Promise<AnalyzeCancellationReasonsOutput> {
  if (!reasons || reasons.length === 0) {
    return emptyState;
  }
  try {
    const result = await analyzeCancellationReasons({ cancellationReasons: reasons });
    return result;
  } catch (error) {
    console.error("Error analyzing cancellation reasons:", error);
    return { 
        summary: "An error occurred while analyzing the reasons. Please check the logs and try again.",
        suggestions: "No suggestions could be generated due to an error."
    };
  }
}
