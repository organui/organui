# Pituitary gland model attribution

`pituitary.glb` is adapted from BodyParts3D, © The Database Center for Life
Science, licensed under
[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
The adapted model is shared under the same licence. This licence covers the
model only; the OrganUI code is MIT.

Credit: BodyParts3D / Anatomography, © The Database Center for Life Science. CC BY-SA 2.1 Japan. Adapted by OrganUI.

- Dataset: BodyParts3D 4.3 OBJ meshes (official licence statement:
  https://lifesciencedb.jp/bp3d/info/index.html#License)
- Retrieved from the GitHub mirror https://github.com/olivercase/body_parts_3d_api at commit
  `fd527e6f4daf732fd814314d9257df5877b844bc`, checked against the official `FMA2Obj.txt` mapping
  (sha256 `a199eb9cb258266768b7690f4ac2591f67d4b146c95e14046c46091c35c09385`)
- Changes: meshes merged per structure, recentred, scaled uniformly by
  0.025 per millimetre and reoriented to +y superior, +z anterior; normals
  recomputed. No geometry was reshaped.
- Built by `bun scripts/models/build.ts pituitary`.
- Output: 1002364 bytes, sha256 `5f7835b2331d3d2a3471fc648279d5e9687c1820d3709046d82b1785f12a6256`

| Structure                         | FMA concept | Source name                                   | Element | sha256                                                             |
| --------------------------------- | ----------- | --------------------------------------------- | ------- | ------------------------------------------------------------------ |
| pituitary-gland                   | FMA13889    | Pituitary gland                               | FJ1796  | `545f63719b069a73dedff8c54dc716546726ddbc837d818a6c77dda1a966e93c` |
| hypothalamus                      | FMA62008    | Hypothalamus                                  | FJ1760  | `c905d57330e86bcbc62f1494346fe25d77579bd3c10faa38c6cde4216288028c` |
| hypothalamus                      | FMA62008    | Hypothalamus                                  | FJ1808  | `677133923905d836da89e3641e006e35565412a6e8f8b22966ad1c807164dcd0` |
| tuber-cinereum                    | FMA62327    | Tuber cinereum                                | FJ1780  | `da1ed143a5094de8ff34736499c2e02dc5440610692d03e4730dc3a24e78c121` |
| tuber-cinereum                    | FMA62327    | Tuber cinereum                                | FJ1828  | `af2d51ff0d06e454f95a4da06ab5cf31e57895e06a1d910624ebdb6ef26c1b2a` |
| mammillary-bodies                 | FMA74877    | Mammillary body                               | FJ7485  | `d7befce8a6e36a37f2ca24672dedc44a6929e736630c728733e2587abc2c22b4` |
| mammillary-bodies                 | FMA74877    | Mammillary body                               | FJ7485M | `2ad1c7887d82907f26081a8a9b729ac1aa9b55f8f719f3fe566c1b4afd8a9758` |
| supraoptic-nuclei                 | FMA73332    | Left supraoptic nucleus                       | FJ7494  | `970d5af220add626850f06e615da3599a244823591dac8f6dc1d657bc989bb3b` |
| supraoptic-nuclei                 | FMA73331    | Right supraoptic nucleus                      | FJ7494M | `84c887bbe9c41a72929367b1ee00d0322a5a2c051ab04ef74d413e65808298ab` |
| paraventricular-nuclei            | FMA73336    | Left paraventricular nucleus of hypothalamus  | FJ7489  | `11f720dac08ff5b4e9294293089434f5febc226b3301b9af28a845f7e9d783d9` |
| paraventricular-nuclei            | FMA73335    | Right paraventricular nucleus of hypothalamus | FJ7489M | `9fee276737e24dfdcbc722ff7198fa17a5a56922a44d5a0fa7d3318c89c0c335` |
| optic-chiasm                      | FMA62045    | Optic chiasm                                  | FJ7505  | `b233b17435d371dbfd75818957e77c8566225e5f9e4e30668c232cb29dfc72e4` |
| optic-chiasm                      | FMA62045    | Optic chiasm                                  | FJ7505M | `584151bab2b9fb9ffee5f9aea5fd862627577136844bd5cee63915202f82d7a4` |
| right-optic-nerve                 | FMA50875    | Right optic nerve                             | FJ7501  | `15c204aca7e2140d534e10e1bc048cfe8ed67a5ab480365be2fbff5c8e5b398f` |
| left-optic-nerve                  | FMA50878    | Left optic nerve                              | FJ7501M | `b0ffb2097bb6fd3609c68df8aea9b5383c074863e0b4583184a7135ccbae5c54` |
| right-optic-tract                 | FMA62382    | Right optic tract                             | FJ7502  | `35c11b2f84b723d1ed5197cd2b2ad06e6f69769e6dc2bd0f0ca70502c59b33b8` |
| left-optic-tract                  | FMA67936    | Left optic tract                              | FJ7502M | `0d10bf207eba841f998a3407a2091e81b45b9b6fdaca8c04a2aa2ad3baafb7aa` |
| hypophyseal-portal-veins          | FMA50798    | Portal vein of hypophysis                     | FJ5059  | `cf84130b766757ee0eac9eeb4b3d30616c11a7729aa78690c37fa32b0ef27579` |
| hypophyseal-portal-veins          | FMA50798    | Portal vein of hypophysis                     | FJ5158  | `0111de8cb7960bb9c5bc7949b97c9de75b03606104c9c2e921f8d78fc751c80b` |
| right-superior-hypophyseal-artery | FMA49850    | Right superior hypophyseal artery             | FJ5201  | `f0c3d2c936568dc96fa2b4b4dfddb93f255296702750d34bfb9ebab44883e498` |
| right-inferior-hypophyseal-artery | FMA75898    | Trunk of right inferior hypophyseal artery    | FJ5094  | `be82448038bfdaeac83988329b3d0626d4c3773a6afa029bfc2bf630c90f643b` |
| right-internal-carotid-artery     | FMA75866    | Trunk of right internal carotid artery        | FJ1682  | `492d46ad280939035f518f32c8ffa98f2e3d62cf2623515e05b47dd00e025c04` |
| right-cavernous-sinus             | FMA51402    | Right cavernous sinus                         | FJ5064  | `cb6a73c25e3c4f536536f5b6df774fea7ae372b7aa4d9aa1ba8e36176baa5d6c` |
| anterior-intercavernous-sinus     | FMA50774    | Anterior intercavernous sinus                 | FJ4707  | `8ea2cb70f9e434635edf4ab122a84b126cc63431f327defd8817c2eba9429710` |
| posterior-intercavernous-sinus    | FMA50775    | Posterior intercavernous sinus                | FJ4979  | `7f9e7f671caa4a0e4204ab56f33ef826e76f5cb4241130fda57f2364cc796080` |
| sphenoid-bone                     | FMA52736    | Sphenoid bone                                 | FJ3394  | `955ce48240d3037006bb724e1d39eb7b6939e15ce3ef53019a8058cfc19b99e4` |
