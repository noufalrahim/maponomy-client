"use client";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const STATUSES = [
  "pending",
  "confirmed",
  "rejected",
  "delivered",
  "cancelled",
] as const;

interface IOrderFilterProps {
  statuses: string[];
  setStatuses: (statuses: string[]) => void;

  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;

  pushedToErpOnly: boolean;
  setPushedToErpOnly: (pushedToErpOnly: boolean) => void;
}
export default function OrderFilters({ statuses, setStatuses, dateRange, setDateRange, pushedToErpOnly, setPushedToErpOnly }: IOrderFilterProps) {

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            Status
            {statuses.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ({statuses.length})
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-56 p-1">
          <ToggleGroup
            type="multiple"
            value={statuses}
            onValueChange={setStatuses}
            className="flex flex-col"
          >
            {STATUSES.map(status => {
              const selected = statuses.includes(status);

              return (
                <ToggleGroupItem
                  key={status}
                  value={status}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2",
                    "capitalize rounded-md",
                    "hover:bg-muted/50",
                    "data-[state=on]:bg-transparent",
                    "data-[state=on]:text-foreground"
                  )}
                >
                  <span>{status}</span>

                  {selected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {dateRange?.from
              ? dateRange.to
                ? `${format(dateRange.from, "dd MMM")} – ${format(
                  dateRange.to,
                  "dd MMM"
                )}`
                : format(dateRange.from, "dd MMM")
              : "Date range (Created)"}

          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2 border rounded-md px-3 h-10">
        <Label htmlFor="erp" className="text-sm">
          Pushed to ERP
        </Label>
        <Switch
          id="erp"
          checked={pushedToErpOnly}
          onCheckedChange={setPushedToErpOnly}
        />
      </div>
    </div>
  );
}
