/**
 * Copies text to the clipboard. Falls back to a hidden textarea and
 * execCommand when the Clipboard API is missing or blocked, such as in an
 * iframe without clipboard-write permission. Resolves whether it copied.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    const active = document.activeElement as HTMLElement | null
    document.body.append(textarea)
    textarea.select()
    try {
      return document.execCommand("copy")
    } catch {
      return false
    } finally {
      textarea.remove()
      active?.focus()
    }
  }
}
