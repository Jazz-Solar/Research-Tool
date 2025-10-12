import React from "react";

export function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-slate-800 w-fit p-3 rounded border-l-4 border-blue-500"
      style={{ boxShadow: "0 0 5px rgba(0,0,0,0.3)" }}
    >
      <p className="text-white font-bold mb-2">Inverter Data</p>
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          className="flex justify-between text-white mb-1"
          style={{ minWidth: 150 }}
        >
          <span>{entry.payload.inverterId || "Unknown ID"}</span>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
