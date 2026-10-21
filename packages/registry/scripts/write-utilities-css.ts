// Writes utilities.css from the utility items in registry.json. Run after
// changing an item's css or cssVars; a unit test fails while the file is out
// of date.
//
//   bun run utilities-css
import { writeFile } from "node:fs/promises"
import { utilitiesCss } from "./utilities-css"

await writeFile(new URL("../utilities.css", import.meta.url), utilitiesCss())
