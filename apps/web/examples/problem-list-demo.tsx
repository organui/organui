import { ProblemList } from "@workspace/registry/problem-list"
import { problemExampleData } from "@/lib/examples"

export function Example() {
  return (
    <div role="region" aria-label="Problem list example" className="w-full">
      <ProblemList
        problems={problemExampleData}
        caption="Fictional patient, not real data"
      />
    </div>
  )
}
