# Diaphragm model attribution

`diaphragm.glb` is built from BodyParts3D / Anatomography, © The Database
Center for Life Science (DBCLS). https://lifesciencedb.jp/bp3d/

- Version: BodyParts3D 3.0 (release 20110915, `BodyParts3D_3.0_obj_95`).
- Licence: [Creative Commons Attribution-Share Alike 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)
  ([legal code](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)),
  as stated by the [original service](https://lifesciencedb.jp/bp3d/info/index.html#License)
  and the mirror the meshes came from.
- Source meshes: binary STLs from the public
  [Kevin-Mattheus-Moerman/BodyParts3D](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D)
  mirror at commit `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`, each checked
  against the SHA-256 pinned in
  [`scripts/models/diaphragm.ts`](../../../../scripts/models/diaphragm.ts),
  which rebuilds this file.
- Retrieved: 2026-10-17.
- Original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for
  anatomical concepts”, Nucleic Acids Research 37 (2009), D782–D785.
  [DOI](https://doi.org/10.1093/nar/gkn613).

| Structure                | Concept  | Source name              |
| ------------------------ | -------- | ------------------------ |
| Right hemidiaphragm      | FMA13295 | diaphragm (right half)   |
| Left hemidiaphragm       | FMA13295 | diaphragm (left half)    |
| Esophagus                | FMA7131  | esophagus                |
| Inferior vena cava       | FMA10951 | inferior vena cava       |
| Descending aorta         | FMA3784  | descending aorta         |
| Heart                    | FMA7274  | wall of heart            |
| Lower lobe of right lung | FMA7337  | lower lobe of right lung |
| Lower lobe of left lung  | FMA7371  | lower lobe of left lung  |
| Liver                    | FMA7197  | liver                    |
| Stomach                  | FMA7148  | stomach                  |
| Spleen                   | FMA7196  | spleen                   |
| Right psoas major        | FMA22342 | right psoas major        |
| Left psoas major         | FMA22343 | left psoas major         |

Changes by OrganUI (2026): selected 12 meshes; cut the single diaphragm mesh
at its midline into right and left halves; cut the esophagus and aorta at the
heart and the psoas muscles below the diaphragm; welded STL vertices; simplified
dense meshes with meshoptimizer; recentred and uniformly scaled coordinates;
changed axes from Z-up to Y-up; recomputed smooth normals; assigned
illustrative colours; and converted STL to GLB. No anatomy was invented.

`diaphragm.glb` and screenshots of it are adaptations distributed under the
same CC BY-SA 2.1 Japan licence. The MIT licence for OrganUI code does not
relicense them. Preserve this attribution, the licence link and the
modification notice when redistributing. Neither DBCLS nor the mirror author
endorses OrganUI. The source notes that the database can contain missing or
incorrect anatomical representations.
