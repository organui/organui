// Writes component-api.json from the components' source. Run after changing
// a component's props; a unit test fails while the file is out of date.
//
//   bun run component-api
import { writeFile } from "node:fs/promises"
import { componentApi } from "./component-api"

await writeFile(
  new URL("../component-api.json", import.meta.url),
  `${JSON.stringify(componentApi(), null, 2)}\n`
)
