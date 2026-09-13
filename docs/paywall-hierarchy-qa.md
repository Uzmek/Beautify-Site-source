# Paywall V2 — hierarchy and mobile layout

The user authorized a complete hierarchy/layout refinement after restoration of
the original copper badge. V1, the development switch, current routes and all
approved photographic assets are preserved.

## Changes

- A quieter brand header and a full-width compact testimonial separate the
  promise from the included benefits.
- The three benefit cards have identical widths, aligned two-line titles and
  larger labels. All text remains native HTML.
- The annual billed amount is the most prominent price. Its approximate monthly
  equivalent and the discount are subordinate. The inconsistent struck-through
  price is removed; the annual/monthly prices and three-day trial are unchanged.
- Each plan has one consistent selection indicator and the whole card is tappable.
- The primary action is taller and bolder. Renewal text immediately below follows
  the selected plan without replacing the DOM or interrupting its transitions.
- Trust copy and legal/restoration actions are compact and visually secondary.
- Original crown/end-cap artwork remains, with a blank source texture and feathered
  joins in the center. The corrected 44px close target remains unchanged.

Pricing hierarchy reference: [Apple, Clearly describing subscriptions](https://developer.apple.com/app-store/subscriptions/#clearly-describing-subscriptions).
No conversion uplift is asserted: this is a visual/interaction refinement, not
the result of a live conversion experiment.

## Validation

Cloud preview on the existing 393×852 phone: images loaded, no page overflow,
benefit text fits, both offer selections work, renewal price follows selection.
Existing runtime checks pass for V1 preservation, prices, offer state, duplicate
activation guard, release/reduced-motion behavior and reference-frame fitting.
The simplified analysis-flow checks also pass. CSS parsing and JS syntax pass.
