import Link from "next/link"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata } from "@/lib/registry"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

export const metadata = docsMetadata(
  "Theming",
  "OrganUI components read your shadcn theme tokens and follow its dark mode.",
  "/docs/theming"
)

const tokens = [
  ["background, foreground", "Surfaces and text, including viewer overlays"],
  ["muted, muted-foreground", "Secondary text, labels and hints"],
  ["primary, primary-foreground", "Selected regions, points and pairs"],
  ["accent, accent-foreground", "Hovered and selected options"],
  ["destructive", "Out-of-range values and errors"],
  ["border, ring", "Outlines and focus rings"],
] as const

const css = `:root {
  --primary: oklch(0.55 0.15 250);
  /* The ECG grid, red by default. */
  --ecg-grid: oklch(0.6 0.2 25);
}

.dark {
  --primary: oklch(0.7 0.13 250);
}`

const structure = `// components/heart.tsx, as installed
structures: [
  { id: "right-atrium", label: "Right atrium", group: "Heart walls", color: "#a96d70" },
]`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/theming" title="Theming">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Components use your shadcn theme. They install no global styles of
          their own.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="tokens">Theme tokens</DocsHeading>
        <p>
          Every item is styled with Tailwind utilities on shadcn&apos;s semantic
          tokens, the CSS variables <code>shadcn init</code> writes to your
          stylesheet. Change a token and every component follows it.
        </p>
        <Table
          tabIndex={0}
          aria-label="Tokens and their use"
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <TableHeader>
            <TableRow>
              <TableHead>Tokens</TableHead>
              <TableHead>Used for</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map(([names, use]) => (
              <TableRow key={names}>
                <TableCell>
                  <code>{names}</code>
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {use}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CodeSnippet label="Theme overrides" code={css} lang="css" />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="dark-mode">Dark mode</DocsHeading>
        <p>
          Components have no dark mode of their own: they follow the{" "}
          <code>.dark</code> values of your tokens, however you toggle them, for
          example with <code>next-themes</code> as shadcn recommends. On this
          site, press <kbd>D</kbd> or use the header button to switch.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="anatomy-colours">Anatomy colours</DocsHeading>
        <p>
          Structure colours are data, not theme: each organ lists its structures
          with a <code>color</code>, which the viewer, the{" "}
          <Link href="/docs/components/anatomy-tree" className="underline">
            anatomy tree
          </Link>{" "}
          swatches and the blocks share. Edit them in the installed file.
        </p>
        <CodeSnippet label="Structure colour" code={structure} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="per-component">Per component</DocsHeading>
        <p>
          Every component takes <code>className</code> for its root, merged with{" "}
          <code>cn</code>, so sizing and spacing stay at the call site. For
          anything deeper, change the installed source; that is what it is there
          for.
        </p>
      </section>
      <DocsPager href="/docs/theming" />
    </div>
  )
}
