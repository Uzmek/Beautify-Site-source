# Paywall V2 detail assets

The three WebP photographs were made using the built-in image generation tool.
The exact prompts are retained in `scripts/paywall-detail-prompts.json`.
They are rendered through separate SVG silhouette crops, because the original
generated PNGs contained an opaque preview matte instead of native transparency.
Keep these masks and the image dimensions paired. UI text is never in these assets.

The palette and copper badge caps come from the user's supplied detail references.
The copper left cap includes the decorative crown only. The offer label remains
live DOM text. `scripts/prepare-paywall-detail-assets.cjs` records the source crops.
