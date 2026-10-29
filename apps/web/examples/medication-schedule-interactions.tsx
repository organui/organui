import { MedicationSchedule } from "@workspace/registry/medication-schedule"
import {
  exampleDate,
  exampleInteractions,
  exampleMedications,
} from "@/lib/medication-example"

// Two medications that should be taken apart, and the doses that are not.
const ids = ["levothyroxine", "calcium"]

export function Example() {
  return (
    <MedicationSchedule
      medications={exampleMedications.filter(({ id }) => ids.includes(id))}
      interactions={exampleInteractions.filter(({ medicationIds }) =>
        medicationIds.every((id) => ids.includes(id))
      )}
      date={exampleDate}
    />
  )
}
