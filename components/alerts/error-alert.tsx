import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorAlert({
  status,
  title,
  message,
}: {
  status: number;
  title: string;
  message: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{`${status}: ${title}`}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
