# Direct photo entry — 7 September 2026

The three promotional introduction screens are retired. Choosing Hair, Color or
Skin now opens camera/gallery capture. Starting a new analysis from a report
keeps its domain; Back returns to that report and restores the selected section.
Starting from the general analysis picker returns to that picker.

- Legacy `ANA-03` links and history entries resolve to `ANA-04`. The review menu
  no longer lists the introduction as a step.
- Entry itself does not mark the photo intent as accepted. Selecting a valid
  photo, or explicitly resuming analysis with an existing photo, starts the demo.
  Cancellation, invalid files and stale callbacks cannot accept or start it.
- The capture screen explains that selecting a photo starts the illustrative
  preview. No real analysis service or payment was added.
- Existing draft protection, interrupted-analysis resume, paywall timing and
  continuation after purchase remain in place.

Verification: 83 runtime checks pass; 11 payment continuation checks pass;
725 source/model view-state checks pass. Browser checks on logical 393 × 852
cover direct capture for all three domains, report-section restoration,
return to the analysis picker, and a legacy introduction URL resolving to photo
capture. Screenshots show the three capture screens after the removed step.

This change includes the color-detail presentation documented in
`../color-details-2026-09-07/README.md`.
