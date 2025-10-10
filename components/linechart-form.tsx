import { Calendar28 } from "./ui/date-picker";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { SelectDemo } from "./select-demo";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./ui/input";
import { Combobox } from "./combobox";
import { Dispatch, SetStateAction } from "react";

export function LineChartForm({
    chartInputState
}:{
    chartInputState: [{
        dateString: string;
        squash: boolean;
        sysId: string;
    } | undefined, Dispatch<SetStateAction<{
        dateString: string;
        squash: boolean;
        sysId: string;
    } | undefined >>]
}) {
    const [chartInput, setChartInput] = chartInputState;
    return <form className="w-sm h-fit bg-accent p-5 rounded-lg">
        <FieldSet>
            <h3 className="text-md font-semibold text-center">Controls</h3>
            <FieldGroup className="flex-row gap-2">
                <Field>
                    <FieldLabel>Date Picker</FieldLabel>
                    <Calendar28 />
                </Field>
                <Field>
                    <FieldLabel>Filter</FieldLabel>
                    <SelectDemo
                        placeholder="Select Filter"
                        label="Filter Options"
                        values={["day", "month", "year"]}
                    />
                </Field>
                <Field className="w-14 justify-center items-end">
                    <FieldLabel>Squash</FieldLabel>
                    <div className="flex justify-center">
                        <Checkbox className="w-8 h-8" />
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
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="page">Page</FieldLabel>
                    <Input
                        id="page"
                        type="number"
                        defaultValue={1}
                        min={1}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="pageSize">Page Size</FieldLabel>
                    <Input
                        id="pageSize"
                        type="number"
                        defaultValue={10}
                        min={1}
                        max={15}
                    />
                </Field>
            </FieldGroup>
            <Field>
                <FieldLabel>Search</FieldLabel>
                <Combobox />
            </Field>
        </FieldSet>
    </form>
}