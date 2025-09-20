"use client";

import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../../components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "hsl(var(--chart-3))",
  },
} as const;

interface EnrollmentChartProps {
  data: Array<{
    courseId: string;
    courseTitle: string;
    totalLessons: number;
    totalEnrollments: number;
    completedLessons: number;
    completionRate: number;
  }>;
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  const chartData = data.map(course => ({
    name: course.courseTitle.length > 20 ? course.courseTitle.substring(0, 20) + "..." : course.courseTitle,
    enrollments: course.totalEnrollments,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <BarChart data={chartData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={150}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="enrollments" fill="var(--color-enrollments)" />
      </BarChart>
    </ChartContainer>
  );
}
