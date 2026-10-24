---
"@workspace/registry": minor
---

The disease viewer shows a disease's course as a timeline under the model. Each stage sits at its typical `time`, and the disease's new `events` (treatments, tests and turning points) sit under their stage; selecting one shows what happens then. Play steps through the course while the model fades from one stage's colours to the next, without the fade when the reader prefers reduced motion. A stage marked `alternative` is another path from the one before it, joined by a dashed line. The stage switch moves from the panel to the timeline; pass `timeline={false}` to hide it. Autoimmune hepatitis and myocardial infarction have their timings and events.
