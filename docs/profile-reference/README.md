# Profile visual implementation

Reference: supplied portrait, 852 × 1846. QA viewport: iPhone 16, 393 × 852 CSS pixels. Integrated local browser used; no cloud browser was available. Nothing published.

## Composition

| Block | Reference coordinates | Implementation at 393 px |
| --- | --- | --- |
| Heading | x64, y~200, large dark serif | x29.5, 45.7 px DM Serif Display |
| Account card | x40, y376, 772 × 220 | x18.4, y173.4, 356.1 × 101.5 |
| Plus card | x40, y624, 772 × 379 | x18.4, y286.9, 356.1 × 174.8 |
| Photos | x40, y1023, 772 × 209 | x18.4, y470.9, 356.1 × 96.4 |
| Help | x40, y1250, 772 × 206 | x18.4, y575.6, 356.1 × 95 |
| Glass | White outer/inset rims, blush transparent fill | Native borders, pseudo-elements, gradients, blur and shadows |

The shared bottom navigation remains unchanged, as requested. The user additionally supplied close-up references for Invité, Sans compte and Actif; the pills were refined with separate copper assets and native glass/green-orb styling. Labels remain HTML. The exact reference wording was explicitly confirmed; PRF-02 retains the separate account/synchronization flow.

All subscription states now share the raised glass pill and orb treatment: copper discovery, amber renewal-off/pending, soft rose unconfirmed activation, and muted copper expired/unknown. Only active remains green. Long labels wrap naturally, including at 320 px; icons are decorative native SVG and the underlying entitlement state is unchanged.

## Verification

- Side-by-side inspection at 393 × 852 and 200% zoom, followed by spacing/font/contour corrections.
- All profile entry controls clicked in the live app: account, both subscription links, photos, help, all four information links, return buttons, and shared navigation.
- Small-screen scrolling checked at 320 × 568; no horizontal overflow. The bottom information links remain reachable.
- Subscription state remains real: active, cancelled, free, pending, failed and expired checked in the runtime. Active/cancelled/pending visual fixtures do not modify browser data.
- Native labels, escaped names, connected/guest state, missing images, badge text fit and route returns checked.
- Passing suites: `profile-reference-runtime`, `profile-information-runtime`, `account-flow-runtime`, `branding-runtime` (156 views), `history-v2-runtime`. `git diff --check` clean.

## Review artifacts

- `iphone16-active-final.png`: native view with the active subscription fixture.
- `iphone16-live-final.png`: live application with its actual subscription state.
- `comparison-393.png` and `comparison-zoom.png`: reference comparison.
- `compare.html`: side-by-side review; `#zoom` followed by reload enables 200%.
- `assets.md` and `badge-prompts.md`: built-in ImageGen prompts and saved asset paths.

Rebuild the read-only active fixture with `node scripts/profile-reference-preview.cjs`; optional first argument selects the subscription state. Fixtures use production HTML/CSS without application scripts or browser-state writes.
