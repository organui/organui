# Nerves model attribution

Z-Anatomy (Gauthier Kervyn, Lluís Vinent Juanico and contributors), https://github.com/LluisV/Z-Anatomy, based in part on BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS), https://lifesciencedb.jp/bp3d/.

- Model/data license: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/) ([snapshot of Z-Anatomy's notice](z-anatomy-LICENSE.txt)). Z-Anatomy's BodyParts3D-derived content was originally licensed under [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en), whose share-alike terms allow adaptations under later versions such as 4.0.
- Source file: `Resources/Models/FBX/NervousSystem100.fbx` from commit `6c7f9016bd5899ac8edafd31b9900c151df42ed6`, checked by size and SHA-256 ([inputs.json](inputs.json)). This is the same source, commit and licence as the ear and nose explorers.
- Retrieved: 2026-10-17.
- Full hashes and the source-to-runtime mapping: [manifest.json](manifest.json).
- BodyParts3D original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for anatomical concepts”, Nucleic Acids Research 37 (2009), D782–D785. [DOI](https://doi.org/10.1093/nar/gkn613).

Why Z-Anatomy: BodyParts3D 4.3 (the olivercase/body_parts_3d_api mirror most explorers use) models the cranial nerves and the left arm's nerves but has no nerves of the legs, pelvis or right arm. Z-Anatomy has the whole peripheral nervous system on both sides.

Changes by OrganUI (2026): selected the 256 meshes of the peripheral nervous system (leaving out Z-Anatomy's label pins) and grouped them into 41 structures, each nerve with its branches and left and right together; recentred and uniformly scaled coordinates; welded vertices and simplified the surfaces (1,210,718 to 181,568 triangles); recomputed smooth normals; assigned illustrative colors; and converted FBX to GLB with `prepare.ts`. No invented anatomy.

Known gaps in the source: there is no phrenic nerve, no inferior gluteal nerve and no cervical plexus branches other than the accessory nerve's course through the neck.

`apps/web/public/models/nerves.glb` and screenshots of it are adaptations distributed under CC BY-SA 4.0. The MIT license for OrganUI code does not relicense them. Preserve this attribution, the license link, and the modification notice when redistributing. Neither Z-Anatomy nor DBCLS endorses this work.
