
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { type: "New", cancellations: 186 },
  { type: "Returning", cancellations: 305 },
  { type: "Verified", cancellations: 237 },
]

const chartConfig = {
  cancellations: {
    label: "Cancellations",
    color: "hsl(var(--primary))",
  },
}

export function CancellationsByUserTypeChart() {
  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="cancellations" fill="var(--color-cancellations)" radius={4} />
            </BarChart>
            </ChartContainer>
        </ResponsiveContainer>
    </div>
  )
}

    