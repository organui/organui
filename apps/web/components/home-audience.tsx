import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { conditions, conditionsPage, organs, shadcn } from "@/lib/registry"
import { cn } from "@workspace/ui/lib/utils"

const fan = [
  "ischaemic-stroke",
  "myocardial-infarction",
  "lobar-pneumonia",
].flatMap((name) => conditions.filter((condition) => condition.name === name))

const heart = organs.find(({ name }) => name === "heart")

// What an assistant sees, one line at a time: the shadcn MCP server, a
// prompt, and the Markdown docs it reads before it installs.
const transcript = [
  { kind: "command", text: `npx ${shadcn} mcp init --client claude` },
  { kind: "done", text: "shadcn MCP server ready" },
  { kind: "prompt", text: "Add the heart from @organui to the home page" },
  { kind: "read", text: `GET organui.com${heart?.href ?? "/docs"}.md` },
  { kind: "read", text: "GET organui.com/llms.txt" },
  { kind: "done", text: "Added @organui/heart and @organui/organ-viewer" },
] as const

export function HomeAudience() {
  return (
    <section
      aria-labelledby="home-audience"
      className="border-y bg-muted/40 dark:bg-muted/20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 md:py-28">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="font-mono text-xs tracking-widest text-chart-2 uppercase">
            One registry, two readers
          </p>
          <h2
            id="home-audience"
            className="text-3xl font-semibold tracking-tighter text-balance sm:text-5xl"
          >
            Built to be read by people and by assistants.
          </h2>
        </div>
        <div className="grid gap-4 *:min-w-0 md:grid-cols-2">
          <article className="group/humans relative flex flex-col gap-6 overflow-hidden rounded-2xl border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold tracking-tight">
                For <span className="italic">humans</span>
              </h3>
              <p className="text-muted-foreground">
                Source in your repository, on your theme. Organs and{" "}
                {conditions.length} conditions you can rotate and read, clinical
                charts with their reference ranges, molecules and medical
                images.
              </p>
            </div>
            <div className="relative flex h-56 items-center justify-center sm:h-64">
              {fan.map((condition, index) => (
                <Link
                  key={condition.name}
                  href={condition.href}
                  className={cn(
                    "absolute w-[46%] overflow-hidden rounded-xl border bg-background shadow-lg transition-transform duration-500 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    index === 0 &&
                      "-translate-x-[58%] -rotate-8 group-hover/humans:-translate-x-[72%] group-hover/humans:-rotate-12",
                    index === 1 && "z-10 -translate-y-2",
                    index === 2 &&
                      "translate-x-[58%] rotate-8 group-hover/humans:translate-x-[72%] group-hover/humans:rotate-12"
                  )}
                >
                  <Image
                    src={`/conditions/${condition.name}.webp`}
                    width={640}
                    height={480}
                    alt=""
                    sizes="16rem"
                    className="aspect-[4/3] w-full object-contain"
                  />
                  <span
                    className={cn(
                      "block border-t px-3 py-2 text-xs font-medium",
                      index === 2 && "text-end"
                    )}
                  >
                    {condition.title}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href={conditionsPage.href}
              className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium underline-offset-4 hover:underline"
            >
              See the conditions
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </article>
          <article className="flex flex-col gap-6 rounded-2xl border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold tracking-tight">
                For <span className="font-mono font-medium">agents</span>
              </h3>
              <p className="text-muted-foreground">
                Every page is Markdown at its address plus <code>.md</code>, the
                site has an <code>llms.txt</code>, and the shadcn MCP server
                finds <code>@organui</code> by name.
              </p>
            </div>
            <figure className="bg-code flex min-h-56 flex-col overflow-hidden rounded-xl border font-mono text-xs sm:min-h-64 sm:text-[0.8rem]">
              <div className="flex items-center gap-1.5 border-b px-4 py-3">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <figcaption className="ms-2 text-muted-foreground">
                  Assistant session
                </figcaption>
              </div>
              <ol className="flex flex-col gap-2 overflow-x-auto p-4 leading-relaxed">
                {transcript.map((line) => (
                  <li
                    key={line.text}
                    className="home-line flex gap-2 whitespace-nowrap"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-3 shrink-0 select-none",
                        line.kind === "done" && "text-chart-2",
                        line.kind !== "done" && "text-muted-foreground"
                      )}
                    >
                      {
                        {
                          command: "$",
                          done: "✓",
                          prompt: ">",
                          read: "↳",
                        }[line.kind]
                      }
                    </span>
                    <span
                      className={cn(
                        line.kind === "read" && "text-muted-foreground",
                        line.kind === "prompt" && "font-medium text-foreground",
                        line.kind === "command" && "text-foreground"
                      )}
                    >
                      {line.text}
                    </span>
                  </li>
                ))}
                <li aria-hidden="true">
                  <span className="home-caret inline-block h-4 w-2 translate-y-0.5 bg-foreground/70" />
                </li>
              </ol>
            </figure>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <Link
                href="/docs/mcp"
                className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
              >
                Set up MCP
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
              <a
                href="/llms.txt"
                className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
              >
                Read llms.txt
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
