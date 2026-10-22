---
"@workspace/registry": minor
---

Two more charts in clinical forms: a NEWS2 early warning score, scored from raw observations, as a radar of each parameter's points with the risk level, and medication adherence as the proportion of days covered against the 80% threshold. The heart-rate chart marks events on its timeline. Vaccine coverage now draws each ring on a 0–100% scale, where before the highest value filled its ring, and marks the 95% target.

Four generic charts are deprecated and will be removed in the next major release: the admissions area chart, the appointments bar chart, the ED visits bar chart (ED arrivals, `chart-area-ed-arrivals`, replaces both of those), and the blood donations pie chart. They still install, and the CLI notes the deprecation.
