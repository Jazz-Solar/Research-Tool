import { SystemEnergyPoints } from "./fetch";

type LinearData = { logTime: string; [key: string]: number | string }[];

export function linearizeSystemEnergyPoints(
  data: SystemEnergyPoints,
): LinearData {
  if (!data || !data.stats) {
    return [];
  }
  // Step 1: Preprocess each inverter's stats into a Map for O(1) lookups.
  // This is a linear pass over all inverter data points.
  const inverterDataMaps = data.stats
    .map((inverter) => {
      const inverterId = inverter.inverterId;
      if (!inverterId) return null;

      const timeMap = new Map<string, number>();
      inverter.stats?.forEach((point) => {
        timeMap.set(point.logTime, point.energy_produced);
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
