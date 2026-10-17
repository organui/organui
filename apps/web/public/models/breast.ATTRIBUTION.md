# Breast model attribution

`breast.glb` is adapted from two HuBMAP Human Reference Atlas (HRA) 3D reference organs:

- **3D Reference Organ for Breast (mammary gland), Female left, v1.0** ([doi:10.48539/HBM378.VWZG.633](https://doi.org/10.48539/HBM378.VWZG.633)), source file `VH_Female/v1.3/VH_F_mammary_gland_L.glb`.
- **3D Reference Organ for Breast (mammary gland), Female right, v1.0** ([doi:10.48539/HBM989.SNHP.535](https://doi.org/10.48539/HBM989.SNHP.535)), source file `VH_Female/v1.3/VH_F_mammary_gland_R.glb`.

Creator: Heidi Schlehlein. Project lead: Katy Börner. Reviewer: Harikrishna Nakshatri. Publisher: HuBMAP. Funder: National Institutes of Health (award OT2OD026671). Per its release page, the breast was sculpted from scratch with reference to _Human Microscopic Anatomy_ (R.V. Krstić, 1994) and _Atlas of Anatomy_ (Thieme, 2008), so it is illustrative anatomy rather than a scan of one person.

- Model/data license: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) ([legal code](https://creativecommons.org/licenses/by/4.0/legalcode)), as stated on the release pages and in the library's `LICENSE` file.
- Source library: [hubmapconsortium/ccf-3d-reference-object-library](https://github.com/hubmapconsortium/ccf-3d-reference-object-library) at commit `f1a3a63f110e27ff0736047d52d04dba5d3087f9`. SHA-256 of the source files are pinned in [`scripts/models/breast.inputs.json`](../../../../scripts/models/breast.inputs.json).
- Node names and ontology terms: the ASCT+B to 3D crosswalk ([doi:10.48539/HBM595.JNGT.446](https://doi.org/10.48539/HBM595.JNGT.446)) from [hubmapconsortium/ccf-releases](https://github.com/hubmapconsortium/ccf-releases) at commit `b036a91aaf7234f462b1249d4a5f4fb0e982f412`.
- Retrieved: 2026-10-17.
- How to cite: Heidi Schlehlein. 2022. _3D Reference Organ for Breast (mammary gland), Female left, v1.0._ https://doi.org/10.48539/HBM378.VWZG.633, and _Female right, v1.0_, https://doi.org/10.48539/HBM989.SNHP.535. Library: Heidi Schlehlein, Bruce W. Herr II, Ellen Quardokus, Andreas Bueckle, Katy Börner. 2022. _HuBMAP CCF 3D Reference Object Library_. https://humanatlas.io/3d-reference-library.

Changes by OrganUI (2026), made by [`scripts/models/breast.ts`](../../../../scripts/models/breast.ts): used all 8 named mesh nodes of each breast as 16 structures, combined both breasts into one GLB, recentered and uniformly scaled the coordinates (16 units per metre), simplified the meshes from about 856,000 to about 121,000 triangles with meshoptimizer, recomputed smooth normals, and assigned illustrative colours. No anatomy was added.

`breast.glb` and screenshots of it are adaptations distributed under CC BY 4.0. The MIT license for OrganUI code does not relicense them. Keep this attribution, the license link and the modification notice when redistributing. Neither HuBMAP, the NIH nor the creators endorse OrganUI.
