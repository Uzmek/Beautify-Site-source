# Hair model catalogue

48 generated editorial portraits: four fictional adult models, with the same twelve named cuts. These are catalogue references, not transformations of a customer's uploaded photo. Model choice never changes hair scoring or consumes trial credits.

Generated with the built-in imagegen tool. Each model's lob-soft portrait anchors eleven identity-preserving hairstyle edits. Original images were reviewed individually, then encoded as WebP for delivery without cropping or retouching. Sources: 1254 × 1254. Runtime assets: `dist/assets/hair-models/<model>/<cut>.webp`.

## Shared prompt

Photoreal premium salon catalogue portrait, front-facing adult woman aged around28, direct camera gaze, level shoulders, warm slight smile, natural skin texture and subtle makeup. Simple ivory crewneck top, no jewelry, seamless pale blush/ivory studio background. Dark espresso hair. Preserve face, pose, outfit, lighting, background and framing across variants; change only hairstyle. Include the entire hairstyle, with space above the head and long ends visible. No text or watermark.

## Fictional models

- Amina: Black West African woman, deep brown skin, brown eyes.
- Mei: East Asian woman, light medium warm skin, brown eyes.
- Leïla: North African woman, medium olive skin, brown eyes.
- Clara: European woman, fair peach skin, faint freckles, hazel eyes.

The identity descriptions are generation briefs, not classifications inferred from user photos. The UI uses portraits and first names for selection.

## Hair variations for every model

| ID | Prompt specification |
| --- | --- |
| lob-soft | Collarbone long bob, soft loose bend, minimal layers, no bangs |
| bob | Chin-length blunt sleek straight bob, center part, no bangs |
| cascade | Long chest-length graduated layers, softly face framing, no bangs |
| curly-shag | Shoulder-length curly shag, distinct ringlets, layers, light curly fringe |
| pixie-soft | Very short tapered sides, longer textured swept top, no blunt fringe |
| butterfly | Long chest-length bouncy butterfly layers, pronounced cheekbone curtain layers |
| crop-soft | Short textured crop, soft short forward fringe, distinct from swept pixie |
| rounded-curls | Rounded shoulder-length dense tight curls, balanced silhouette |
| long-waves | Long chest-length full gentle S waves, minimal layers, no fringe |
| french-bob | Short jaw-length bob with eyebrow fringe |
| shag-soft | Shoulder-length wavy shag layers, blended curtain fringe |
| sleek-long | Chest-length straight sleek hair, center part, blunt full ends, no bangs |

Use contain fitting for full catalogue photos: some long ends approach the image edge. Only selector avatars use a circular close crop. Saved reference previews snapshot their chosen model; older hair-only previews retain their original artwork. Real try-on rendering is still not connected in this prototype.

## Editorial revision 2

Current catalogue assets: `dist/assets/hair-models-v2/<model>/<cut>.webp`. Four new fictional luxury beauty campaign models replace crewneck portraits with ivory satin styling, frontal head/neck/upper torso and genuine transparent backgrounds. Built-in imagegen generated a complete carousel UI reference and new identity anchors. Remaining cuts use the shared cut specifications above, with identity-preserving edits and background extraction through the built-in generator when an edit baked in a checkerboard. Every final asset must pass RGBA/alpha validation before conversion to WebP.

Shared revised brief: striking adult luxury beauty supermodel aged 27, refined expressive face, luminous natural skin texture, tasteful soft glam makeup, confident slight smile, straight front-facing shoulders and gaze, elegant neck, modest ivory satin sleeveless top, dark espresso hairstyle; complete hair outline and ends within canvas; transparent background, no backdrop rectangle, mannequin, props, jewelry, letters or watermarks. Preserve face, pose, lighting and outfit for hairstyle edits.

Successful background-extraction prompt: “Remove the entire background from this portrait. Deliver a transparent PNG cutout with actual alpha transparency. Preserve woman and hair exactly. Background extraction only.”

The interface reproduces the generated reference with native text, copper segmented length controls, circular model selectors, a continuous pearl card and integrated caption. CSS uses contain fitting plus a subtle garment-edge fade; the source hairstyle is not cropped. Saved previews snapshot `previewArt: 2`; earlier previews without this field retain their original version1 references.

Alternate successful extraction prompt: “Use case: background-extraction. Create a transparent PNG cutout of this woman. Preserve the woman. Remove everything surrounding her. Transparent background.” Framing varies slightly after extraction; top clearance can be1–3%, long ends90–95% of canvas height. CSS adds headroom and keeps the complete portrait contained; only the final4% garment edge fades.
