import { Appendix } from "@workspace/registry/appendix"

export function Example() {
  return (
    <Appendix
      label="Appendix without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
