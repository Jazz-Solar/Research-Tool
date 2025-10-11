import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo(props: {
  id?: string;
  placeholder: string;
  label: string;
  values: string[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Select
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
    >
      <SelectTrigger className="w-xs">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{props.label}</SelectLabel>
          {props.values?.map((value) => (
            <SelectItem id={props.id} key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
