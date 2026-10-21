import { track } from "@vercel/analytics"

// What the site counts: copies, so we know which items people take.
export type Event =
  | "copy_install_command"
  | "copy_code"
  | "copy_page"
  | "copy_block_command"
  | "copy_chart_code"
  | "copy_color"
  | "copy_create_command"

export function trackEvent(
  name: Event,
  properties?: Record<string, string | number | boolean | null>
) {
  track(name, properties)
}
