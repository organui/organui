import { AclRupture } from "@workspace/registry/acl-rupture"

export function Example() {
  return (
    <AclRupture
      label="ACL rupture without panel example"
      panel={false}
      defaultStage="deficient"
    />
  )
}
