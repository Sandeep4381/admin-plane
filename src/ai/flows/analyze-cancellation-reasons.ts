'use server';
/**
 * @fileOverview Analyzes cancellation reasons using AI to identify key themes, patterns, and provide actionable suggestions.
 *
 * - analyzeCancellationReasons - A function that analyzes cancellation reasons and returns a summary of key themes and suggestions.
 * - AnalyzeCancellationReasonsInput - The input type for the analyzeCancellationReasons function.
 * - AnalyzeCancellationReasonsOutput - The return type for the analyzeCancellationReasons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCancellationReasonsInputSchema = z.object({
  cancellationReasons: z.array(z.string()).describe('An array of cancellation reasons.'),
});
export type AnalyzeCancellationReasonsInput = z.infer<typeof AnalyzeCancellationReasonsInputSchema>;

const AnalyzeCancellationReasonsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key themes and patterns in the cancellation reasons.'),
  suggestions: z.string().describe('Actionable suggestions to help reduce cancellations based on the provided reasons.'),
});
export type AnalyzeCancellationReasonsOutput = z.infer<typeof AnalyzeCancellationReasonsOutputSchema>;

export async function analyzeCancellationReasons(input: AnalyzeCancellationReasonsInput): Promise<AnalyzeCancellationReasonsOutput> {
  return analyzeCancellationReasonsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCancellationReasonsPrompt',
  input: {schema: AnalyzeCancellationReasonsInputSchema},
  output: {schema: AnalyzeCancellationReasonsOutputSchema},
  prompt: `You are an expert in analyzing customer feedback for a vehicle rental platform and providing actionable business intelligence.

You will be provided with a list of cancellation reasons. Your task is to analyze these reasons and perform two tasks:
1.  Provide a concise summary of the key themes and patterns.
2.  Provide actionable suggestions for the business to reduce cancellations based on these themes.

Cancellation Reasons:
{{#each cancellationReasons}}
- {{{this}}}
{{/each}}
`,
});

const analyzeCancellationReasonsFlow = ai.defineFlow(
  {
    name: 'analyzeCancellationReasonsFlow',
    inputSchema: AnalyzeCancellationReasonsInputSchema,
    outputSchema: AnalyzeCancellationReasonsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
