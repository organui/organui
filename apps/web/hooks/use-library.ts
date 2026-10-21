"use client"

import { createPreference } from "@/hooks/use-preference"
import { libraries } from "@/lib/libraries"

// Base UI by default, the library the site itself is built on.
export const useLibrary = createPreference("library", libraries, "base")
