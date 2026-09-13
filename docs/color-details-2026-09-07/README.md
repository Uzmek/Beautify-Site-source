# Color advice presentation — 7 September 2026

This update formats the existing color advice without changing the saved season,
palette HEX values, analysis flow, entitlement checks or navigation.

- Clothes: aligned 12-shade grid, fixed sample heights and a separate five-neutral
  panel. Two-line names no longer shrink their sample. White and pale shades have
  a visible edge without recoloring the sample.
- Hair: four illustrated shade cards, two compact alternatives to moderate, and a
  framed explanation. CSS textures are explicitly illustrative, not dye formulas.
- Alternatives: three paired color comparisons, with the existing explanation
  attached to each pair.
- Jewelry: individual metal labels in the preview and material cards in the sheet.
- Makeup: preview and sheet use the same complete shade list; Deep Winter includes
  Rose glacé. Bordeaux names are recognized so Deep Autumn is no longer empty.

## Verification

- 82 runtime checks pass, including all 12 saved-season palettes and matching
  makeup preview/detail lists. Each season has at least one makeup shade.
- Source/model review passes for 725 view/state combinations.
- Internal browser at logical iPhone 16 size (393 × 852): clothes, hair and color
  alternatives fit their sheet without overflow (692, 666 and 648 px high).
  Applications remains 507 × 361 px with no overflow.
- All 12 clothes samples have an identical 40 px logical height. White opens with
  the original `#F7F7F5` value; return restores the clothes sheet, then the report.
- Screenshots 01–06 show clothes, hair, alternatives, Applications, jewelry and
  makeup respectively. No hover enlargement or lighting effect was added.

Browser coverage uses the saved Deep Winter example. Runtime tests cover all
12 seasons; this is not a claim of browser screenshots for every season.
