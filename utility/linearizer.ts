import { SystemEnergyPoints } from "./fetch";

type LinearData = { logTime: string; [key: string]: number | string }[];

export function linearizeSystemEnergyPoints(
  data: SystemEnergyPoints,
  unit: string,
): LinearData {
  if (!data || !data.stats) {
    return [];
  }
  // if dateString is not yyyy-mm-dd then make divideFactor to 1000
  let divideFactor = unit === "kWh" ? 1000 : 1;
  // Step 1: Preprocess each inverter's stats into a Map for O(1) lookups.
  // This is a linear pass over all inverter data points.
  const inverterDataMaps = data.stats
    .map((inverter) => {
      const inverterId = inverter.inverterId;
      if (!inverterId) return null;

      const timeMap = new Map<string, number>();
      inverter.stats?.forEach((point) => {
        // convert to kWh
        timeMap.set(
          point.logTime,
          Math.round(point.energy_produced / divideFactor) || 0,
        );
      });
      return { inverterId, timeMap };
    })
    .filter(Boolean) as { inverterId: string; timeMap: Map<string, number> }[];

  // Step 2: Gather all unique logTimes across all inverters.
  // This is also a linear pass.
  const logTimeSet = new Set<string>();
  inverterDataMaps.forEach((inverter) => {
    inverter.timeMap.forEach((_, logTime) => logTimeSet.add(logTime));
  });

  // Sort the unique logTimes. This step is necessary for correct charting.
  const sortedLogTimes = Array.from(logTimeSet).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );

  // Step 3: Create the linearized data structure using the Maps for fast lookups.
  // This is a linear pass over the sorted times, with O(1) lookups inside.
  const linearizedData = sortedLogTimes.map((logTime) => {
    const point: { [key: string]: string | number } = { logTime };
    inverterDataMaps.forEach((inverter) => {
      const inverterId = inverter.inverterId;
      point[inverterId] = inverter.timeMap.get(logTime) ?? 0;
    });
    return point;
  });

  return linearizedData as LinearData;
}

export type LinearizedBarData = {
  inverterId: string;
  energyProduced: number;
}[];

// linearize SystemEnergyPoints to for BarChart as for each inverter you will get only one data point
// so x axis will be inverter ids and y axis will be energy produced
export function linearizeSystemEnergyPointsForBarChart(
  data: SystemEnergyPoints,
  unit: string,
): LinearizedBarData {
  if (!data || !data.stats) {
    return [];
  }
  // if dateString is not yyyy-mm-dd then make divideFactor to 1000
  let divideFactor = unit === "kWh" ? 1000 : 1;
  return data.stats.map((inverter) => {
    const inverterId = inverter.inverterId || "unknown";
    const totalEnergy = inverter.stats?.reduce(
      // sum energy produced in kWh
      (sum, point) =>
        sum + (Math.round(point.energy_produced / divideFactor) || 0),
      0,
    );
    return {
      inverterId,
      energyProduced: totalEnergy || 0,
    };
  });
}
