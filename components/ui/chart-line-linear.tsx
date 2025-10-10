"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A linear line chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 120, tablet: 90 },
    { month: "February", desktop: 305, mobile: 210, tablet: 130 },
    { month: "March", desktop: 237, mobile: 160, tablet: 100 },
    { month: "April", desktop: 73, mobile: 90, tablet: 65 },
    { month: "May", desktop: 209, mobile: 190, tablet: 115 },
    { month: "June", desktop: 214, mobile: 220, tablet: 140 },
]


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
    tablet: {
        label: "Tablet",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig


export function ChartLineLinear() {
    return (
        <Card className="w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Line Chart - Linear</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="desktop"
                            type="linear"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="mobile"
                            type="linear"
                            stroke="var(--chart-2)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="tablet"
                            type="linear"
                            stroke="var(--chart-3)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
