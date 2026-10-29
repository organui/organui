import { AllergyList } from "@workspace/registry/allergy-list"

export function Example() {
  return (
    <div className="flex w-full flex-col gap-6">
      <AllergyList caption="Not asked yet" />
      <AllergyList allergies="none-known" caption="Asked: none known" />
    </div>
  )
}
