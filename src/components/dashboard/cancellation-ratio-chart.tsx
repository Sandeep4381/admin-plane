"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { status: "Completed", count: 25480, fill: "var(--color-completed)" },
  { status: "Cancelled", count: 890, fill: "var(--color-cancelled)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-5))",
  },
}

export function CancellationRatioChart() {
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
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
        {chartData.map((entry) => (
          <Cell key={entry.status} fill={entry.fill} />
        ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
