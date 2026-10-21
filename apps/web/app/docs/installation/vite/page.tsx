import Link from "next/link"
import { FrameworkGuide } from "@/components/framework-guide"
import { docsMetadata, installationGuides } from "@/lib/registry"

const guide = installationGuides.find(({ title }) => title === "Vite")!

export const metadata = docsMetadata(guide.title, guide.description, guide.href)

const usage = `import { Heart } from "@/components/heart"

export default function App() {
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
      name="Vite"
      template="vite"
      file="src/App.tsx"
      usage={usage}
      blocks={
        <p>
          Vite has no file routing, so a <Link href="/blocks">block</Link>{" "}
          installs its components without its page:{" "}
          <code>bunx shadcn add @organui/explorer-01</code> adds{" "}
          <code>components/organ-explorer.tsx</code>. Render it as the
          block&apos;s page does, such as{" "}
          <code>&lt;OrganExplorer model=&#123;heartModel&#125; /&gt;</code>.
        </p>
      }
    />
  )
}
