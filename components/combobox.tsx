"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

export function Combobox({
  systems,
  setChartInput,
}: {
  systems: { id: string; name: string }[];
  setChartInput: React.Dispatch<
    React.SetStateAction<
      | {
          dateString: string;
          squash: boolean;
          sysId: string;
        }
      | undefined
    >
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    setChartInput((prev) => {
      return {
        ...prev!,
        sysId: value,
      };
    });
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
        >
          {value
            ? systems.find((system) => system.id === value)?.name
            : "Select system..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search system..." />
          <CommandList>
            <CommandEmpty>No system found.</CommandEmpty>
            <CommandGroup>
              {systems.map((system) => (
                <CommandItem
                  key={system.id}
                  value={system.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {system.name}
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === system.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
