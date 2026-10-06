# Millrace: Build guide

The quality bar and build checklist for the Millrace virtual store. Visual design, tokens and components live in [`DESIGN.md`](../DESIGN.md); "DESIGN.md §N" below refers to its sections.

## 1. Accessibility and performance

The bar the built site must meet before hand-off. Reasoning: [Accessibility and performance bar](https://github.com/danielluis07/millrace/issues/16).

### Accessibility target

**WCAG 2.2 AA**, plus two AAA criteria the design already meets: **2.3.3 Animation from Interactions** (the reduced-motion rules in DESIGN.md §5) and **2.5.5 Target Size (Enhanced)**, so every target is at least 44px. Contrast rules are in DESIGN.md §2.

- **Focus:** the `--ring` from DESIGN.md §6 everywhere. Sticky elements (header, buy panel, mobile order-summary bar) set `scroll-padding` so a focused element is never hidden beneath them (2.4.11).
- **Lookbook flow:** a labelled region (`aria-label="Lookbook, FW26"`) holding a list of 8 Looks. Each Look is a list item with a heading (`Look 03, Hollins Weir`), image alt text and a "Shop this Look" button. Tab moves through those buttons and scrolls each Look into view. Left and right arrow keys work while focus is inside the flow. A polite live region announces "Look 3 of 8" after prev or next. No autoplay, no ARIA carousel pattern. Caption text is in the DOM from the start and is never `aria-hidden` while its wipe hides it visually.
- **Overlays** (Look panel, cart drawer, support sheets, search overlay, lightbox): all are **modal dialogs** on base-ui defaults. Focus moves in and is trapped, Esc closes, focus returns to the trigger, the background is inert, and `aria-labelledby` points at a visible title. The Look panel's mobile bottom sheet is modal too: the Look stays visible but inert, and tapping it closes the sheet.
- **Status messages:** a polite live region carries Look panel quick add ("Added: Chore Coat, M") and cart count changes.
- **Search:** a search input followed by a plain list of result links, not a combobox. Tab moves into the results. A polite live region announces the count ("6 results") or the no-results line with its Category suggestions.
- **Checkout:** on submit, focus moves to the first invalid field. Fields carry `aria-invalid` and `aria-describedby` pointing at their `oxide` message. The browser bubble is replaced by the inline message (`setCustomValidity` plus an `invalid` handler). No error summary at the top. "Placing order…" is `role="status"`. The mobile summary bar is a disclosure button with `aria-expanded`. On Order confirmation, focus moves to the H1.

### Performance budget

Lab numbers from Lighthouse with default throttling, measured on the five key routes: Home, Lookbook, Collection, one Piece page and Checkout.

| Metric | Mobile | Desktop |
|---|---|---|
| LCP | ≤ 2.5s | ≤ 2.5s |
| CLS | ≤ 0.05 | ≤ 0.05 |
| TBT (stands in for INP) | ≤ 200ms | ≤ 200ms |
| Performance score | ≥ 90 | ≥ 95 |
| Accessibility score | 100 | 100 |
| Best Practices score | 100 | 100 |
| SEO score | ≥ 95 | ≥ 95 |

- **JS:** ≤ 180 KB compressed JS on initial load for any key route, as reported in Lighthouse's network data (Next 16 no longer prints First Load JS). No client dependencies beyond React, Next, base-ui and Zustand. Editorial sections stay Server Components.
- **Fonts:** three families via `next/font`, Latin subset, at most 4 files preloaded, `font-display: swap`.

### How it is checked

1. **Lighthouse CI:** a committed `lighthouserc.json` encodes the table above as assertions and runs against `next build && next start` on the five routes. It runs each route 3 times and takes the median, with separate mobile and desktop presets. Run it locally with `bunx @lhci/cli autorun`. Nothing is added to `package.json` and there is no CI workflow.
2. **Manual keyboard pass** against `docs/qa/accessibility-checklist.md` (written during the build). It covers every behaviour listed above: focus trap and return for each overlay, Lookbook arrows and announcements, Checkout first-invalid focus, visible focus everywhere, nothing hidden under sticky elements, 200% zoom, 320px reflow, and text over imagery checked by eye against the real image (if in doubt, scrim).
3. **Screen reader pass** with NVDA and Chrome on Windows over the signature path: Home → Lookbook → Look panel quick add → cart drawer → Checkout → Order confirmation. VoiceOver on iOS is optional.
4. **Twice for performance:** the Lighthouse run must pass at build hand-off with whatever images exist. It must then be **re-run once the priority imagery** (Hero frames, Look crops, first Colourway galleries) is in `public/images/`. The bar is met only on that second run.

Median scores and checklist results go in the hand-off PR description.

## 2. Build checklist for the downstream tickets

- [ ] Replace `app/globals.css` tokens per DESIGN.md §2; remove `.dark`; set `--radius: 0`.
- [ ] Replace `fonts/index.ts` with Newsreader, Archivo (`axes: ["wdth"]`) and IBM Plex Mono; wire `--font-serif`, `--font-sans`, `--font-mono`.
- [ ] Add motion tokens (DESIGN.md §5) as CSS variables and respect `prefers-reduced-motion` globally.
- [ ] Restyle shadcn primitives (Button, Sheet, Input, Checkbox, Badge) per DESIGN.md §6 before building pages.
- [ ] Add the wordmark as an inline SVG or text component and a monogram favicon.
- [ ] Use the marked placeholder component everywhere until Campaign imagery arrives.
- [ ] Define `--ring` (DESIGN.md §6) and switch control borders to `ink-muted` (DESIGN.md §2) while restyling primitives.
- [ ] Before hand-off: commit `lighthouserc.json` and `docs/qa/accessibility-checklist.md`, then run the checks in section 1; re-run Lighthouse once the priority imagery lands.
