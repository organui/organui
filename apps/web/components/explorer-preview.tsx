"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import type { Explorer } from "@/lib/explorers"

export function ExplorerPreview({
  explorer,
  index,
}: {
  explorer: Explorer
  index: number
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [viewIndex, setViewIndex] = useState(0)
  const [opened, setOpened] = useState(false)
  const view = explorer.views[viewIndex]!

  function open() {
    setViewIndex(0)
    setOpened(true)
    dialog.current?.showModal()
  }
  return (
    <>
      <button
        className={`preview-trigger preview-${explorer.id}`}
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`View ${explorer.name} preview`}
      >
        <span className="preview-topline">
          <span>
            0{index + 1} / {explorer.name}
          </span>
          <span>3D anatomy</span>
        </span>
        <Image
          src={`/previews/${explorer.id}-cover.webp`}
          alt={explorer.imageAlt}
          fill
          sizes="(max-width: 700px) 92vw, (max-width: 1400px) 31vw, 416px"
          preload={index === 0}
        />
        <span className="preview-bottomline">
          <span>View preview</span>
          <span className="preview-arrow">
            <ArrowUpRight aria-hidden="true" size={19} />
          </span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="preview-dialog"
        aria-labelledby={`${explorer.id}-preview-title`}
        aria-describedby={`${explorer.id}-preview-note`}
        onClose={() => setOpened(false)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href]"
          )
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        <div className="dialog-body">
          <header className="dialog-header">
            <div>
              <p className="eyebrow">The anatomy collection / 0{index + 1}</p>
              <h2 id={`${explorer.id}-preview-title`}>
                {explorer.name} explorer
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="close-preview"
              aria-label="Close preview"
              onClick={() => dialog.current?.close()}
            >
              <X size={20} />
            </Button>
          </header>
          <p id={`${explorer.id}-preview-note`} className="preview-note">
            Screenshot preview · Public demo coming soon
          </p>
          <div
            className="view-switcher"
            role="group"
            aria-label={`${explorer.name} screenshot views`}
          >
            {explorer.views.map((item, i) => (
              <Button
                key={item.file}
                variant="ghost"
                aria-pressed={i === viewIndex}
                onClick={() => setViewIndex(i)}
              >
                {item.name}
              </Button>
            ))}
          </div>
          <figure>
            <div className="screenshot-frame">
              {opened && (
                <Image
                  key={view.file}
                  src={`/previews/${explorer.id}-${view.file}.webp`}
                  alt={view.alt}
                  fill
                  sizes="(max-width: 700px) 94vw, 1000px"
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
            <figcaption>{view.alt}</figcaption>
          </figure>
          <div className="dialog-footer">
            <p>
              BodyParts3D / DBCLS · Adapted by OrganUI ·{" "}
              <a
                href={
                  explorer.id === "lungs"
                    ? "https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en"
                    : "https://creativecommons.org/licenses/by/4.0/"
                }
              >
                {explorer.id === "lungs" ? "CC BY-SA 2.1 Japan" : "CC BY 4.0"}
              </a>
            </p>
            <a
              href={`/previews/${explorer.id}-${view.file}.webp`}
              target="_blank"
              rel="noreferrer"
            >
              Open full image <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </dialog>
    </>
  )
}
