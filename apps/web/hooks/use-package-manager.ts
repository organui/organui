"use client"

import { useSyncExternalStore } from "react"
import { packageManagers, type PackageManager } from "@/lib/package-commands"

const key = "organui:package-manager"
const event = "organui:package-manager"

// The last choice, for when storage is blocked.
let chosen: PackageManager = "bun"

function read(): PackageManager {
  try {
    const value = localStorage.getItem(key)
    return packageManagers.find((manager) => manager === value) ?? chosen
  } catch {
    return chosen
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(event, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(event, onChange)
  }
}

// The reader's package manager, shared by every command on the page and
// remembered between visits. The server and first render use bun, the
// manager this repository uses, so hydration matches.
export function usePackageManager() {
  const manager = useSyncExternalStore(subscribe, read, () => "bun" as const)
  function setManager(next: PackageManager) {
    chosen = next
    try {
      localStorage.setItem(key, next)
    } catch {
      // Blocked storage keeps the choice until the page reloads.
    }
    window.dispatchEvent(new Event(event))
  }
  return [manager, setManager] as const
}
