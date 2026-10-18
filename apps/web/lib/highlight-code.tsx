import { cache, type CSSProperties } from "react"
import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

// Documentation palettes must retain text contrast on both themed surfaces.
let highlighter: ReturnType<typeof createHighlighterCore> | undefined

export const highlightCode = cache(async (code: string) => {
  highlighter ??= createHighlighterCore({
    themes: [
      import("shiki/themes/github-light-high-contrast.mjs"),
      import("shiki/themes/github-dark-high-contrast.mjs"),
    ],
    langs: [import("shiki/langs/tsx.mjs")],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  })
  const shiki = await highlighter
  return shiki
    .codeToTokens(code, {
      lang: "tsx",
      themes: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast",
      },
      defaultColor: false,
    })
    .tokens.map((line) =>
      line.map((token, index) => (
        <span
          key={index}
          style={token.htmlStyle as CSSProperties}
          className="text-(--shiki-light) dark:text-(--shiki-dark)"
        >
          {token.content}
        </span>
      ))
    )
})
