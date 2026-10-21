import { site } from "@/lib/site"

export type Release = {
  tag: string
  name: string
  date: string
  url: string
  // GitHub's rendering of the notes, sanitised by GitHub.
  html: string
}

// Releases are written on GitHub, so the changelog reads them from there,
// at most daily. Without an answer, such as when the API rate-limits a
// build, it is empty and the page links to GitHub instead.
export async function getReleases(): Promise<Release[]> {
  const releases = await fetch(
    `https://api.github.com/repos/${site.repo}/releases?per_page=100`,
    {
      headers: { Accept: "application/vnd.github.html+json" },
      next: { revalidate: 86400 },
    }
  )
    .then((response) =>
      response.ok
        ? (response.json() as Promise<
            {
              tag_name: string
              name: string | null
              published_at: string | null
              html_url: string
              body_html?: string
              draft: boolean
            }[]
          >)
        : []
    )
    .catch(() => [])
  return releases
    .filter((release) => !release.draft && release.published_at)
    .map((release) => ({
      tag: release.tag_name,
      name: release.name || release.tag_name,
      date: release.published_at!,
      url: release.html_url,
      // Code that scrolls sideways must be reachable by keyboard.
      html: (release.body_html ?? "").replaceAll("<pre", '<pre tabindex="0"'),
    }))
}

export const releasesUrl = `${site.repository}/releases`
