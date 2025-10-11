'use client';
import { ChartLineLinear } from "@/components/chart-line-linear";
import { SignInForm } from "@/components/signin-form";
import { LineChartForm } from "@/components/linechart-form";
import { useMutation } from "@tanstack/react-query";
import { useAutoSignIn } from "@/hooks/autoSignIn";
import { signIn } from "@/utility/fetch";
import { useState } from "react";
import useLocalStorageState from 'use-local-storage-state';

let revalidated = false;

export default function Home() {
  // logic for auto sign-in
  const { scheduleAutoSignIn } = useAutoSignIn();
  const [value, setValue] = useLocalStorageState('isAuthenticated', { defaultValue: false });
  const autoSignInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => signIn(email, password),
    onSuccess: async (data) => {
      setValue(true);
      if (data?.expiresIn) {
        scheduleAutoSignIn(data.expiresIn);
      }
    },
    onError: (error) => {
      setValue(false);
      console.error("Sign-in failed:", error);
      alert("Sign-in failed. Please check your credentials and try again.");
    },
  })
  if (value && !revalidated) {
    console.log('revalidating to be sure if actually signed in.');
    revalidated = true;
    scheduleAutoSignIn(300);
  }
  // logic for getting input from line chart form
  const chartInputState = useState<{
    dateString: string;
    squash: boolean;
    sysId: string;
  }>()
  return (
    <div className="flex dark p-10 min-h-screen max-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <ChartLineLinear chartInput={chartInputState[0]} />
      {
        autoSignInMutation.isSuccess || revalidated ?
          <LineChartForm chartInputState={chartInputState} />
          :
          <SignInForm mutation={autoSignInMutation} />
      }
    </div>
  );
}
