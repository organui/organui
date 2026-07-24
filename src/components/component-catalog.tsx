"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ComponentPreview } from "@/components/component-preview"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { catalog } from "@/lib/catalog"

const categories = ["All", ...new Set(catalog.map((item) => item.category))]

function categorySlug(category: string) {
  return category.toLowerCase().replaceAll(" ", "-")
}

export function ComponentCatalog() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const selectedCategory = searchParams.get("category") ?? "all"

  const visibleItems = catalog.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      categorySlug(item.category) === selectedCategory
    const searchable = [
      item.title,
      item.description,
      item.category,
      item.slug,
      ...item.states,
    ]
      .join(" ")
      .toLowerCase()

    return matchesCategory && searchable.includes(query.trim().toLowerCase())
  })

  function updateSearch(name: "q" | "category", value: string) {
    const params = new URLSearchParams(searchParams)

    if (!value || (name === "category" && value === "all")) {
      params.delete(name)
    } else {
      params.set(name, value)
    }

    const nextQuery = params.toString()
    router.replace(nextQuery ? pathname + "?" + nextQuery : pathname, {
      scroll: false,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <label className="flex max-w-xl flex-col gap-2">
          <span className="text-sm font-medium">Search components</span>
          <Input
            type="search"
            value={query}
            placeholder="Try lab, medication, critical…"
            onChange={(event) => updateSearch("q", event.target.value)}
          />
        </label>
        <ToggleGroup
          className="max-w-full flex-wrap justify-start"
          variant="outline"
          value={[selectedCategory]}
          onValueChange={(value) => {
            const nextCategory = value.at(-1)
            if (nextCategory) updateSearch("category", nextCategory)
          }}
          aria-label="Filter components by category"
        >
          {categories.map((category) => {
            const slug = categorySlug(category)
            return (
              <ToggleGroupItem key={category} value={slug}>
                {category}
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
      </p>

      {visibleItems.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No matching components</EmptyTitle>
            <EmptyDescription>
              Try another search term or select a different category.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleItems.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col overflow-hidden rounded-xl border bg-card"
            >
              <div className="flex min-h-56 items-center justify-center bg-muted/40 p-6">
                <ComponentPreview slug={item.slug} />
              </div>
              <div className="flex flex-1 flex-col gap-3 border-t p-5">
                <p className="font-mono text-xs text-muted-foreground">
                  {item.category}
                </p>
                <h3 className="text-xl font-semibold">
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={"/components/" + item.slug}
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
