---
"@workspace/registry": minor
---

The clinical readouts follow shadcn's component pattern: vital signs, the lab results table, the ECG trace, the medication schedule and the growth chart take every prop of their root element, such as `id` and `aria-*`, and mark it with `data-slot`.

Vital signs keep red for nothing but critical values, as the lab results table does: a high or low reading is bold with an arrow, and the readings sit two to a row, or all in one row when they fit. The medication schedule draws an icon for each interaction's severity and colours separation warnings by it, labels its timeline on the gridlines so the hours never overlap, and lays out by its own width rather than the screen's. The ECG calibration pulse is 0.2 s wide at any paper speed. The growth chart fits narrow screens before it measures itself and says when a measurement falls outside the standard. An empty lab results table says so.
