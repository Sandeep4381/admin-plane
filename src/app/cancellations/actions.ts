"use server";

import { analyzeCancellationReasons } from "@/ai/flows/analyze-cancellation-reasons";

export async function getCancellationAnalysis(reasons: string[]) {
  if (!reasons || reasons.length === 0) {
    return { summary: "Please provide some cancellation reasons to analyze." };
  }
  try {
    const result = await analyzeCancellationReasons({ cancellationReasons: reasons });
    return result;
  } catch (error) {
    console.error("Error analyzing cancellation reasons:", error);
    return { summary: "An error occurred while analyzing the reasons. Please check the logs and try again." };
  }
}
