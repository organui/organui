import { ProblemList } from "@workspace/registry/problem-list"
import { problemExampleData } from "@/lib/examples"

export function Example() {
  return (
    <ProblemList
      problems={problemExampleData}
      showCodes={false}
      className="w-full"
    />
  )
}
