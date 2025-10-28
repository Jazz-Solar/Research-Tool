/** biome-ignore-all lint/suspicious/noExplicitAny: < tolltip is allowed to receive any> */
import { useEffect, useRef } from "react";

export function StackedTooltip({ active, payload, label }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const scrollStep = 300; // Amount to scroll per key press (px)
      if (e.key.toLowerCase() === "w") {
        // Scroll up
        containerRef.current.scrollBy({ top: -scrollStep, behavior: "smooth" });
      } else if (e.key.toLowerCase() === "s") {
        // Scroll down
        containerRef.current.scrollBy({ top: scrollStep, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!active || !payload || payload.length === 0) {
    return null;
  }
  // Extract all Y values for this X (time)
  const yValues = payload.map((entry: any) => entry.value);
  // Calculate mean
  const mean =
    yValues.reduce((a: number, b: number) => a + b, 0) / yValues.length;
  return (
    <div
      ref={containerRef}
      className="bg-slate-800 w-fit max-h-96 overflow-y-auto mx-5 p-3 border-l-4"
      style={{ boxShadow: "0 0 5px rgba(0,0,0,0.3)" }}
    >
      <p>
        <strong>Time: </strong>
        {label}
      </p>
      <p>
        <strong>Mean Value: </strong>
        {mean.toFixed(2)}
      </p>
      {payload.map((entry: any) => {
        const meanDiff = entry.value - mean;
        return (
          <div key={entry.dataKey} style={{ color: entry.color, marginTop: 6 }}>
            <div>
              <strong>{entry.name}</strong>
            </div>
            <div className="text-white">Value: {entry.value}</div>
            <div className="text-white">Mean Diff: {meanDiff.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  );
}
