import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { SystemEnergyPoints } from "@/utility/fetch";
import { linearizeSystemEnergyPointsForBarChart } from "@/utility/linearizer";
import { useMemo } from "react";
import { randomColorMap, yAxisFormatter } from "../lib";
import { BarTooltip } from "./bar-tooltip";

export function BarView({
  chartData,
  unit,
}: {
  chartData: SystemEnergyPoints;
  unit: string;
}) {
  const linearizedChartData = linearizeSystemEnergyPointsForBarChart(
    chartData,
    unit,
  );
  const chartConfig = useMemo(() => {
    return chartData.stats.reduce<ChartConfig>((acc, inverter, i) => {
      if (inverter.inverterId) {
        acc.energyProduced = {
          label: inverter.inverterId,
          color: (() => {
            while (i > randomColorMap.size - 1) {
              const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
              randomColorMap.set(i, randomColor);
            }
            return randomColorMap.get(i)!;
          })(),
        };
      }
      return acc;
    }, {});
  }, [chartData.stats.length > randomColorMap.size]);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={linearizedChartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="inverterId"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={12}
          tickFormatter={yAxisFormatter}
        />
        <ChartTooltip cursor={false} content={<BarTooltip />} />
        <Bar dataKey="energyProduced" fill="blue" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
