import { Button } from "@/components/ui/button";
import { ChartLineLinear } from "@/components/ui/chart-line-linear";

export default function Home() {
  return (
    <div className="dark p-10 min-h-screen max-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <ChartLineLinear />
    </div>
  );
}
