"use client"

import { useEffect, useState } from "react"
import type { GrowthStandards } from "@workspace/registry/growth-chart"
import { loadWhoGrowthStandards } from "@/lib/who-growth-standards"

let loading: Promise<GrowthStandards> | undefined

// WHO's tables, fetched once per visit and shared by every example on the
// page.
export function useWhoGrowthStandards() {
  const [standards, setStandards] = useState<GrowthStandards | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let current = true
    loading ??= loadWhoGrowthStandards()
    loading.then(
      (value) => current && setStandards(value),
      () => {
        loading = undefined
        if (current) setFailed(true)
      }
    )
    return () => {
      current = false
    }
  }, [])
  return { standards, failed }
}
