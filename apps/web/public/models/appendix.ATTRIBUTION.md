# appendix.glb attribution

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.

- Original dataset: [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html), release 3.0 (20110915), polygon reduction 95%.
- Copy used: binary STL conversions of that release in [Kevin-Mattheus-Moerman/BodyParts3D](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D) at commit `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61` (`assets/BodyParts3D_data/stl/`), which distributes the data under CC BY-SA 2.1 Japan.
- Retrieved: 2026-10-17. Every input is pinned by SHA-256 in [`apps/web/scripts/models/appendix.ts`](../../scripts/models/appendix.ts), which rebuilds this file.
- Model/data license: [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en). `appendix.glb` is an adaptation and is shared under the same license.
- Original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for anatomical concepts”, Nucleic Acids Research 37 (2009), D782–D785. [DOI](https://doi.org/10.1093/nar/gkn613).

| Structure                         | FMA      | Source triangles | Kept   |
| --------------------------------- | -------- | ---------------- | ------ |
| Vermiform appendix                | FMA14542 | 690              | 690    |
| Cecum and ascending colon (colon) | FMA14543 | 69,516           | 9,354  |
| Ileum, terminal part              | FMA7208  | 31,250           | 5,074  |
| Right external iliac artery       | FMA18806 | 1,344            | 1,344  |
| Right external iliac vein         | FMA18885 | 1,326            | 1,326  |
| Right psoas major                 | FMA22342 | 56,614           | 23,909 |
| Right iliacus                     | FMA22322 | 44,402           | 32,191 |

Changes by OrganUI: selected seven meshes; kept only the triangles of the colon, ileum, psoas major and iliacus that lie in the right lower abdomen (the region is in the build script), which leaves open cut edges, then dropped the pieces of colon and ileum not connected to the cecum (stray sigmoid colon and the other ileal coils); welded duplicate STL vertices; recentered and uniformly scaled coordinates; changed axes from Z-up to Y-up; recomputed smooth normals; assigned illustrative colors; converted STL to GLB. No decimation, sculpting or invented anatomy.

The MIT license for OrganUI's code does not relicense this model or images of it. Preserve this attribution, the license link and the modification notice when redistributing the model. DBCLS does not endorse OrganUI. The source can contain missing or incorrect anatomical representations.
