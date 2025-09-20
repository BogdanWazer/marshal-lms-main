"use client";

import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  completionRate: {
    label: "Completion Rate (%)",
    color: "hsl(var(--chart-2))",
  },
} as const;

interface CourseCompletionChartProps {
  data: Array<{
    courseId: string;
    courseTitle: string;
    totalLessons: number;
    totalEnrollments: number;
    completedLessons: number;
    completionRate: number;
  }>;
}

export function CourseCompletionChart({ data }: CourseCompletionChartProps) {
  const chartData = data
    .filter(course => course.totalEnrollments > 0)
    .map(course => ({
      name: course.courseTitle.length > 20 ? course.courseTitle.substring(0, 20) + "..." : course.courseTitle,
      completionRate: course.completionRate,
    }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="completionRate" fill="var(--color-completionRate)" />
      </BarChart>
    </ChartContainer>
  );
}
