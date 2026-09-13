# Paywall V2 — independent high-resolution artwork

Seven individual built-in ImageGen calls produced separate original PNG masters. Exact prompts and dimensions are retained in `paywall-hq-originals/prompts.json` and `manifest.json`. Hero and silk: 1024×1536; crown, palette, hair, bun and care: 1254×1254 with real alpha. The app uses full-dimension WebP encodings (quality 96, alpha quality 100), with no upscaling or screenshot cropping.

All V2 screenshot fragments have been removed from the active stylesheet. Portrait is one photograph. The badge, CTA, discount, card rims and icon discs are native CSS materials; functional glyphs are SVG. All wording remains live text. V1 and offer/checkout handlers are preserved.

## Validation

- Cloud browser at the retained iPhone 16 preview: all six HTML images loaded at the expected original dimensions; silk is the background.
- Four native glass icon discs, no duplicated baked-in glyphs.
- No vertical page overflow, no clipped benefit or badge labels.
- Monthly and annual selection retain correct aria-pressed state and update the post-trial renewal note.
- `paywall-native-runtime.cjs`, `simplified-analysis-flow-runtime.cjs`, JS syntax and CSS parsing pass.
- An additional legacy `paywall-return-runtime.cjs` check is stale: it expects the old `subscribe` button/label and retired ANA-09 destination. This asset-only change does not alter those handlers; the legacy file was left unchanged. Current flow tests pass.
- Final reviewed screenshot: `paywall-hq-reviewed.jpg`.

The fan is decorative artwork, not the actual season palette or a measured color result. The generated mèche intentionally enters from the card upper edge. Payment, reviews and offers remain marked as illustrative in the mockup.
