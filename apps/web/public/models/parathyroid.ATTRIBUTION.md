# Parathyroid model attribution

`parathyroid.glb` (1,099,860 bytes, SHA-256
`5bd9e26b4ffdb10e0d97ec7a1a1e430cceae8ebc33a8475d97f4be1830c72782`) is an
adaptation of BodyParts3D / Anatomography, © The Database Center for Life
Science (DBCLS). https://lifesciencedb.jp/bp3d/

- Version: BodyParts3D / Anatomography 4.3 (object set 4.3, ontology tree FMA3.0).
- Licence: [Creative Commons Attribution-Share Alike 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) ([legal code](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)), as stated by the [original service](https://lifesciencedb.jp/bp3d/info/index.html#License) for contour data and rendered images. The official archive was unreachable from the build environment, so the meshes came from a mirror and carry the CC BY-SA 2.1 Japan notice they were redistributed under, not the archive's CC BY 4.0 grant for release 4.0.
- Source meshes: the public [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) mirror at commit `fd527e6f4daf732fd814314d9257df5877b844bc`, retrieved 2026-10-17. Each OBJ matched the SHA-256 in its Git LFS pointer, its own `File ID` and `Concept ID` headers, and the official 4.3 IS-A table preserved in [organui/thyroid-3d](https://github.com/organui/thyroid-3d/blob/2c5ef5a464cc6bfcb322c7d074dec79543346f86/docs/model-source/FMA2Obj-4.3.tsv).
- Original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for anatomical concepts”, Nucleic Acids Research 37 (2009), D782–D785. [DOI](https://doi.org/10.1093/nar/gkn613).

| Structure                    | Source concept                            | Element | Triangles | Source SHA-256                                                     |
| ---------------------------- | ----------------------------------------- | ------- | --------- | ------------------------------------------------------------------ |
| `right-lobe`                 | FMA13368 Right lobe of thyroid gland      | FJ3672  | 5061      | `579d28267ec22b2536878fe2c78947f812d60e3ce3b9e5621f1faab7ce6f63f2` |
| `left-lobe`                  | FMA13369 Left lobe of thyroid gland       | FJ3671  | 4741      | `2a137c718b0f7f6150978730c78f9003db6dce5324e31ba5cb368d6ce7f57c58` |
| `isthmus`                    | FMA49178 Isthmus of thyroid gland         | FJ3670  | 1746      | `798a3b54f78eb3cc20f118b914202855e003b252a7e479f022fe1c2d6b9b14c0` |
| `right-superior-parathyroid` | FMA55560 Right superior parathyroid gland | FJ3676  | 136       | `aa3bd725d5702aeaab656f42c0d3c423b609628c00680a4be113c01e3d9c8d1a` |
| `right-inferior-parathyroid` | FMA55562 Right inferior parathyroid gland | FJ3675  | 146       | `f8c9b50c20f355868e1b522ddb38cf8f25779afd40fc7505012361964ea1bc00` |
| `left-superior-parathyroid`  | FMA55561 Left superior parathyroid gland  | FJ3674  | 142       | `8c0fa01bc501ccca78d11bf3c4572160d96d1f284c171c64deb2992a1ea445fd` |
| `left-inferior-parathyroid`  | FMA55563 Left inferior parathyroid gland  | FJ3673  | 160       | `28856a004c1398a05a667947cc0df0f01f2d02319b9fe0ad53fe4ffa7b49417a` |
| `thyroid-cartilage`          | FMA55099 Thyroid cartilage                | FJ2808  | 2610      | `7ee325a7e90428925aa6885abb683d9e06df2fe13f8f35f398a2ae6de1ec2a21` |
| `cricoid-cartilage`          | FMA9615 Cricoid cartilage                 | FJ2440  | 1702      | `4621d2c2d7d804fc4c7becedadf5d3507ac344888a00ef69573c50841402e877` |

## Changes by OrganUI (2026)

Built with the model script of [organui/thyroid-3d at 2c5ef5a](https://github.com/organui/thyroid-3d/blob/2c5ef5a464cc6bfcb322c7d074dec79543346f86/scripts/prepare-model.ts), restricted to the nine elements above: faces triangulated, coordinates recentred on these elements' bounds (centre `[-0.67485, -106.95605, 1400.605]` mm) and uniformly scaled by 0.025, axes changed from source `[x, y, z]` to `[x, z, -y]` (Z-up to Y-up), smooth normals recomputed, illustrative colours assigned, and OBJ converted to GLB with one node per structure. No decimation or invented anatomy. The source notes that the database can contain missing or incorrect anatomical representations, and real parathyroid positions vary between people.

Preserve this attribution, the licence link and the modification notice when redistributing the model or images of it. The MIT licence of OrganUI's code does not relicense it. Neither DBCLS nor the mirror author endorses OrganUI.
