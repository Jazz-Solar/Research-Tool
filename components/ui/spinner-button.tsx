import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerButton(props: {
  size?:
    | "sm"
    | "lg"
    | "default"
    | "icon"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
  loadingText?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size={props.size || "default"}>
        <Spinner />
        {props.loadingText || "Loading..."}
      </Button>
    </div>
  );
}
