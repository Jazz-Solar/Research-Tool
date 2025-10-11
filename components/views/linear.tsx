import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

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

export function LinearView() {
    console.log('Rendering LinearView with data:');
    return <ChartContainer config={chartConfig}>
        <LineChart
            className="w-full h-full"
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
}