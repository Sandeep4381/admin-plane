"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { vehicle: "Cars", count: 275, fill: "var(--color-cars)" },
  { vehicle: "Bikes", count: 200, fill: "var(--color-bikes)" },
  { vehicle: "Scooters", count: 187, fill: "var(--color-scooters)" },
  { vehicle: "Auto", count: 173, fill: "var(--color-auto)" },
  { vehicle: "Other", count: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  cars: {
    label: "Cars",
    color: "hsl(var(--chart-1))",
  },
  bikes: {
    label: "Bikes",
    color: "hsl(var(--chart-2))",
  },
  scooters: {
    label: "Scooters",
    color: "hsl(var(--chart-3))",
  },
  auto: {
    label: "Auto",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export function VehicleSplitChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="vehicle"
          innerRadius={60}
          strokeWidth={5}
        >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
