"use client";

import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../../components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  completions: {
    label: "Lesson Completions",
    color: "hsl(var(--chart-1))",
  },
} as const;

interface MonthlyProgressChartProps {
  data: Array<{
    month: string;
    completions: number;
  }>;
}

export function MonthlyProgressChart({ data }: MonthlyProgressChartProps) {
  const chartData = data.map(month => ({
    month: new Date(month.month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    completions: month.completions,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="completions" 
          stroke="var(--color-completions)" 
          strokeWidth={2}
          dot={{ fill: "var(--color-completions)" }}
        />
      </LineChart>
    </ChartContainer>
  );
}
