# @workspace/registry

## 0.6.0

### Minor Changes

- 8cf84c9: `acute-angle-closure-glaucoma` shows the emergency on the eye: the forward lens and iris closing the drainage angle, the shallow anterior chamber and the waterlogged cornea, with the optic nerve under threat. Its stages run from the attack to laser iridotomy, or to a cupped, damaged nerve when treatment comes late, with eye pressure, acuity, gonioscopy and the visual field at each.
- f73f4f2: `acute-appendicitis` shows appendicitis on the appendix and its neighbours: early obstruction, suppuration with the psoas sign, and perforation inflaming the caecum, ileum and psoas. Each stage has the bloods, Alvarado score and imaging to expect, and the spared structures note the conditions that mimic it.
- dce7166: Diseases, a new family of components on the organ viewer. `disease-viewer` shows a condition as findings on organ models: the structures it affects or spares at each stage and scale, beside a panel with its ICD-10 code, course, findings and key investigations. Affected structures are amber and spared ones muted, so a disease of a whole organ still shows. Selecting a structure in 3D or in the panel shows what the disease does there.

  `autoimmune-hepatitis` is the first: on the whole liver and on a liver lobule, through active disease, fibrosis and cirrhosis. `liver-lobule` is a new component from an original CC0 schematic model: the central vein, hepatocyte plates in their three zones, the limiting plate, sinusoids with Kupffer cells, and a portal tract at each corner.

  The organ viewer repaints when its model's colours change. In the docs, the organ viewer, anatomy tree and disease viewer form a Building blocks group, with demos that show what they do for any model. Diseases have a gallery filtered by body system, linked from the header and the sidebar.

- 71c5b69: `benign-prostatic-hyperplasia` shows an enlarging prostate on two models: the prostate, where it narrows the urethra, and the bladder, which thickens to push past it. Its stages run from troublesome symptoms to chronic retention backing up into both ureters, or acute retention, with the IPSS, flow rate, residual volume, PSA and creatinine at each.
- 5b37022: Two more charts in clinical forms: a NEWS2 early warning score, scored from raw observations, as a radar of each parameter's points with the risk level, and medication adherence as the proportion of days covered against the 80% threshold. The heart-rate chart marks events on its timeline. Vaccine coverage now draws each ring on a 0–100% scale, where before the highest value filled its ring, and marks the 95% target.

  Six charts are redrawn in clinical forms under the same names: admissions against the range of the past three years, the outpatient did-not-attend rate against a target, ED visits seen within four hours against a target, blood donations against the population's ABO mix as two rings, length of stay for the top diagnoses against a benchmark as a dumbbell chart, and a month of doses as a ring, each dose on time, late or missed.

- ce6b1e9: `ectopic-pregnancy` shows a tubal ectopic pregnancy on the uterus and tubes: the embryo in the ampulla with an empty uterine cavity, then rupture, with the mesosalpinx bleeding into the pelvis. Each stage has the hCG, transvaginal scan and observations to expect.
- 70632f4: `gallstone-disease` shows gallstones on the biliary tree, where the place a stone lodges decides the illness: biliary colic in the cystic duct, cholecystitis with Murphy's sign, cholangitis when the common duct blocks and the liver backs up, and pancreatitis at the ampulla. Each stage has the bloods, cultures and imaging to expect.
- 769d377: `graves-disease` shows Graves' disease on two organs: the thyroid, with a diffuse goitre and increased blood flow, and the eye, where the extraocular muscles swell in thyroid eye disease. Its stages run from thyrotoxicosis through active eye disease to burnt-out fibrosis, with thyroid function, TSH receptor antibodies, the clinical activity score and exophthalmometry at each.
- d2d782b: `hodgkin-lymphoma` shows nodular sclerosis Hodgkin lymphoma on a lymph node: collagen bands from a thickened capsule, effaced follicles, and Reed–Sternberg cells in the paracortex, with the lymphatics that carry it to the next node group. Its stages are active disease and remission after treatment, with biopsy, PET-CT and bloods at each.
- 6ce6f92: `ischaemic-stroke` shows a left middle cerebral artery stroke on the brain, opening on its left side: the frontal, parietal and temporal lobes it supplies, with the weakness, aphasia and field loss each explains. Its stages run from the hyperacute treatment window through swelling of the ventricle to a healed cavity, with the NIHSS, scans and ECG at each.
- 70df8cc: `kidney-stones` shows a stone in the left kidney on the kidneys and ureters, opening on the posterior view: silent in the kidney, then renal colic as it lodges at the vesicoureteric junction and the kidney behind it swells, then the emergency of an infected obstructed kidney. Each stage has the urine, CT KUB and bloods to expect.
- 1962b25: `lobar-pneumonia` shows pneumonia of the right lower lobe on the lungs. Its four segments consolidate through congestion, red and grey hepatisation and resolution; the spared middle lobe explains the silhouette sign and the open airways the air bronchograms. Each stage has the observations, bloods and chest X-ray to expect, and the CURB-65 score.
- 51cf630: `melanoma` shows melanoma on a section of skin, staged by depth: in situ in the epidermis, then thin, thick and metastatic as it invades the papillary dermis, the reticular dermis and finally the fat and veins. Each stage has its Breslow thickness, ulceration, sentinel node result or scans, and its stage.
- 8edd28e: `myocardial-infarction` shows an anterior ST-elevation infarction on the heart: the blocked left anterior descending artery, the anterior wall and septum it supplies, and the left ventricle. Its stages run from occlusion through the acute phase to a healed scar, each with the ECG, troponin and echo findings to expect.
- d12541b: `peptic-ulcer-disease` shows a gastric ulcer on the stomach's lesser curve and its two deadly complications: bleeding from the left gastric artery behind it, and perforation through the wall. Each stage has the tests to expect, from H. pylori and biopsy to the Glasgow-Blatchford score and an erect chest X-ray.
- c15cb67: `pituitary-adenoma` shows a non-functioning adenoma on the pituitary and its surroundings: incidental while small, then a macroadenoma pressing on the optic chiasm (bitemporal hemianopia) and the stalk (raised prolactin), and apoplexy reaching the cavernous sinus. Each stage has the visual fields, MRI and pituitary hormones to expect.
- e28f495: The organ viewer, molecule viewer and DNA helix fade what is not selected towards the stage's own colour, read from the theme, so faded parts recede in dark mode rather than turning pale, and they repaint when the theme changes. The organ viewer and DNA helix are 28rem tall by default, as the molecule and image viewers are.

  The molecule viewer shows shadcn's spinner while a structure loads, and now installs it, and offers Try again after a WebGL failure whatever the source. It no longer suggests checking the connection for a structure passed as text, and the organ viewer no longer suggests it for a model that lacks its structures. Status lines use the same text size in every viewer. The three viewers take every prop of their root element and mark it with `data-slot`.

- 9713072: The AI disclaimer follows the review through every decision: a review can carry the status ClinicianReview records, so content sent back or rejected says so, rather than reading as never reviewed. ClinicianReview draws an icon for each status, and no longer says "by unknown" when no reviewer is recorded.

  The AI note lists only the records it cites, and marks claims without a source with a theme colour rather than a fixed amber. Clinical sources show each record's whole title with its kind and date beside it, rather than cutting it off. The differential list opens its evidence with the same chevron as the other disclosures and marks findings for and against with a plus and a minus.

  The AI disclaimer, AI note, clinician review, differential list and clinical sources take every prop of their root element and mark it with `data-slot`; the clinical citation takes a `className` for its chip.

- 5d3e63d: Patient charts read more like the record. Oxygen, glucose and insulin tooltips say when each reading was taken, and heart rate, HbA1c, glucose and census draw monotone lines, which never pass beyond the values measured. HbA1c keeps the year on its axis, and insulin's tooltip names the day. Target badges say "At target", "Above target" or "Below target" throughout, and directional footers carry a trend icon. Every footer that shows fictional data says so.

  Medication adherence draws its 80% threshold dashed and muted, as vaccine coverage does. Lab turnaround labels its axis in minutes and its readout over the last 30 days, with the 90% goal in its badge. Hazard ratios keep two decimals. Vaccinations and bed occupancy have legends. Several labels are clinically clearer: the lab panel, the ED four-hour standard (admitted, transferred or discharged), "Lack of appetite" among the symptoms, "Pain relief" on the outcomes radar, and the period and unit on census, blood pressure and vaccinations.

  The dashboard block's noon ibuprofen dose is no longer labelled as needed.

- 9ee4103: The clinical readouts follow shadcn's component pattern: vital signs, the lab results table, the ECG trace, the medication schedule and the growth chart take every prop of their root element, such as `id` and `aria-*`, and mark it with `data-slot`.

  Vital signs keep red for nothing but critical values, as the lab results table does: a high or low reading is bold with an arrow, and the readings sit two to a row, or all in one row when they fit. The medication schedule draws an icon for each interaction's severity and colours separation warnings by it, labels its timeline on the gridlines so the hours never overlap, and lays out by its own width rather than the screen's. The ECG calibration pulse is 0.2 s wide at any paper speed. The growth chart fits narrow screens before it measures itself and says when a measurement falls outside the standard. An empty lab results table says so.

- b557129: The anatomy tree, body map, dermatome map and image viewer take every prop of their root element, such as `id` and `aria-*`, and mark it with `data-slot`, as the clinical readouts do.

  The anatomy tree expands with a chevron, as shadcn's sidebar does, rather than a plus or minus sign. A hovered row is lighter than the selected one, and each row's visibility is a quiet button that adds an eye icon once the tree has room for it. The dermatome map titles each figure above it, as the body map does. The body map names the region under keyboard focus, not only the one under the pointer.

- 5070063: Charts read like shadcn's: each card ends with a headline and a muted line of context, with a trend icon where the data has a trend. Three full-width charts open the area, bar and line pages: ED arrivals as daily counts with a 7-day average, a surge threshold and events; lab turnaround for urgent bloods against a 60-minute target; and resting heart rate through cardiac rehab, with its milestones. Nine tooltip charts show each way to configure shadcn's chart tooltip, on a week of basal and bolus insulin doses.

  Patient charts read like a monitor: heart rate, oxygen, glucose, HbA1c, blood pressure and insulin show the latest value and unit in the header, with a status badge, and heart rate and glucose shade their reference range, HbA1c and blood pressure draw their targets, and census draws its staffed beds. These charts now install shadcn's badge.

  Six charts in forms clinicians and researchers read: an ambulatory glucose profile with percentile bands, 24-hour blood pressure as range bars with the overnight dip, continuous glucose monitor time in range, a lab panel with each result on its reference range and high and low flags, a Kaplan–Meier survival curve with censoring and numbers at risk, and a forest plot of hazard ratios.

- 5f07c05: More items build on shadcn's own parts. ClinicianReview shows its status as a Badge with an icon beside the title, as lab results and the charts show theirs, and now installs shadcn's badge. The differential list opens its evidence with Trace's collapsible, the same disclosure as the clinical sources, and installs trace instead of collapsible. The dermatome map's level chips are styled as shadcn's outline Toggle, keeping their listbox keyboard behaviour, and it installs toggle. An empty lab results table is as tall as shadcn's data table's empty row.

### Patch Changes

- 1119769: Organ viewers show the model credit behind a small info button in the corner, instead of a line of text under the model. The credit and licence link open in a popover. The organ viewer now installs shadcn's popover.
- a5c28ff: The dashboard-01 block's page provides its `<main>` landmark, as the explorer blocks' pages do, so `PatientDashboard` also fits inside an app layout that already has one.

## 0.5.0

### Minor Changes

- 7461b36: Every item installs on shadcn's Radix styles as well as Base UI: a `{style}`
  registry URL (`https://organui.com/r/styles/{style}/{name}.json`) serves
  Radix projects a Radix build, with Radix copies of the anatomy tree, the
  organ, molecule and image viewers, the DNA helix and the blocks' components.

  New items:

  - AI Elements, built on shadcn's components: AI disclaimer, clinical
    citation (Hover Card and Button), clinical sources (Trace), differential
    list and clinician review (Item), and AI note.
  - Helpers: age, z-scores, reference ranges, clinical units and body
    measurements. The growth chart and lab results table now install the
    ones they use.
  - Utilities: one item adds the heartbeat, ECG grid and severity classes to
    the CSS file, as shadcn's utilities come together.

  Blocks: Dashboard 01, one patient at a glance with vital signs, a live ECG,
  lab results and the day's medicines.

  Charts: 21 charts of health data (area, bar, line, pie, radar and radial)
  built on shadcn's chart and card, each installable like shadcn's charts.

  Every component documents each prop with a doc comment, which the docs
  show as its API Reference.

  Blocks carry the height /blocks frames them at, in `meta.iframeHeight`.
