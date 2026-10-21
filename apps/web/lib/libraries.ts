// The primitive libraries shadcn's styles are built on. Every item installs
// in both; a few files differ, and the registry serves each library's copy.
export const libraries = ["base", "radix"] as const

export type Library = (typeof libraries)[number]

export const libraryNames: Record<Library, string> = {
  base: "Base UI",
  radix: "Radix UI",
}
