import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { SystemEnergyPoints } from "@/utility/fetch";
import { linearizeSystemEnergyPoints } from "@/utility/linearizer";
import { useMemo } from "react";
import { StackedTooltip } from "./stacked-tooltip";
import { randomColorMap, yAxisFormatter } from "../lib";

export function StackedView({
  chartData,
  unit,
}: {
  chartData: SystemEnergyPoints;
  unit: string;
}) {
  const linearizedChartData = linearizeSystemEnergyPoints(chartData, unit);
  console.log("Linearized Chart Data:", linearizedChartData);
  const chartConfig = useMemo(() => {
    return chartData.stats.reduce<ChartConfig>((acc, inverter, i) => {
      if (inverter.inverterId) {
        acc[inverter.inverterId] = {
          label: inverter.inverterId,
          color: (() => {
            while (i > randomColorMap.size - 1) {
              const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
              randomColorMap.set(i, randomColor);
            }
            return (
              randomColorMap.get(i) ??
              `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
            );
          })(),
        };
      }
      return acc;
    }, {});
  }, [chartData.stats]);

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        className="w-full h-full"
        accessibilityLayer
        data={linearizedChartData}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="logTime"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickCount={48}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={10}
          tickFormatter={yAxisFormatter}
        />
        <ChartTooltip
          cursor={true}
          animationEasing="ease-out"
          content={<StackedTooltip />}
        />
        {
          /* Stacked lines */
          Object.entries(chartConfig).map(([inverterId, { color, label }]) => (
            <Line
              key={inverterId}
              dataKey={inverterId}
              type="natural"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          ))
        }
      </LineChart>
    </ChartContainer>
  );
}
