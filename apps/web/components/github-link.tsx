import { Suspense } from "react"
import { GitHubIcon } from "@/components/social-icons"
import { site } from "@/lib/site"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export function GitHubLink() {
  return (
    <a
      href={site.repository}
      className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-2")}
    >
      <GitHubIcon data-icon="inline-start" />
      <span className="sr-only">GitHub repository</span>
      <Suspense>
        <StarsCount />
      </Suspense>
    </a>
  )
}

// A count this small reads as a warning rather than social proof, so below
// it the link shows the icon alone.
const minimumStars = 50

// Fetched at most daily, as shadcn/ui's site does. Without an answer, such as
// when the API rate-limits a build, the link shows the icon alone too.
async function StarsCount() {
  const stars = await fetch(`https://api.github.com/repos/${site.repo}`, {
    next: { revalidate: 86400 },
  })
    .then((response) =>
      response.ok
        ? (response.json() as Promise<{ stargazers_count?: number }>)
        : null
    )
    .then((json) => json?.stargazers_count)
    .catch(() => undefined)
  if (typeof stars !== "number" || stars < minimumStars) return null
  const count =
    stars >= 1000
      ? `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}k`
      : stars.toLocaleString("en-US")
  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      <span aria-hidden="true">{count}</span>
      <span className="sr-only">, {stars} stars</span>
    </span>
  )
}
