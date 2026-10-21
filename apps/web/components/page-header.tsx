import type { ReactNode } from "react"

// The centred title, summary and actions at the top of a page outside the
// docs, such as /blocks or /create.
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 py-12 text-center md:py-16 lg:py-20 xl:gap-4">
      <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] xl:text-5xl xl:tracking-tighter">
        {title}
      </h1>
      <p className="max-w-2xl text-base text-balance text-foreground sm:text-lg">
        {description}
      </p>
      {children && (
        <div className="flex items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">
          {children}
        </div>
      )}
    </header>
  )
}
