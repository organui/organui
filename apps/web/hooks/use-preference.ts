"use client"

import { useSyncExternalStore } from "react"

// A choice the reader makes once, such as their package manager, shared by
// every control on the page and remembered between visits. The server and
// the first render use the fallback, so hydration matches.
export function createPreference<const T extends string>(
  name: string,
  values: readonly T[],
  fallback: T
) {
  const key = `organui:${name}`
  // The last choice, for when storage is blocked.
  let chosen = fallback

  function read(): T {
    try {
      const value = localStorage.getItem(key)
      return values.find((option) => option === value) ?? chosen
    } catch {
      return chosen
    }
  }

  function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange)
    window.addEventListener(key, onChange)
    return () => {
      window.removeEventListener("storage", onChange)
      window.removeEventListener(key, onChange)
    }
  }

  function set(next: T) {
    chosen = next
    try {
      localStorage.setItem(key, next)
    } catch {
      // Blocked storage keeps the choice until the page reloads.
    }
    window.dispatchEvent(new Event(key))
  }

  return function usePreference() {
    const value = useSyncExternalStore(subscribe, read, () => fallback)
    return [value, set] as const
  }
}
