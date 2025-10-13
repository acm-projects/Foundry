"use client"
import { Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/app/components/ui/chart"
export const description = "A pie chart with a legend"
const chartData = [
  { browser: "ec2", cost: 275, fill: "var(--color-ec2)" },
  { browser: "s3", cost: 200, fill: "var(--color-s3)" },
  { browser: "rds", cost: 187, fill: "var(--color-rds)" },
  { browser: "dynamo", cost: 173, fill: "var(--color-dynamo)" },
]
const chartConfig = {
  cost: {
    label: "Cost",
  },
  ec2: {
    label: "EC2",
    color: "var(--chart-1)",
  },
  s3: {
    label: "S3",
    color: "var(--chart-2)",
  },
  rds: {
    label: "RDS",
    color: "var(--chart-3)",
  },
  dynamo: {
    label: "Dynamo",
    color: "var(--chart-4)",
  },
}
export function ChartPieLegend() {
  return (
    <ChartContainer config={chartConfig} className="mx-auto w-full max-w-xl">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-full max-w-sm">
          {/* The legend now lives INSIDE the PieChart */}
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="cost"
                nameKey="browser"
              />
              <ChartLegend
                verticalAlign="bottom"
                align="center"
                content={<ChartLegendContent nameKey="browser" />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartContainer>
  );
}

