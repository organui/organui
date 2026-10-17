# Salivary glands model attribution

Z-Anatomy (Gauthier Kervyn, Lluís Vinent Juanico and contributors), https://github.com/LluisV/Z-Anatomy, based in part on BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS), https://lifesciencedb.jp/bp3d/.

- Model/data license: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Z-Anatomy's BodyParts3D-derived content was originally licensed under [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
- Source files: `Resources/Models/FBX/VisceralSystem100.fbx` (SHA-256 `22b301c93327929c9a14ee582d1848b550a950376e221a6d1078c7256bb83d0e`) and `Resources/Models/FBX/SkeletalSystem100.fbx` (SHA-256 `294a649765cd060a62a4095da52b9c8ef2d97769aa447e196448aa5f7d596dea`) at Z-Anatomy commit `6c7f9016bd5899ac8edafd31b9900c151df42ed6`.
- Retrieved: 2026-10-17.
- Build script: [`packages/registry/scripts/models/salivary-glands.ts`](../../../../packages/registry/scripts/models/salivary-glands.ts), which verifies both hashes and lists the source object for every structure.
- BodyParts3D original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for anatomical concepts”, Nucleic Acids Research 37 (2009), D782–D785. [DOI](https://doi.org/10.1093/nar/gkn613).

| Structure                                                   | Z-Anatomy object                                           |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| right-parotid-gland, left-parotid-gland                     | `Parotid_glandr`, `Parotid_glandl`                         |
| right-accessory-parotid-gland, left-accessory-parotid-gland | `(Accessory_parotid_gland)r`, `(Accessory_parotid_gland)l` |
| right-parotid-duct, left-parotid-duct                       | `Parotid_ductr`, `Parotid_ductl`                           |
| right-submandibular-gland, left-submandibular-gland         | `Submandibular_glandr`, `Submandibular_glandl`             |
| right-submandibular-duct, left-submandibular-duct           | `Submandibular_ductr`, `Submandibular_ductl`               |
| right-sublingual-gland, left-sublingual-gland               | `Sublingual_glandr`, `Sublingual_glandl`                   |
| tongue                                                      | `Tongue` (VisceralSystem100)                               |
| mandible, hyoid-bone                                        | `Mandible`, `Hyoid_bone` (SkeletalSystem100)               |

Changes by OrganUI (2026): selected 15 source objects, one per structure, applied their scene transforms, welded coincident vertices, recentred and uniformly scaled coordinates, recomputed smooth normals, assigned illustrative colors, and converted FBX to GLB. No decimation and no invented anatomy.

`salivary-glands.glb` and screenshots of it are adaptations distributed under CC BY-SA 4.0. The MIT license for OrganUI code does not relicense them. Preserve this attribution, the license link, and the modification notice when redistributing. Neither Z-Anatomy nor DBCLS endorses this project.
