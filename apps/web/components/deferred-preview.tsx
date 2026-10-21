"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"

// Heavy demos join the shared preview without loading their scene offscreen.
export function DeferredPreview({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!viewport.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(({ isIntersecting }) => isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "160px" }
    )
    observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={viewport} className="w-full min-w-0">
      {visible ? (
        children
      ) : (
        <Skeleton aria-hidden="true" className="h-[28rem] w-full rounded-xl" />
      )}
    </div>
  )
}
