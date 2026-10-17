# Joints model attribution

`joints.glb` is used by the `joints` registry component.

Z-Anatomy (Gauthier Kervyn, Lluís Vinent Juanico and contributors), https://github.com/LluisV/Z-Anatomy, based in part on BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS), https://lifesciencedb.jp/bp3d/.

- Model/data license: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Z-Anatomy's BodyParts3D-derived content was originally licensed under [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
- Source files: `Joints100.fbx` and `SkeletalSystem100.fbx` from commit `6c7f9016bd5899ac8edafd31b9900c151df42ed6`, each checked by size and SHA-256.
- Retrieved: 2026-10-17.
- Full hashes and the source objects behind each structure: [scripts/models/joints/manifest.json](../../../../scripts/models/joints/manifest.json). The build script is `scripts/models/joints/prepare.ts`.
- BodyParts3D original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for anatomical concepts”, Nucleic Acids Research 37 (2009), D782–D785. [DOI](https://doi.org/10.1093/nar/gkn613).

Changes by OrganUI (2026): selected the ligaments, joint capsules, articular discs, menisci, labra, membranes and intervertebral discs of `Joints100.fbx` and joined the left and right copies of each into one structure; merged the intervertebral discs into cervical, thoracic and lumbar structures; left out the triradiate cartilage (a growth cartilage that fuses in the teens), the nuclei pulposi (hidden inside their discs) and Z-Anatomy's cross-section helpers; added the bones of `SkeletalSystem100.fbx`, merged into six context structures, without teeth, auditory ossicles or nasal cartilages; welded vertices; simplified each mesh with meshoptimizer (about 957,000 to 224,000 triangles); recentred and uniformly scaled coordinates; recomputed smooth normals; assigned illustrative colors; quantized positions and normals (KHR_mesh_quantization); and converted FBX to GLB. No sculpting or invented anatomy.

`joints.glb` and screenshots of it are adaptations distributed under CC BY-SA 4.0. The MIT license for OrganUI code does not relicense them. Preserve this attribution, the license link and the modification notice when redistributing. Neither Z-Anatomy nor DBCLS endorses this demonstration. The source can contain missing or incorrect anatomical representations.
