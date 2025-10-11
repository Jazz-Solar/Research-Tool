"use client"

import { TrendingUp } from "lucide-react"
import { ErrorAlert } from "./alerts/error-alert"
import { WarningAlert } from "./alerts/warning-alert"
import { LinearView } from "./views/linear"
import Image from "next/image"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const description = "A linear line chart"

export function ChartLineLinear({
    chartInput
}: {
    chartInput: {
        dateString: string;
        squash: boolean;
        sysId: string;
    } | undefined
}) {
    console.log('Rendering ChartLineLinear with input:', chartInput);
    return (
        <Card className="w-6xl h-fit mx-auto">
            <CardHeader>
                <CardTitle>Line Chart - Linear</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                {
                    chartInput === undefined ?
                        <WarningAlert title="No Data Selected" message="Please select a date and system to view the chart." /> :
                        chartInput.sysId === "" ?
                            <div className="flex flex-col h-full justify-between">
                                <WarningAlert title="System Not Selected" message="Please select a valid system to view the chart." />
                                <Image
                                    className="mx-auto mt-4"
                                    src="/m-blue.png"
                                    alt="No Data"
                                    width={300}
                                    height={300}
                                    priority
                                />
                            </div>
                            :
                            <LinearView />
                }
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
