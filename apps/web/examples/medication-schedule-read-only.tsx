import { MedicationSchedule } from "@workspace/registry/medication-schedule"
import {
  exampleDate,
  exampleInteractions,
  exampleMedications,
} from "@/lib/medication-example"

// Without the callbacks the schedule is read-only: no day buttons, and dose
// status is text instead of a button.
export function Example() {
  return (
    <MedicationSchedule
      medications={exampleMedications}
      interactions={exampleInteractions}
      date={exampleDate}
      doseStatus={{}}
      label="Medication schedule, read-only"
    />
  )
}
