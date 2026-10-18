import { Intestines } from "@workspace/registry/intestines"

export function Example() {
  return (
    <Intestines
      label="Intestines without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
