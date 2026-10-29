---
"@workspace/registry": minor
---

More components are built from shadcn's parts. The medication schedule lists doses as an Item, joins its day arrows in a ButtonGroup, shows read-only dose status as a Badge and warns of major interactions in a destructive Alert. The scan viewer's window and pan tools are one ToggleGroup, and the dermatome map's selection panel is an Item. The molecule viewer shows its status and PDB link behind an info button, in a Popover, and now installs it. The molecule viewer and DNA helix announce their summary to screen readers.

The patient banner lays its details out in labelled columns, on two lines when it is wide. The allergy list no longer strikes through resolved allergies. The NEWS2 chart boxes only a score of 3, shows each day once, gives every column the same width and keeps its sticky column the colour of the surface it sits on. Vital signs drop the box around each reading. The ECG trace labels only QRS when the P and T labels would run into each other. The DNA helix draws each base in its strands as one tinted tile. The dermatome map takes each region's colour from `--dermatome-cervical`, `--dermatome-thoracic`, `--dermatome-lumbar` and `--dermatome-sacral`, so themes can set them. The clinician review never clips who reviewed and when. `ClinicalCitationProps` is exported.
