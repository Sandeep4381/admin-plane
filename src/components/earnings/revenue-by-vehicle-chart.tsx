
"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CardDescription } from "@/components/ui/card"

const chartData = [
  { vehicle: "Cars", revenue: 275000, fill: "var(--color-cars)" },
  { vehicle: "Bikes", revenue: 200000, fill: "var(--color-bikes)" },
  { vehicle: "Scooters", revenue: 187000, fill: "var(--color-scooters)" },
  { vehicle: "EVs", revenue: 173000, fill: "var(--color-evs)" },
  { vehicle: "Other", revenue: 90000, fill: "var(--color-other)" },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
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
  evs: {
    label: "EVs",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export function RevenueByVehicleChart() {
  return (
    <>
      <CardDescription>A breakdown of revenue by the type of vehicle rented.</CardDescription>
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
            dataKey="revenue"
            nameKey="vehicle"
            innerRadius={60}
            strokeWidth={5}
          >
          {chartData.map((entry) => (
            <Cell key={entry.vehicle} fill={entry.fill} />
          ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  )
}
