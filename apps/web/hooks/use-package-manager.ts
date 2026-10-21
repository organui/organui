"use client"

import { createPreference } from "@/hooks/use-preference"
import { packageManagers } from "@/lib/package-commands"

// Bun by default, the manager this repository uses.
export const usePackageManager = createPreference(
  "package-manager",
  packageManagers,
  "bun"
)
