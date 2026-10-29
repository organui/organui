"use client"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { MedicationSchedule } from "@workspace/registry/medication-schedule"
import {
  exampleDate,
  exampleInteractions,
  exampleMedications,
} from "@/lib/medication-example"

// The schedule's dates are "YYYY-MM-DD" calendar days; the calendar's are
// local Dates.
const toDay = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year!, month! - 1, day)
}
const fromDay = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")

export function Example() {
  const [date, setDate] = useState(exampleDate)
  const [open, setOpen] = useState(false)
  return (
    <div className="flex w-full flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="outline" className="w-fit" />}>
          {toDay(date).toLocaleDateString("en-US", { dateStyle: "medium" })}
          <ChevronDownIcon data-icon="inline-end" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDay(date)}
            defaultMonth={toDay(date)}
            onSelect={(day) => {
              if (day) setDate(fromDay(day))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <MedicationSchedule
        medications={exampleMedications}
        interactions={exampleInteractions}
        date={date}
        onDateChange={setDate}
      />
    </div>
  )
}
