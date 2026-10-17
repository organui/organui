import { OrganSwitcher } from "@/components/organ-switcher"
import { heartModel } from "@/components/heart"
import { kidneysModel } from "@/components/kidneys"
import { pancreasModel } from "@/components/pancreas"
import { stomachModel } from "@/components/stomach"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Organs</h1>
        <p className="text-muted-foreground">
          Pick an organ, then select a structure to learn about it.
        </p>
      </div>
      <OrganSwitcher
        models={[heartModel, kidneysModel, stomachModel, pancreasModel]}
      />
    </main>
  )
}
