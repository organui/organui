# Vestibular system model attribution

`vestibular.glb` (503,164 bytes, SHA-256
`c2a4113e945469f98f37ddd7b6d974ceeff7c6a8bb299de7deda79ca47c9bdf7`) is an
adaptation of **[Z-Anatomy](https://github.com/LluisV/Z-Anatomy)** (Gauthier
Kervyn, Lluís Vinent Juanico and contributors), which builds in part on
BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS).

- Licence: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/), Z-Anatomy's licence. BodyParts3D is licensed [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en), whose share-alike terms allow adaptations under later versions such as 4.0.
- Source: `Resources/Models/FBX/NervousSystem100.fbx` from `LluisV/Z-Anatomy` at commit `6c7f9016bd5899ac8edafd31b9900c151df42ed6` (53,887,724 bytes, SHA-256 `3ea1aad64956cad27348a27b8fb50494b7cc307c6bc77bee0810ec2a67dff2b1`), retrieved 2026-10-17. It is the same pinned file [organui/ear-3d](https://github.com/organui/ear-3d/blob/40ace7ed45cdbf604adda889e5db720ee6b1ce98/docs/MODEL_PROVENANCE.md) uses.

| Structure          | Z-Anatomy object      | Triangles |
| ------------------ | --------------------- | --------- |
| `anterior-canal`   | part of `Vestibule.r` | 2518      |
| `posterior-canal`  | part of `Vestibule.r` | 2869      |
| `lateral-canal`    | part of `Vestibule.r` | 1637      |
| `vestibule`        | part of `Vestibule.r` | 2352      |
| `cochlea`          | `Cochlea.r`           | 6167      |
| `vestibular-nerve` | `Vestibular nerve.r`  | 4688      |

All structures are from the right ear.

## Changes by OrganUI (2026)

Built by [`packages/registry/scripts/prepare-vestibular-model.ts`](../../../../packages/registry/scripts/prepare-vestibular-model.ts); running it again produces a byte-identical file.

- Z-Anatomy models the bony vestibule and its three semicircular canals as one surface, `Vestibule.r`. OrganUI split it: each vertex's wall-to-wall thickness was measured along the inward normal and smoothed, the largest region wider than 0.25 cm became the vestibule, and the thinner tube was divided between the three canals by geodesic distance from Z-Anatomy's own label pins (`Anterior semicircular canal`, `Posterior semicircular canal`, `Lateral semicircular canal`). The cut lines are therefore approximate: each canal's ampulla is shared between the canal and the vestibule, and the common crus is divided between the anterior and posterior canals where their distances meet. Triangles that straddle a boundary are cut where the thickness, or the difference in distance, crosses its threshold, so the cuts follow smooth lines; no source vertex was moved.
- The cochlea and vestibular nerve are copied unchanged.
- Object transforms applied, coincident vertices welded (1e-5 cm), smooth normals recomputed on the whole labyrinth before splitting so the cuts show no seams, coordinates recentred on the labyrinth's bounds and kept in centimetres. Source axes already match the viewer (Y up, +Z anterior). Illustrative colours assigned; one node per structure.
- Not modelled in the source: the membranous labyrinth (utricle, saccule, semicircular ducts), the cristae and maculae, and the vestibular ganglion.

Preserve this attribution, the licence link and the modification notice when redistributing the model or images of it. The MIT licence of OrganUI's code does not relicense it. Neither Z-Anatomy nor DBCLS endorses OrganUI.
