import { ChartLineLinear } from "@/components/ui/chart-line-linear";
import { SignInForm } from "@/components/signin-form";

export default function Home() {
  return (
    <div className="flex dark p-10 min-h-screen max-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <ChartLineLinear />
      <SignInForm />
    </div>
  );
}
