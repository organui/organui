import { OrganExplorer } from "@/components/organ-explorer"
import { heartModel } from "@/components/heart"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {heartModel.name}
        </h1>
        <p className="text-muted-foreground">
          Rotate the model, or open the anatomy panel to find and hide
          structures.
        </p>
      </div>
      <OrganExplorer model={heartModel} />
    </main>
  )
}
