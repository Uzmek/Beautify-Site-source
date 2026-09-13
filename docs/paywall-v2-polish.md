# Paywall V2 — visual polish

V1 is unchanged. The mockup defaults to developer mode, with only the V1/V2 switch on the paywall. All headings, offer prices, review text, legal links and controls in V2 are real DOM content.

## Artwork

- Source: `dist/assets/paywall-decor-v2.png` (existing generated decorative atlas).
- New selected asset: `dist/assets/paywall-isolated-v2.png`.
- Generated with the built-in image generation tool, not the CLI/API fallback.
- The selected RGB white-matte atlas uses CSS multiply compositing over native glass cards. An unsuccessful transparency attempt was discarded and is not shipped.
- Palette and hair-wave pictograms are native, decorative SVGs defined in `pv2Icon`.

Final image prompt:

> Production asset edit. Keep original canvas 852x1846, and keep exactly the original positions, scale, identity and colors of all photographic subjects: woman top right, swatch fan at x480 y680, brown hair wave at x40 y920, brunette updo at x305 y935, cosmetics at x555 y950. Replace every part of the silky/ribbon background with perfectly SOLID PURE WHITE RGB255,255,255, no gradients, no satin, no texture, no checkerboard, no transparency. Objects isolated on a white product photography seamless background. Do not add shadows behind objects. Preserve natural hair edge details, fan colors and bottle specular reflections. No text, no labels, no cards, no icons. Do not rearrange or enlarge subjects. Bottom below y1190 is empty PURE WHITE. This is a source atlas for CSS multiply compositing.

## Interaction and validation

- Offer selection updates the existing DOM: filling, border and radio transitions do not restart the screen.
- The discount badge has two subtle movement/highlight cycles; reduced-motion preferences disable animations and transitions.
- The CTA completes its short press/release before simulated subscription navigation; duplicate presses are guarded.
- Browser QA in the cloud used the 393 × 852 phone frame: annual/monthly selection, persistence while switching V1/V2, and successful simulated CTA navigation to Home.
- `node tests/paywall-native-runtime.cjs` and `node tests/simplified-analysis-flow-runtime.cjs` pass; JavaScript syntax, CSS parsing and Git whitespace checks pass.
- Review numbers, savings, trial and payment copy remain explicitly illustrative mockup content, not verified commercial claims.

The reference is a still image; motion is an interpretation of its lighting, not a claim to reproduce an unseen source animation frame-for-frame. Local display typography is used, so this is not asserted to be a pixel-identical rendering on every device.
