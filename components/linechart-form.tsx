import { Calendar28 } from "./date-picker";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { SelectDemo } from "./select-demo";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./ui/input";
import { Combobox } from "./combobox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSystems } from "@/utility/fetch";
import { Spinner } from "./ui/spinner";

// get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split("T")[0];

export function LineChartForm({
    chartInputState
}: {
    chartInputState: [{
        dateString: string;
        squash: boolean;
        sysId: string;
    } | undefined, Dispatch<SetStateAction<{
        dateString: string;
        squash: boolean;
        sysId: string;
    } | undefined>>]
}) {
    const [chartInput, setChartInput] = chartInputState;
    const [systemParams, setSystemParams] = useState({
        brand: "fronius",
        page: 1,
        pageSize: 10
    })
    const { data, isPending } = useQuery({
        queryKey: ['systems', systemParams.brand, systemParams.page, systemParams.pageSize],
        queryFn: async () => getSystems(systemParams.brand, systemParams.page, systemParams.pageSize),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    useEffect(() => {
        console.log('new input: ', chartInput);
    }, [chartInput])

    return <form className="w-sm h-fit bg-accent p-5 rounded-lg">
        <FieldSet>
            <h3 className="text-md font-semibold text-center">Controls</h3>
            <FieldGroup className="flex-row gap-2">
                <Field>
                    <FieldLabel>Date Picker</FieldLabel>
                    <Calendar28 defaultValue={today} setChartInput={setChartInput} />
                </Field>
                <Field>
                    <FieldLabel>Filter</FieldLabel>
                    <SelectDemo
                        placeholder="Select Filter"
                        label="Filter Options"
                        values={["day", "month", "year"]}
                        defaultValue="day"
                        onValueChange={(value) => setChartInput({ ...chartInput!, dateString:(()=>{
                            let newDateString = chartInput?.dateString || today;
                            // if month then yyyy-mm else if year then yyyy
                            if(value === "month") return newDateString.slice(0,7);
                            else if(value === "year") return newDateString.slice(0,4);
                            else return newDateString;
                        })()})}
                    />
                </Field>
                <Field className="w-14 justify-center items-end">
                    <FieldLabel>Squash</FieldLabel>
                    <div className="flex justify-center">
                        <Checkbox onCheckedChange={(e)=>{
                            setChartInput(prev => ({
                                ...prev!,
                                squash: e === true
                            }))
                        }} className="w-8 h-8" />
                    </div>
                </Field>
            </FieldGroup>
            <FieldGroup className="flex-row gap-2">
                <Field>
                    <FieldLabel>Brands</FieldLabel>
                    <SelectDemo
                        placeholder="Select Brands"
                        label="Brand Options"
                        values={["fronius", "enphase"]}
                        defaultValue="fronius"
                        onValueChange={(value) => setSystemParams({ ...systemParams, brand: value })}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="page">Page</FieldLabel>
                    <Input
                        id="page"
                        type="number"
                        defaultValue={1}
                        onChange={(e) => setSystemParams({ 
                            ...systemParams, 
                            page: Math.max(1,Number(e.target.value)) 
                        })}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="pageSize">Page Size</FieldLabel>
                    <Input
                        id="pageSize"
                        type="number"
                        defaultValue={10}
                        onChange={(e) => setSystemParams({ 
                            ...systemParams, 
                            pageSize: Math.max(1,Math.min(20,Number(e.target.value))) 
                        })}
                    />
                </Field>
            </FieldGroup>
            <Field>
                <FieldLabel>Search</FieldLabel>
                {
                    isPending ?
                        <Spinner className="mx-auto" />
                        :
                        <Combobox
                            systems={data? data.systems.map(system => ({ id: system.id, name: system.name })) : []}
                            setChartInput={setChartInput}
                        />
                }
            </Field>
        </FieldSet>
    </form>
}