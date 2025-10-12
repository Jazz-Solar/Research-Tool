import { Calendar28 } from "../date-picker";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { SelectDemo } from "../select-demo";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "../ui/input";
import { Combobox } from "../combobox";
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSystems } from "@/utility/fetch";
import { Spinner } from "../ui/spinner";
import { today } from "../lib";

export function ControlForm({
  chartInputState,
}: {
  chartInputState: [
    (
      | {
          dateString: string;
          squash: boolean;
          sysId: string;
        }
      | undefined
    ),
    Dispatch<
      SetStateAction<
        | {
            dateString: string;
            squash: boolean;
            sysId: string;
          }
        | undefined
      >
    >,
  ];
}) {
  const [_, setChartInput] = chartInputState;
  const [filter, setFilter] = useState<"day" | "month" | "year">("day");
  const [systemParams, setSystemParams] = useState({
    brand: "fronius",
    page: 1,
    pageSize: 10,
  });
  const { data, isPending } = useQuery({
    queryKey: [
      "systems",
      systemParams.brand,
      systemParams.page,
      systemParams.pageSize,
    ],
    queryFn: async () =>
      getSystems(systemParams.brand, systemParams.page, systemParams.pageSize),
    staleTime: 25 * 60 * 1000,
  });
  return (
    <form className="w-sm h-fit bg-accent p-3 rounded-lg">
      <FieldSet>
        <h3 className="text-md font-semibold text-center">Controls</h3>
        <FieldGroup className="flex-row gap-2">
          <Field>
            <FieldLabel>Date Picker</FieldLabel>
            <Calendar28
              defaultValue={today}
              setChartInput={setChartInput}
              filter={filter}
            />
          </Field>
          <Field>
            <FieldLabel>Filter</FieldLabel>
            <SelectDemo
              placeholder="Select Filter"
              label="Filter Options"
              values={["day", "month", "year"]}
              defaultValue="day"
              onValueChange={(value) => {
                setFilter(value as "day" | "month" | "year");
              }}
            />
          </Field>
          <Field className="w-14 justify-center items-end">
            <FieldLabel>Squash</FieldLabel>
            <div className="flex justify-center">
              <Checkbox
                onCheckedChange={(e) => {
                  setChartInput((prev) => ({
                    ...prev!,
                    squash: e === true,
                  }));
                }}
                className="w-8 h-8"
              />
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
              onValueChange={(value) =>
                setSystemParams({ ...systemParams, brand: value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="page">Page</FieldLabel>
            <Input
              id="page"
              type="number"
              defaultValue={1}
              onChange={(e) =>
                setSystemParams({
                  ...systemParams,
                  page: Math.max(1, Number(e.target.value)),
                })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="pageSize">Page Size</FieldLabel>
            <Input
              id="pageSize"
              type="number"
              defaultValue={10}
              onChange={(e) =>
                setSystemParams({
                  ...systemParams,
                  pageSize: Math.max(1, Math.min(20, Number(e.target.value))),
                })
              }
            />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel>Search</FieldLabel>
          {isPending ? (
            <Spinner className="mx-auto" />
          ) : (
            <Combobox
              systems={
                data
                  ? data.systems.map((system) => ({
                      id: system.id,
                      name: system.name,
                    }))
                  : []
              }
              setChartInput={setChartInput}
            />
          )}
        </Field>
      </FieldSet>
    </form>
  );
}
