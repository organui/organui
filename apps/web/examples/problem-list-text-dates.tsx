import { ProblemList } from "@workspace/registry/problem-list"

export function Example() {
  return (
    <ProblemList
      problems={[
        { id: "asthma", name: "Asthma", onset: "Childhood" },
        { id: "migraine", name: "Migraine", onset: "2015" },
        {
          id: "appendicitis",
          name: "Acute appendicitis",
          status: "resolved",
          onset: "1998",
          resolved: "1998",
        },
      ]}
      className="w-full"
    />
  )
}
