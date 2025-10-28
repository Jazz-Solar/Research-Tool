"use client";
import { SystemChart } from "@/components/charts/system-chart";
import { SignInForm } from "@/components/forms/signin-form";
import { ControlForm } from "@/components/forms/control-form";
import { useMutation } from "@tanstack/react-query";
import { useAutoSignIn } from "@/hooks/autoSignIn";
import { signIn } from "@/utility/fetch";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { Button } from "@/components/ui/button";
import { takeScreenCapture, uploadImageToS3 } from "@/utility/s3";

let revalidated = false;

export default function Home() {
  // logic for auto sign-in
  const { scheduleAutoSignIn } = useAutoSignIn();
  const [value, setValue] = useLocalStorageState("isAuthenticated", {
    defaultValue: false,
  });
  const autoSignInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
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
  });
  if (value && !revalidated) {
    revalidated = true;
    scheduleAutoSignIn(300);
  }
  // logic for getting input from line chart form
  const chartInputState = useState<{
    dateString: string;
    squash: boolean;
    sysId: string;
  }>();
  return (
    <div className="flex dark gap-4 p-5 min-h-screen max-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SystemChart chartInput={chartInputState[0]} />
      {autoSignInMutation.isSuccess || revalidated ? (
        <>
          <ControlForm chartInputState={chartInputState} />
          <Button className="mt-4" onClick={() => {
            takeScreenCapture().then(async (blob) => {
              const randomId = Math.random().toString(36).substring(2, 15);
              if (blob) {
                const arrayBuffer = await blob.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await uploadImageToS3("eric-mooose", `screenshot-${randomId}.png`, buffer, "image/png");
              }
            })
          }}>Snapshot</Button></>
      ) : (
        <SignInForm mutation={autoSignInMutation} />
      )}
    </div>
  );
}
