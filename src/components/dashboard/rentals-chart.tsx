"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", rentals: 186 },
  { month: "February", rentals: 305 },
  { month: "March", rentals: 237 },
  { month: "April", rentals: 273 },
  { month: "May", rentals: 209 },
  { month: "June", rentals: 250 },
  { month: "July", rentals: 310 },
]

const chartConfig = {
  rentals: {
    label: "Rentals",
    color: "hsl(var(--primary))",
  },
}

export function RentalsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="rentals" fill="var(--color-rentals)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
