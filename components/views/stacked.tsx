import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { SystemEnergyPoints } from "@/utility/fetch";
import { computeSmartYAxisTicks } from "@/utility/statistics";

const chartData = [
  { month: "January", desktop: 4000, mobile: 2400, tablet: 2400 },
  { month: "February", desktop: 3000, mobile: 1398, tablet: 2210 },
  { month: "March", desktop: 2000, mobile: 9800, tablet: 2290 },
  { month: "April", desktop: 2780, mobile: 3908, tablet: 2000 },
  { month: "May", desktop: 1890, mobile: 4800, tablet: 2181 },
  { month: "June", desktop: 2390, mobile: 3800, tablet: 2500 },
  { month: "July", desktop: 3490, mobile: 4300, tablet: 2100 },
  { month: "August", desktop: 3490, mobile: 4300, tablet: 2100 },
  { month: "September", desktop: 3490, mobile: 4300, tablet: 2100 },
  { month: "October", desktop: 3490, mobile: 4300, tablet: 2100 },
  { month: "November", desktop: 3490, mobile: 4300, tablet: 2100 },
  { month: "December", desktop: 3490, mobile: 4300, tablet: 2100 },
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
} satisfies ChartConfig;

export function StackedView({
  chartDataOriginal,
}: {
  chartDataOriginal: SystemEnergyPoints;
}) {
  console.log("Rendering StackedView with data:", chartDataOriginal);
  const yValues = chartData.reduce((acc, point) => {
    acc.push(point.desktop, point.mobile, point.tablet);
    return acc;
  }, [] as number[]);
  const { domain, ticks } = computeSmartYAxisTicks(yValues);
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        className="w-full h-full"
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
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
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={domain}
          ticks={ticks}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{
            fill: "var(--chart-1)",
          }}
          activeDot={{
            r: 6,
          }}
        >
        </Line>
        <Line
          dataKey="mobile"
          type="natural"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={{
            fill: "var(--chart-2)",
          }}
          activeDot={{
            r: 6,
          }}
        >
        </Line>
        <Line
          dataKey="tablet"
          type="natural"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={{
            fill: "var(--chart-3)",
          }}
          activeDot={{
            r: 6,
          }}
        >
        </Line>
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
