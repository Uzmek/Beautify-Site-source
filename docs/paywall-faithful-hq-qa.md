# Restore the approved paywall appearance with high-resolution artwork

Design baseline: V140 (`a72c859`), before the rejected independent-object redesign. Preserve its layout, font sizes, image framing, card glass treatment, copper finishes, offer logic and close button. V1 is unchanged.

## Asset strategy

The four approved card edits already had high-resolution PNG masters. These are recovered and exported at native crop dimensions rather than downsampled to ~480 px: hair 1218×1160, bun 1188×1185, care 1200×1160, palette 2118×662. They preserve the approved photo composition and glass glyphs. All titles and other text remain live DOM.

Portrait and satin are reference-guided enhancements of the original images, not new subjects. Their actual generated sizes are 1370×1148 and 1441×1092; no artificial upscaling. Button material and the simple crown follow their original reference geometry. Exact prompts and original PNG masters are retained alongside the encoded app assets.

## Validation

Final screenshot is compared visually with `paywall-harmonized-reviewed.jpg`. The page remains single-screen in the iPhone 16 preview. Offer selection, renewal note, V1 preservation and purchase activation guards are covered by the existing native paywall and simplified flow checks.

Fine image details are generated enhancements and are not asserted to be pixel-identical. The design composition and interactive behavior are preserved.

The generator returned opaque checkerboard outside the three button/crown shapes even after one background-extraction request. These are not represented as alpha masters. Native rounded-button clipping and an explicit SVG silhouette mask remove the external background in the interface; the generated material pixels remain unchanged. The masters and manifest record actual RGB encoding.
