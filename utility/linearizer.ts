import type { SystemEnergyPoints } from "./fetch";

type LinearData = { logTime: string; [key: string]: number | string }[];

const formatUTCTimeToLocalAmPm = (utcTime: string): string => {
  // utcTime in HH:mm (like "00:00" or "15:30")
  const [hours, minutes] = utcTime.split(":").map(Number);

  // Skip times before 5 AM UTC
  if (hours < 5) return "";

  // Create Date object at utcTime in current date
  const now = new Date();
  const date = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hours,
      minutes,
      0,
      0,
    ),
  );

  // Format to local time with AM/PM
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function linearizeSystemEnergyPoints(
  data: SystemEnergyPoints,
  unit: string,
): LinearData {
  if (!data || !data.stats) {
    return [];
  }

  console.log("SystemEnergyPoints data received for linearization:", data);
  // if dateString is not yyyy-mm-dd then make divideFactor to 1000
  const divideFactor = unit === "kWh" ? 1000 : 1;
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
          formatUTCTimeToLocalAmPm(point.logTime),
          Math.round(
            (unit === "kWh"
              ? point.energy_produced
              : point?.power_produced || 0) / divideFactor,
          ) || 0,
        );
      });
      return { inverterId, timeMap };
    })
    .filter(Boolean) as { inverterId: string; timeMap: Map<string, number> }[];

  console.log("Inverter Data Maps Created:", inverterDataMaps);

  // Step 2: Gather all unique logTimes across all inverters.
  // This is also a linear pass.
  const logTimeSet = new Set<string>();
  inverterDataMaps.forEach((inverter) => {
    inverter.timeMap.forEach((_, logTime) => {
      logTimeSet.add(logTime);
    });
  });

  // Sort the unique logTimes. This step is necessary for correct charting. am and pm times will be sorted correctly.
  const sortedLogTimes = Array.from(logTimeSet).sort((a, b) => {
    const dateA = new Date(`1970-01-01T${a}`);
    const dateB = new Date(`1970-01-01T${b}`);
    return dateA.getTime() - dateB.getTime();
  });

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
  const divideFactor = unit === "kWh" ? 1000 : 1;
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
