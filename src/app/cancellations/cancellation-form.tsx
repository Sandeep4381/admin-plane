"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCancellationAnalysis } from "./actions";
import { Loader2, Wand2 } from "lucide-react";

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
].join("\n");


export function CancellationForm() {
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reasons: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis("");
    const reasonsArray = values.reasons.split('\n').filter(reason => reason.trim() !== '');
    const result = await getCancellationAnalysis(reasonsArray);
    setAnalysis(result.summary);
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
        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>AI is analyzing the data... this may take a moment.</p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{analysis}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
