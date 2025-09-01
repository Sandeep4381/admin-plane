'use server';
/**
 * @fileOverview Analyzes cancellation reasons using AI to identify key themes and patterns.
 *
 * - analyzeCancellationReasons - A function that analyzes cancellation reasons and returns a summary of key themes.
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
});
export type AnalyzeCancellationReasonsOutput = z.infer<typeof AnalyzeCancellationReasonsOutputSchema>;

export async function analyzeCancellationReasons(input: AnalyzeCancellationReasonsInput): Promise<AnalyzeCancellationReasonsOutput> {
  return analyzeCancellationReasonsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCancellationReasonsPrompt',
  input: {schema: AnalyzeCancellationReasonsInputSchema},
  output: {schema: AnalyzeCancellationReasonsOutputSchema},
  prompt: `You are an expert in analyzing text data and identifying key themes and patterns.

You will be provided with a list of cancellation reasons. Your task is to analyze these reasons and provide a summary of the key themes and patterns.

Cancellation Reasons:
{{#each cancellationReasons}}
- {{{this}}}
{{/each}}

Summary:`,
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
