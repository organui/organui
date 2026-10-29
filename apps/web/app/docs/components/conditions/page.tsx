import Link from "next/link"
import bodySystems from "@workspace/registry/body-systems.json"
import { ConditionGallery } from "@/components/condition-gallery"
import { DocsHeader } from "@/components/docs-header"
import { DocsPager } from "@/components/docs-pager"
import {
  conditions,
  conditionsPage,
  docsMetadata,
  registryItems,
} from "@/lib/registry"

export const metadata = docsMetadata(
  conditionsPage.title,
  conditionsPage.description,
  conditionsPage.href
)

// Each condition carries one body system as a registry category (a registry
// test checks it), so a new condition joins the gallery and its filter without
// a site change.
const items = conditions.map((item) => ({
  name: item.name,
  title: item.title,
  href: item.href,
  system: item.system!,
  bases: item.bases.map(
    (base) => registryItems.find(({ name }) => name === base)?.title ?? base
  ),
}))
const systems = bodySystems.filter(({ id }) =>
  items.some(({ system }) => system === id)
)

export default function Page() {
  return (
    <div data-docs-wide className="flex flex-col gap-10">
      <DocsHeader href={conditionsPage.href} title="Conditions">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          {items.length === 1 ? "One condition" : `${items.length} conditions`}{" "}
          on the{" "}
          <Link href="/docs/components/condition-viewer" className="underline">
            condition viewer
          </Link>
          , each drawn on the organs and tissues it affects through its stages.
          Open one to explore it in 3D.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each picture is a rendering of its model and is shared under that
          model&apos;s licence; see{" "}
          <Link href="/docs/licences" className="underline">
            Licences
          </Link>
          . Educational models, not for diagnosis or clinical decisions.
        </p>
      </DocsHeader>
      <ConditionGallery conditions={items} systems={systems} />
      <DocsPager href={conditionsPage.href} />
    </div>
  )
}
