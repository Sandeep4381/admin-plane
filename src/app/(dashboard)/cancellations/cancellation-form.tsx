
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCancellationAnalysis } from "./actions";
import { Loader2, Wand2, Lightbulb } from "lucide-react";
import type { AnalyzeCancellationReasonsOutput } from "@/ai/flows/analyze-cancellation-reasons";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  reasons: z.string().min(10, "Please enter at least a few reasons for analysis."),
});

const sampleReasons = [
  "Vehicle was not clean.",
  "Booked by mistake.",
  "Found a better price elsewhere.",
  "The shop owner was rude.",
  "Waited too long for vehicle pickup.",
  "Change of plans.",
  "Vehicle was not the one shown in the picture.",
  "GPS location of the shop was incorrect.",
  "The vehicle had mechanical issues.",
  "Customer service was unresponsive.",
  "Coupon code did not work.",
  "Needed a different type of vehicle."
].join("\n");


export function CancellationForm() {
  const [analysis, setAnalysis] = useState<AnalyzeCancellationReasonsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reasons: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    const reasonsArray = values.reasons.split('\n').filter(reason => reason.trim() !== '');
    const result = await getCancellationAnalysis(reasonsArray);
    setAnalysis(result);
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="reasons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Reasons</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter each cancellation reason on a new line."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue("reasons", sampleReasons)}
              disabled={isLoading}
            >
              Load Sample Data
            </Button>
          </div>
        </form>
      </Form>

      {(isLoading || analysis) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>AI is analyzing the data... this may take a moment.</p>
              </div>
            ) : analysis && (
              <div className="space-y-4">
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Wand2 className="h-4 w-4" />Key Themes Summary</h3>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{analysis.summary}</p>
                </div>
                {analysis.suggestions && (
                    <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4 text-yellow-400" />Actionable Suggestions</h3>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{analysis.suggestions}</p>
                    </div>
                    </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    