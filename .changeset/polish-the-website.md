---
"@workspace/registry": minor
---

Every item installs on shadcn's Radix styles as well as Base UI: a `{style}`
registry URL (`https://organui.com/r/styles/{style}/{name}.json`) serves
Radix projects a Radix build, with Radix copies of the anatomy tree, the
organ, molecule and image viewers, the DNA helix and the blocks' components.

New items:

- AI Elements, built on shadcn's components: AI disclaimer, clinical
  citation (Hover Card and Button), clinical sources (Trace), differential
  list and clinician review (Item), and AI note.
- Helpers: age, z-scores, reference ranges, clinical units and body
  measurements. The growth chart and lab results table now install the
  ones they use.
- CSS utilities: heartbeat, ECG grid and severity colours.

Blocks carry the height /blocks frames them at, in `meta.iframeHeight`.
