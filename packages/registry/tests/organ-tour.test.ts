import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import type { OrganModel } from "../registry/base-nova/organ-viewer/organ-viewer"
import {
  formatSpan,
  OrganTour,
  tourMagnification,
  type Tour,
} from "../registry/base-nova/organ-tour/organ-tour"

const model: OrganModel = {
  name: "Liver",
  src: "/liver.glb",
  structures: [{ id: "liver", label: "Liver", group: "Liver", color: "#a33" }],
  views: [{ name: "Anterior", direction: [0, 0, 1] }],
  defaultView: "Anterior",
  attribution: { credit: "", license: "", licenseUrl: "", source: "" },
}

const tour: Tour = {
  name: "A tour",
  chapters: [
    {
      id: "organ",
      label: "The organ",
      model,
      span: 220,
      captions: [{ text: "The whole liver.", structureId: "liver" }],
      question: {
        question: "What is it?",
        options: ["A liver", "A lung"],
        answer: 0,
        explanation: "It is a liver.",
      },
    },
    {
      id: "tissue",
      label: "The tissue",
      model,
      span: 1.5,
      captions: [{ text: "A lobule." }],
    },
    {
      id: "cell",
      label: "The cell",
      model,
      span: 0.03,
      captions: [{ text: "One cell." }],
    },
  ],
}

test("sizes read in the unit that suits them", () => {
  expect(formatSpan(220)).toBe("22 cm")
  expect(formatSpan(10)).toBe("1 cm")
  expect(formatSpan(1.5)).toBe("1.5 mm")
  expect(formatSpan(0.03)).toBe("30 µm")
})

test("magnification counts from the widest chapter, wherever it comes", () => {
  const [organ, tissue, cell] = tour.chapters
  expect(tourMagnification(tour, organ!)).toBe(1)
  expect(tourMagnification(tour, tissue!)).toBe(150)
  expect(tourMagnification(tour, cell!)).toBe(7300)
  const reversed = { ...tour, chapters: [...tour.chapters].reverse() }
  expect(tourMagnification(reversed, organ!)).toBe(1)
})

test("a tour opens on its first caption, with the scale and every chapter", () => {
  const html = renderToStaticMarkup(createElement(OrganTour, { tour }))
  expect(html).toContain("The whole liver.")
  expect(html).toContain("×1 · 22 cm")
  expect(html).toContain("step 1 of 2")
  expect(html).toContain("Check understanding")
  for (const { label } of tour.chapters) expect(html).toContain(label)
  expect(html.match(/aria-current="step"/g)).toHaveLength(1)
  // The highlighted structure is named beside the caption.
  expect(html).toContain(">Liver</span>")
})

test("a chapter opens on its own scale, and the last one offers to finish", () => {
  const html = renderToStaticMarkup(
    createElement(OrganTour, { tour, defaultChapter: "cell" })
  )
  expect(html).toContain("One cell.")
  expect(html).toContain("×7,300 · 30 µm")
  expect(html).toContain("step 1 of 1")
  expect(html).toContain("Finish")
})

test("a chapter without a question goes straight to the next chapter", () => {
  const html = renderToStaticMarkup(
    createElement(OrganTour, { tour, chapter: "tissue" })
  )
  expect(html).toContain("Next: The cell")
  expect(html).not.toContain("Check understanding")
})
