"use client"
import { TrendingUp } from "lucide-react"
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"
export const description = "A bar chart"

const chartData = [
  { month: "January", cost: 186 },
  { month: "February", cost: 305 },
  { month: "March", cost: 237 },
  { month: "April", cost: 73 },
  { month: "May", cost: 209 },
  { month: "June", cost: 214 },
]
const chartConfig = {
  cost: {
    label: "Cost",
    color: "var(--chart-1)",
  },
}
export function ChartBarDefault() {
  return (
   
    <Card className = "bg-gray-100">
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="cost" fill="var(--color-cost)" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Spending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total AWS cost for the last 6 months
        </div>
      </CardFooter>
    </Card>

  )
}
