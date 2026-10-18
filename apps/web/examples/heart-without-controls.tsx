import { Heart } from "@workspace/registry/heart"

export function Example() {
  return (
    <Heart
      label="Heart without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
