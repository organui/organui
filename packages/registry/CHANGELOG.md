# @workspace/registry

## 0.5.0

### Minor Changes

- 7461b36: Every item installs on shadcn's Radix styles as well as Base UI: a `{style}`
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
  - Utilities: one item adds the heartbeat, ECG grid and severity classes to
    the CSS file, as shadcn's utilities come together.

  Blocks: Dashboard 01, one patient at a glance with vital signs, a live ECG,
  lab results and the day's medicines.

  Charts: 21 charts of health data (area, bar, line, pie, radar and radial)
  built on shadcn's chart and card, each installable like shadcn's charts.

  Every component documents each prop with a doc comment, which the docs
  show as its API Reference.

  Blocks carry the height /blocks frames them at, in `meta.iframeHeight`.
