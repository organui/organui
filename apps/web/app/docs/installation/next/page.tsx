import Link from "next/link"
import { FrameworkGuide } from "@/components/framework-guide"
import { docsMetadata, installationGuides } from "@/lib/registry"

const guide = installationGuides.find(({ title }) => title === "Next.js")!

export const metadata = docsMetadata(guide.title, guide.description, guide.href)

const usage = `import { Heart } from "@/components/heart"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Heart</h1>
      <Heart />
    </main>
  )
}`

export default function Page() {
  return (
    <FrameworkGuide
      href={guide.href}
      name="Next.js"
      template="next"
      file="app/page.tsx"
      usage={usage}
      blocks={
        <p>
          A <Link href="/blocks">block</Link> installs its page into{" "}
          <code>app</code> along with its components:{" "}
          <code>bunx shadcn add @organui/explorer-01</code> adds{" "}
          <code>app/explorer/page.tsx</code>.
        </p>
      }
    />
  )
}
