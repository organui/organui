# Pineal gland model attribution

`pineal.glb` is adapted from BodyParts3D, © The Database Center for Life
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
- Built by `bun scripts/models/build.ts pineal`.
- Output: 1107736 bytes, sha256 `9dbda61907480aa2ee2b55b26ad37f2074e0d8e4939c77903749527d789ee386`

| Structure                    | FMA concept | Source name                        | Element | sha256                                                             |
| ---------------------------- | ----------- | ---------------------------------- | ------- | ------------------------------------------------------------------ |
| pineal-gland                 | FMA62033    | Pineal body                        | FJ1795  | `8438f756dc24c4aca4ea6db11a15a5bb33f2f5e4c12ba0a964175561a922d2a0` |
| habenula                     | FMA62032    | Habenula                           | FJ1743  | `ccb7f0eff4dba0ec780f0580830045e52f67915a65f15598ac53e7751fa6b663` |
| left-stria-medullaris        | FMA73414    | Left stria medullaris of thalamus  | FJ1777  | `25764b594e07c24c0f70c81aa401ea0f3fa6edd976e397c736d3f1672273a33c` |
| right-stria-medullaris       | FMA73413    | Right stria medullaris of thalamus | FJ1824  | `7fb9f6a8c3c6ac40ba152b1e2376e1715b61788d3fa72a2a1f059e8eba210282` |
| posterior-commissure         | FMA62072    | Posterior commissure               | FJ1799  | `416714570db67582c972814bc95784144b26df73163ff805be99ae687e8d8462` |
| left-thalamus                | FMA258716   | Left thalamus                      | FJ1782  | `5ec986cc2be7519115ac6e1dfc8679de7164d56dbbae32ded69d584cb3fddf63` |
| right-thalamus               | FMA258714   | Right thalamus                     | FJ1827  | `9b4d914f47a49a2c77a0bb99e84fa11494a1dba124120a5646e2615d38527756` |
| superior-colliculi           | FMA73423    | Left superior colliculus           | FJ1779  | `20fa477d93d095efe6995e420755e8d72ea494bf0928e7d3ad380d5a599fa55f` |
| superior-colliculi           | FMA73422    | Right superior colliculus          | FJ1826  | `76b599400e911f82360e5760e3c62663dc5335b4b67321583ce5846770847690` |
| inferior-colliculi           | FMA73435    | Left inferior colliculus           | FJ1762  | `70be6021611e7c6915b81766efc5af20756bfd6672bdeee06de335a7745f723a` |
| inferior-colliculi           | FMA73434    | Right inferior colliculus          | FJ1810  | `7d3edffaaa8fd68f3463b78cf918fe170f75bdce56a7f964790eb90a79045c5c` |
| third-ventricle              | FMA78454    | Third ventricle                    | FJ1730  | `e6b1afeb42e66e0d0ea61a455d400a56b97818d7b839c315817930a4105467b1` |
| cerebral-aqueduct            | FMA78467    | Cerebral aqueduct                  | FJ1738  | `09bce4c609f50506708e9a4ed3ab70f2fb4d4ea8de1ef92340fa8fa35ab31021` |
| right-internal-cerebral-vein | FMA51004    | Right internal cerebral vein       | FJ4690  | `c4e3fb792aba5eeef4ca47168665dd1df2ea1ce207607e9e4c3109af51068ed6` |
| great-cerebral-vein          | FMA50994    | Right great cerebral vein          | FJ4654  | `5995f3d7f9726596d3c06cc684e91da0ee61a2db36798333ef64d8970b73c5cb` |
| straight-sinus               | FMA50769    | Straight sinus                     | FJ4705  | `04bcac80a2cec50ff262706aa2e023c918248ed38729169eeb6ebfdd8ced80a7` |
| corpus-callosum              | FMA86464    | Corpus callosum                    | FJ1742  | `e7bed983960e969cf952245cc16cdd7a21b3c19705500f6c044a909a4fe28045` |
