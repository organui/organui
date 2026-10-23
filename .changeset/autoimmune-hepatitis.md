---
"@workspace/registry": minor
---

Diseases, a new family of components on the organ viewer. `disease-viewer` shows a condition as findings on organ models: the structures it affects or spares at each stage and scale, beside a panel with its ICD-10 code, course, findings and key investigations. Affected structures are amber and spared ones muted, so a disease of a whole organ still shows. Selecting a structure in 3D or in the panel shows what the disease does there.

`autoimmune-hepatitis` is the first: on the whole liver and on a liver lobule, through active disease, fibrosis and cirrhosis. `liver-lobule` is a new component from an original CC0 schematic model: the central vein, hepatocyte plates in their three zones, the limiting plate, sinusoids with Kupffer cells, and a portal tract at each corner.

The organ viewer repaints when its model's colours change. In the docs, the organ viewer, anatomy tree and disease viewer form a Building blocks group, with demos that show what they do for any model. Diseases have a gallery filtered by body system, linked from the header and the sidebar.
