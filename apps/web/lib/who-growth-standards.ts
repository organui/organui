import {
  growthStandardsFromAnthro,
  type GrowthStandards,
} from "@workspace/registry/growth-chart"

// The docs demo's only source of WHO data, kept out of the registry item: WHO's
// daily tables in its anthro package, pinned to one commit and fetched at
// runtime. They are © WHO, distributed there under GPL-3, and WHO requires
// permission for commercial use.
const commit = "b776d8a12b1c97369c748b561159fd2ec4f4db58"
const tables = {
  weight: "weianthro.txt",
  length: "lenanthro.txt",
  head: "hcanthro.txt",
} as const

export async function loadWhoGrowthStandards(): Promise<GrowthStandards> {
  const entries = await Promise.all(
    Object.entries(tables).map(async ([measure, file]) => {
      const url = `https://raw.githubusercontent.com/WorldHealthOrganization/anthro/${commit}/data-raw/growthstandards/${file}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`${url}: ${response.status}`)
      return [measure, await response.text()] as const
    })
  )
  return growthStandardsFromAnthro(Object.fromEntries(entries))
}
