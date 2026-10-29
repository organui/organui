---
"@workspace/registry": minor
---

The AI disclaimer follows the review through every decision: a review can carry the status ClinicianReview records, so content sent back or rejected says so, rather than reading as never reviewed. ClinicianReview draws an icon for each status, and no longer says "by unknown" when no reviewer is recorded.

The AI note lists only the records it cites, and marks claims without a source with a theme colour rather than a fixed amber. Clinical sources show each record's whole title with its kind and date beside it, rather than cutting it off. The differential list opens its evidence with the same chevron as the other disclosures and marks findings for and against with a plus and a minus.

The AI disclaimer, AI note, clinician review, differential list and clinical sources take every prop of their root element and mark it with `data-slot`; the clinical citation takes a `className` for its chip.
