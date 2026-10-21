import { cache, type CSSProperties } from "react"
import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

export type CodeLanguage = "tsx" | "bash" | "json" | "css"

// Documentation palettes must retain text contrast on both themed surfaces.
let highlighter: ReturnType<typeof createHighlighterCore> | undefined

export const highlightCode = cache(
  async (code: string, lang: CodeLanguage = "tsx") => {
    highlighter ??= createHighlighterCore({
      themes: [
        import("shiki/themes/github-light-high-contrast.mjs"),
        import("shiki/themes/github-dark-high-contrast.mjs"),
      ],
      langs: [
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/css.mjs"),
      ],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
    const shiki = await highlighter
    return shiki
      .codeToTokens(code, {
        lang,
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
  }
)
