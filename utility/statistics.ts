
import { scaleLinear } from "d3-scale";
import { quantile, standardDeviation } from "simple-statistics";

interface AxisParams {
  domain: [number, number];
  ticks: number[];
}

export function computeSmartYAxisTicks(data: number[]): AxisParams {
  if (data.length === 0) {
    return { domain: [0, 1], ticks: [0, 1] };
  }

  // Sort data for quantile calculations
  const sorted = [...data].sort((a, b) => a - b);

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const std = standardDeviation(data) || 0;
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  // Spread measure using IQR or std dev fallback
  const spread = iqr > 0 ? iqr : std;

  // Decide tick count based on spread and range
  // More spread => fewer ticks, tight spread => more ticks
  let tickCount = 5; // default
  if (spread > 100) tickCount = 4;
  else if (spread > 50) tickCount = 6;
  else if (spread > 10) tickCount = 8;
  else tickCount = 10;

  // Padding to domain +/- 1x std deviation for breathing room
  const padding = std * 1;
  const domainMin = min - padding < 0 ? 0 : min - padding;
  const domainMax = max + padding;

  // Create scale with nice domain and ticks
  const scale = scaleLinear().domain([domainMin, domainMax]).nice(tickCount);
  const domain = scale.domain() as [number, number];
  const ticks = scale.ticks(tickCount);

  return { domain, ticks };
}
