"use client";
import { WarningAlert } from "../alerts/warning-alert";
import { StackedView } from "../views/stacked";
import Image from "next/image";
import { today } from "../lib";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery, skipToken } from "@tanstack/react-query";
import { getSystemEnergyPoints, SystemEnergyPoints } from "@/utility/fetch";
import { Spinner } from "../ui/spinner";
import { ErrorAlert } from "../alerts/error-alert";
import { AxiosError } from "axios";
import { BarView } from "../views/bar";

function decideStorageTime(dateString: string) {
  //if date string is in the format of YYYY-MM-DD and is today, return 5 minutes
  if (dateString === today) {
    return 5 * 60 * 1000;
  }
  //otherwise return 24 hours
  return 24 * 60 * 60 * 1000;
}

export function SystemChart({
  chartInput,
}: {
  chartInput:
    | {
        dateString: string;
        squash: boolean;
        sysId: string;
      }
    | undefined;
}) {
  console.log("Rendering ChartLineLinear with input:", chartInput);
  let isInvalidInput = !chartInput || !chartInput.sysId;
  const { isPending, error, data, isError } = useQuery({
    queryKey: [
      "chartData",
      chartInput?.dateString,
      chartInput?.sysId,
      chartInput?.squash || false,
    ],
    queryFn: async () =>
      !isInvalidInput
        ? getSystemEnergyPoints(chartInput!.sysId, {
            dateString: chartInput!.dateString,
            squash: chartInput!.squash || false,
          })
        : skipToken,
    staleTime: decideStorageTime(chartInput?.dateString || today),
    gcTime: decideStorageTime(chartInput?.dateString || today),
  });
  // if dateString is not yyyy-mm-dd then make divideFactor to 1000
  let unit = "Wh";
  if (
    chartInput?.dateString &&
    !/^\d{4}-\d{2}-\d{2}$/.test(chartInput.dateString)
  ) {
    unit = "kWh";
  }
  isInvalidInput = isInvalidInput || isError;
  return (
    <Card className="w-6xl h-fit mx-auto">
      {!isInvalidInput && (
        <CardHeader>
          <CardTitle>System Chart {`(Heavy)`} - Stacked</CardTitle>
          <CardDescription>
            System Id: <span className="text-white">{chartInput?.sysId}</span>
            <br />
            Span: <span className="text-white">{chartInput?.dateString}</span>
            <br />
            Total Inverters:{" "}
            <span className="text-white">
              {(data as SystemEnergyPoints)?.stats?.length || 0}
            </span>
            <br />
            Energy Unit: <span className="text-white">{unit}</span>
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {chartInput === undefined ? (
          <WarningAlert
            title="No Data Provided"
            message="Please select a date and system to view the chart."
          />
        ) : chartInput.sysId === "" ? (
          <div className="flex flex-col h-full justify-between">
            <WarningAlert
              title="System Not Selected"
              message="Please select a valid system to view the chart."
            />
            <Image
              className="mx-auto mt-4"
              src="/m-blue.png"
              alt="No Data"
              width={300}
              height={300}
              priority
            />
          </div>
        ) : isPending ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorAlert
            status={((error as AxiosError)?.response?.status as number) || 500}
            title={error.name}
            message={error.message}
          />
        ) : data === undefined ||
          data === skipToken ||
          data.stats.length === 0 ? (
          <WarningAlert
            title="No Data Available"
            message="No data is available for the selected system and date."
          />
        ) : chartInput.squash ? (
          <BarView chartData={data} unit={unit} />
        ) : (
          <StackedView chartData={data} unit={unit} />
        )}
      </CardContent>
      {!isInvalidInput && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div> */}
        </CardFooter>
      )}
    </Card>
  );
}
