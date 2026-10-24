import { AllergyList } from "@workspace/registry/allergy-list"
import { allergyExampleData } from "@/lib/examples"

export function Example() {
  return (
    <div role="region" aria-label="Allergy list example" className="w-full">
      <AllergyList
        allergies={allergyExampleData}
        caption="Fictional patient, not real data"
      />
    </div>
  )
}
