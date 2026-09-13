# Paywall V2 — reference-preserving refinement

Reviewed on 13 September 2026 in the supervised cloud-browser preview.

- Four image edits use the user-supplied reference card crops. Their original
  composition is preserved; labels were removed and icon discs changed to clear
  peach glass. Native HTML supplies all titles and descriptions.
- Removed the detached generated hair/product cutouts and silhouette masks from
  V2's rendered cards. Removed duplicate CSS icon discs.
- Kept the reference card positions and the full-height responsive frame.
- Corrected the skincare title's unwanted wrap and removed the raster `JOUR.`
  remnant at the left edge of the portrait using a clean underlying photograph.
- Browser verified: all four images loaded; no page scroll overflow; annual and
  monthly selection; V1/V2 switching; CTA press state and simulated completion.
- Runtime checks verified: V1 preserved, native labels, selection semantics,
  duplicate activation guard, release timing, reduced motion and fitting math for
  393×852, 375×667, 320×568, 430×932 and landscape dimensions. These are mathematical
  fit checks; the direct cloud visual inspection used the 393×852 phone preview.

Known fidelity limit: imagegen re-rendered fine photographic and glyph detail;
these assets are not pixel-identical copies. All payment and review data in the
prototype remain explicitly illustrative.
