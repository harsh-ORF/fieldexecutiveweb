"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface DailyLoadingChartProps {
  dailyLoading: number[] | null;
}

export function DailyLoadingChart({ dailyLoading }: DailyLoadingChartProps) {
  // Transform the array into data format for the chart
  const chartData =
    dailyLoading?.map((value, index) => ({
      day: `Day ${index + 1}`,
      quantity: value,
    })) || [];

  if (!dailyLoading || dailyLoading.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Loading Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No loading data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Loading Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} tons`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].payload.day}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value} tons
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="quantity"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {chartData.map((data) => (
            <div
              key={data.day}
              className="flex flex-col items-center p-2 rounded-lg border bg-muted/50"
            >
              <span className="text-sm font-medium">{data.day}</span>
              <span className="text-lg font-bold">{data.quantity} tons</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
