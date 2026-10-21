import { DocsHeader } from "@/components/docs-header"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata } from "@/lib/registry"
import { getReleases, releasesUrl } from "@/lib/releases"

export const metadata = docsMetadata(
  "Changelog",
  "What each OrganUI release added and changed.",
  "/docs/changelog"
)

const formatDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
})

export default async function Page() {
  const releases = await getReleases()
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/changelog" title="Changelog">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          What each release added and changed, newest first. Follow along with{" "}
          <a href="/rss.xml">RSS</a> or on <a href={releasesUrl}>GitHub</a>.
        </p>
      </DocsHeader>
      {releases.length === 0 ? (
        <p>
          The release notes couldn&apos;t be loaded right now. Read them on{" "}
          <a href={releasesUrl}>GitHub</a>.
        </p>
      ) : (
        releases.map((release) => (
          <section
            key={release.tag}
            className="flex flex-col gap-3 border-b pb-10 last:border-b-0"
          >
            <div className="flex flex-col gap-1">
              <time
                dateTime={release.date}
                className="text-sm text-muted-foreground"
              >
                {formatDate.format(new Date(release.date))}
              </time>
              <h2
                id={release.tag}
                className="scroll-m-20 text-xl font-semibold tracking-tight"
              >
                <a href={release.url} className="hover:underline">
                  {release.name}
                </a>
              </h2>
            </div>
            {/* GitHub's sanitised rendering of the notes, in page type. */}
            <div
              className="flex flex-col gap-3 [&_a]:font-medium [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-4 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-[0.3em] [&_code]:py-[0.15em] [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted/30 [&_pre]:p-3 [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:ps-5"
              dangerouslySetInnerHTML={{ __html: release.html }}
            />
          </section>
        ))
      )}
      <DocsPager href="/docs/changelog" />
    </div>
  )
}
