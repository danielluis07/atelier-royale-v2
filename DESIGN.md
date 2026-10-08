# Millrace: Design

The design system, brand mark and tone of voice for the Millrace virtual store. It assembles decisions already closed on the map ([Brand positioning](https://github.com/danielluis07/millrace/issues/2), [Design direction](https://github.com/danielluis07/millrace/issues/4), [Design direction prototype](https://github.com/danielluis07/millrace/issues/10), [Experience blueprint](https://github.com/danielluis07/millrace/issues/5)) and fixes the things those tickets left to this file: final hexes, font families, the brand mark, the place and the voice. Vocabulary follows `GLOSSARY.md`.

Out of scope here: the actual product copy (separate work). The accessibility and performance bar and the build checklist live in [`docs/build-guide.md`](docs/build-guide.md). Motion choreography is summarised in section 5; the full detail lives in [Motion choreography](https://github.com/danielluis07/millrace/issues/15).

## 1. Principles

**North star: exacting, unhurried, honest.**

- **Elevated workwear.** Rugged goods, presented with an editorial house's restraint. That tension is the point of view.
- **Two modes, one system.** The **Editorial layer** (Home, Lookbook, campaign, 404) is spacious, asymmetric, full-bleed and sparse. The **Storefront** (Collection, Piece, Cart, Checkout) follows **spec-sheet discipline**: strict grid, hairline rules, numbered Pieces, mono captions. Both share one palette, one type system and one motion language.
- **Proof is a design feature.** Fabric and weight, construction, origin and repair are laid out like a technical drawing or mill ledger, never in accordions or fine print.
- **Colour comes from photography.** The interface is paper, ink and a little indigo. Nothing decorative competes with the images.
- **Almost nothing moves.** What does move is weighted and mechanical.
- **Desktop and mobile are equal-quality.** Desktop leads the "wow"; neither is an afterthought.

## 2. Colour

Paper, ink and one accent. No site-wide dark theme; dark appears only as full-bleed campaign sections in deep indigo.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FCFBF9` | Base background. Near-white with a slight warmth |
| `stone` | `#F3F1EC` | Secondary surfaces, drawers, sheets, the still-life backdrop |
| `ink` | `#1D1B18` | Text, primary buttons, rules at full strength |
| `ink-muted` | `#6B665E` | Captions, secondary text, disabled-adjacent labels |
| `hairline` | `ink` at 14% (`rgb(29 27 24 / 0.14)`) | All rules, borders, grid lines |
| `indigo` | `#263766` | The one accent: links on hover, selected states, the stamp, the millrace "flow" |
| `indigo-deep` | `#17213F` | Dark campaign sections only |
| `indigo-wash` | `#B9C3E3` | Text on `indigo-deep`, indigo tints on paper at low use |
| `oxide` | `#9A3B26` | Errors and validation only. Never decorative |

Rules:

- Indigo is **sparing**: at most one or two indigo moments per screen. If everything is indigo, nothing is.
- Sold-out and disabled states use `ink-muted` with a hairline strike or border, not red.
- Contrast (WCAG, measured): `ink` on `paper` 16.6:1; `ink-muted` on `paper` 5.5:1 and on `stone` 5.1:1; `indigo` on `paper` 11.2:1; `paper` on `indigo-deep` 15.3:1; `indigo-wash` on `indigo-deep` 9.0:1; `oxide` on `paper` 6.7:1. Do not use anything lighter than `ink-muted` for text.
- Non-text contrast (WCAG 1.4.11, measured): `hairline` is 1.33:1 on `paper` and `stone`, so **`hairline` is never the only boundary of an interactive control**. Field, checkbox, chip, stepper and unselected size-cell borders use `ink-muted` (5.5:1 on `paper`, 5.1:1 on `stone`). Rules, grid lines, ledger lines and swatch edges stay `hairline` (a swatch is identified by its fill). Focus ring: `indigo` is 11.2:1 on `paper` and 10.2:1 on `stone`, but 1.37:1 on `indigo-deep`, so dark sections switch it to `indigo-wash` (9.0:1).
- Photography is graded muted and film-like; the UI must never tint images (no overlays except a plain 0.4 black scrim behind text on a full-bleed hero, and only when the image needs it).

### Token mapping (shadcn / Tailwind 4)

The project's `app/globals.css` ships neutral shadcn defaults. Replace them; delete the `.dark` block.

| shadcn variable | Value |
|---|---|
| `--background` | `paper` |
| `--foreground` | `ink` |
| `--card`, `--popover` | `paper` |
| `--card-foreground`, `--popover-foreground` | `ink` |
| `--primary` / `--primary-foreground` | `ink` / `paper` |
| `--secondary`, `--muted`, `--accent` | `stone` |
| `--secondary-foreground`, `--accent-foreground` | `ink` |
| `--muted-foreground` | `ink-muted` |
| `--border`, `--input` | `hairline` |
| `--ring` | `indigo` |
| `--destructive` | `oxide` |
| `--radius` | `0` |

Add `--color-indigo`, `--color-indigo-deep`, `--color-indigo-wash`, `--color-stone`, `--color-ink-muted` and `--color-hairline` to `@theme inline` so utilities like `bg-indigo-deep` exist. Drop the `--chart-*` and `--sidebar-*` variables unless a component needs them.

## 3. Typography

Three voices, all open fonts, loaded through `next/font/google` (the project already uses this in `fonts/index.ts`; replace Geist and Inter).

| Voice | Family | Role |
|---|---|---|
| Serif display | **Newsreader** | Editorial layer, story copy, Piece names in editorial contexts, the large nav links on mobile |
| Grotesk | **Archivo** (variable, width axis `wdth`) | All UI: nav, buttons, forms, prices, body in the Storefront. Condensed caps for labels |
| Mono | **IBM Plex Mono** | Proof, Piece numbers (`No. 014`), captions, order numbers, size-guide tables |

CSS variables: `--font-serif`, `--font-sans`, `--font-mono`; `--font-heading` maps to the serif.

### Scale

Fluid between mobile and desktop with `clamp()`. Sizes are rem, base 16px.

| Style | Family | Size (mobile → desktop) | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display | Serif | 2.75rem → 6.5rem | 400 | 0.98 | -0.02em |
| H1 | Serif | 2.25rem → 4rem | 400 | 1.04 | -0.015em |
| H2 | Serif | 1.75rem → 2.5rem | 400 | 1.1 | -0.01em |
| H3 | Serif | 1.375rem → 1.75rem | 400 | 1.2 | 0 |
| Lede | Serif | 1.125rem → 1.375rem | 400 | 1.5 | 0 |
| Body | Sans | 1rem | 400 (width 100) | 1.55 | 0 |
| Body small | Sans | 0.875rem | 400 | 1.5 | 0 |
| Label | Sans, condensed (width 75), caps | 0.75rem | 600 | 1.2 | 0.1em |
| Caption | Mono | 0.75rem | 400 | 1.4 | 0.02em |
| Proof value | Mono | 0.875rem | 400 | 1.5 | 0 |
| Price | Sans | 1rem | 500, tabular figures | 1 | 0 |

Rules:

- Serif display is used for emotion and story; it never appears in buttons, form fields or table cells.
- Italic serif is reserved for the place line and pull quotes. One italic per screen at most.
- Piece numbers are always mono, always formatted `No. 014` (zero-padded to three digits).
- Prices use tabular figures and BRL with Brazilian number formatting and no cents when whole: `R$ 480`.
- Body measure: 62ch maximum. Story copy 52ch.
- Labels are the condensed-caps sans: category chips, section kickers (`PROOF`, `WORN IN`), step numbers.
- Keep at most two font weights visible in any one component.

## 4. Layout and spacing

**Base unit: 4px.** Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192. Components use 4–24; sections use 64–192.

| | Mobile (<768) | Tablet (768–1199) | Desktop (≥1200) |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| Gutter | 16 | 20 | 24 |
| Page margin | 16 | 32 | 48 |
| Max content width | — | — | 1440 (images may run full-bleed) |

- **Spec-sheet grid** (Storefront): hairline rules separate sections and rows. Rules run full container width. Numbered sections use a mono number in the left margin (`01`, `02`) on desktop and above the heading on mobile.
- **Editorial grid**: images break the grid on purpose (full-bleed, offset, asymmetric). Text blocks sit on columns 2–6 or 7–11, never centred by default.
- **Radius: 0** everywhere. Square corners are part of the spec-sheet feel. The only round shapes are colour swatches.
- **Elevation:** none. No shadows. Separation comes from hairlines and `stone` surfaces. The cart drawer and sheets sit over a plain 40% `ink` scrim.
- **Images:** Collection cards, Piece gallery and thumbnails are **square (1:1)**. Hero is 16:9 on desktop and 4:5 on mobile. Look frames in the Lookbook are 4:5 portrait or 3:2 landscape, always from the image brief. Use `object-fit: cover` and reserve space to avoid layout shift.
- **Catalog photography:** every Piece still life and on-body front, back and detail shot uses a blank, seamless `stone` backdrop (`#F3F1EC`). Model shots share the clothes-only photos' studio background; scenery and location objects belong in editorial imagery.
- **Catalog model poses:** models stand still in deliberate poses. Vary stance, arm placement and body angle between models while keeping the Piece visible; capture back and detail views from the same stationary posing session.
- **Breakpoint behaviour:** the nav is the flat desktop bar from 1024; below it, a menu button opens a full-height sheet.

## 5. Motion tokens

Restrained and tactile. Nothing bounces, nothing springs, nothing loops. Tokens and rules first, then the choreography (full detail in [Motion choreography](https://github.com/danielluis07/millrace/issues/15)).

| Token | Value | Use |
|---|---|---|
| `--ease-mech` | `cubic-bezier(0.65, 0, 0.35, 1)` | Default: precise, symmetric, weighted |
| `--ease-out-mech` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Things arriving |
| `--dur-fast` | 120ms | Hover colour changes, press feedback |
| `--dur-base` | 240ms | Chips, swatches, image swap on card hover |
| `--dur-slow` | 480ms | Drawer, sheet, overlay |
| `--dur-reveal` | 720ms | Editorial reveals only |

Rules:

- **Allowed:** opacity and transform (translate, clip-path). **Reveals are clip or wipe**, like a shutter or a page turn, never fade-and-float.
- **Not allowed:** springs, overshoot, scale-bounce, parallax on text, auto-playing carousels, looping animation, animated gradients.
- Hover on a Collection card swaps the still life for the on-body front shot with a `--dur-base` crossfade.
- The cart drawer slides from the right over `--dur-slow`, scrim in at the same time. Closing is the same, reversed.
- Underlines on links draw left-to-right over `--dur-fast`.
- Respect `prefers-reduced-motion`: replace slides and wipes with an instant or opacity-only change, keep layout identical.
- The Lookbook flow is horizontal on desktop (scroll) and on mobile (swipe). Native scroll behaviour is preserved; do not hijack the wheel.

### Choreography

- **Lookbook:** the strip opens on the **Lookbook cover** (text only; it wipes in once). When a Look settles, its mono number and title wipe in left to right (`--dur-reveal`, once per Look per visit); the image never animates and the counter swaps instantly. Interstitials don't move. Prev and next buttons and arrow keys scroll one snap.
- **Look panel:** a right drawer on desktop (same motion as the cart), a bottom sheet of about 85% on mobile. Quick add there does not open the cart; the button shows "Added · M" for about 2s.
- **Routes:** every route change crossfades the page body over `--dur-base`, with nav and footer anchored. No directional slides. Exactly three shared-element morphs (`--dur-slow`): Collection card → Piece main image, Home featured Piece → Piece main image, Home Lookbook teaser frame → Lookbook frame.
- **Storefront changes:** filters, Colourway swaps and gallery thumbnails crossfade images over `--dur-base`; text swaps instantly.
- **Lightbox:** morphs from the main image (`--dur-slow`); click toggles a 2× zoom (`--dur-base`).
- **Overlays:** support sheets come from the right like the drawer; the mobile nav sheet comes from the left; the search overlay clips down from under the nav.
- **Reveals** (clip or wipe, once per load) appear only on the Home hero line, the brand-promise place line (the stamp then appears instantly), the *By cloth* and teaser headings, the Lookbook cover and captions, and the 404 line. **Never** in the Storefront.
- **Reduced motion:** reveals become instant; drawers, panels, sheets, overlays, the lightbox and route changes become a `--dur-base` opacity crossfade; morphs fall back to the page crossfade.

## 6. Components

All components are built on the project's shadcn (base-nova, base-ui) primitives and restyled to the tokens above. Every interactive element shows a **2px focus ring with a 2px offset**, on keyboard focus only. The ring colour is one variable, `--ring`: `indigo` with a `paper` offset by default, overridden to `indigo-wash` with an `indigo-deep` offset inside `indigo-deep` sections.

### Buttons

- **Primary:** `ink` fill, `paper` text, label style (condensed caps, 0.1em), height 48 (44 on dense UI), padding 24. Hover: fill shifts to `indigo` over `--dur-fast`. Disabled: `stone` fill, `ink-muted` text.
- **Secondary:** transparent, 1px `ink` border, `ink` text. Hover: `ink` fill, `paper` text.
- **Text link:** sans, underline 1px offset 4px, draws on hover. Used for exits such as "View all" and "Read the Proof".
- Primary is used once per view region (one per Piece buy panel, one per drawer, one at Checkout).

### Piece card (Collection)

Square image on `stone`; below it, one row: mono `No. 014` left, price right; second row: name (sans, 500); third row: colour count in `ink-muted` (e.g. `3 colours`). At most one badge, placed top-left over the image, label style on `paper`. No wishlist, no quick-add on the card. Hover swaps the image.

### Piece page

- **Gallery:** square main image, thumbnail row below (square thumbnails, 1px `ink` border on the active one). Four squares per Colourway, in order: still life, on-body front, on-body back, on-body detail (a Proof close-up). Click opens a lightbox for zooming in on detail and Proof. Mobile: swipeable square with the same thumbnail row.
- **Buy panel (sticky on desktop):** `No. 014` mono, name (H2 serif), price, colour swatches, size selector, one badge at most, short story line (serif lede), Add to cart (primary, full width), size guide link.
- **Swatches:** 24px circles with a 1px hairline border; selected has a 2px `ink` ring offset by 2px. The colour name appears beside the label. The hit area is padded to 44px; the circle stays 24px.
- **Size selector:** a row of square cells, 48 min, mono labels. Selected is `ink` fill and `paper` text. Sold-out is `ink-muted` with a hairline diagonal strike and `aria-disabled`.

### Proof ledger

A hairline-ruled table in two columns: a condensed-caps label on the left (`FABRIC`, `WEIGHT`, `CONSTRUCTION`, `ORIGIN`, `REPAIR`), a mono value on the right, with a mono row number (`P.01`). Dotted leaders may connect label and value on desktop. Always visible, never in an accordion. On the featured Piece on Home, show a slice (three rows) with a link into the Piece page.

### Cart drawer

Right-side `stone` panel, 440 wide on desktop and full-width on mobile. Rows: square thumbnail, mono number, name, size and colour, quantity stepper (square cells), price, remove as text link. Footer: subtotal, the complimentary-repair note in mono caption, Checkout (primary). Empty state: one serif line and a link to the Lookbook.

### Look panel (Lookbook)

A panel over the flow listing a Look's Pieces: thumbnail, mono number, name, price, link to the Piece page, quick add with size. Same chrome as the cart drawer so the two read as one family; on mobile it is a bottom sheet (about 85% high) so the Look stays visible above it. Quick add here does not open the cart drawer: the button reads "Added · M" for about 2s and the cart count updates.

### Chips and filters

Category chips and filters use label style on a 1px `ink-muted` outline; active is `ink` fill with `paper` text. Filter groups (size, colour, Cloth) are hairline-ruled sections with square checkboxes (1px `ink-muted` border).

### Forms and Checkout

Single page with numbered spec-sheet sections (`01 Contact`, `02 Shipping`, `03 Delivery`, `04 Payment`), each with a mono number and a full-width hairline above. Fields: 48 high, 1px `ink-muted` border, label above in label style, no placeholder as label. Validation: `oxide` message beneath the field in body small, plus an `oxide` 1px border. The payment section has no card inputs; it shows a `stone` panel with "Showcase store, no payment is taken." and the Place order button. A sticky order summary sits beside the form on desktop and collapses to a top bar on mobile.

### Order confirmation

Mono fake order number (`MR-` plus six digits), line items in the ledger style, and a "what happens next" list that ends on the repair promise.

### Sheets (support content)

Shipping, Returns, Repairs and Size guide open as right-side sheets sharing the drawer chrome. The size guide is a hairline Proof-style table in mono.

### Search overlay

Full-width overlay under the nav: one large serif input, results as compact Piece rows. No results: one line and three category links.

### Footer

Four hairline-ruled columns on desktop (Shop, Lookbook, Support, Newsletter), stacked on mobile. Newsletter is one field and a button, fake success with a one-line serif confirmation. Showcase credit line below, plus a **small corner mark** fixed bottom-right on desktop (a 28px paper square with a hairline and the credit's initial; the line carries the full credit).

### Badges and stamps

Badge: label style, `paper` on a hairline border, max one per card. The **stamp** (`Mended free for life`) is `indigo` text in a 1px `indigo` rectangular border, rotated -2°, used at most once per screen, on the brand-promise band and on the cart note.

### Image placeholders

Until Campaign imagery lands, any placeholder is plainly marked: `stone` fill, a hairline diagonal cross, and a mono caption in the centre naming the intended shot (`PLACEHOLDER · No. 014 · still life`). Placeholders must never look like real photography.

### Edge states

Sold-out size (struck, disabled), empty cart, search with no results, 404 (serif Display line, one campaign image, a link to the Lookbook), image placeholders. Loading states belong to the Technical approach.

## 7. Brand mark

**A text wordmark, with a small monogram for tight spaces. No logo icon.**

- **Wordmark:** `MILLRACE`, set in Archivo at width 112 (slightly expanded), weight 600, all caps, tracking +0.18em. Wide and level, like a stamp on a bale of cloth. Colour `ink` on paper, `paper` on `indigo-deep`. Minimum width 96px. Clear space: the height of the letter M on all sides.
- **Monogram:** a serif **M** in Newsreader (weight 500) inside a square with a 1px `ink` border. Used for the favicon, the corner mark's neighbour spots and social-card avatars. At 16px the border is dropped and the M stands alone.
- **The race line:** two parallel hairlines under the wordmark in the footer and on the hero, with one short `indigo` segment sitting between them. This is the millrace channel and the thread of the "flow" idea. It is a graphic accent, not part of the logo lockup, and appears at most once per view.
- Never recolour the wordmark to indigo on paper. Never outline it, shade it, rotate it or place it on busy photography without a scrim.

### Name story

A millrace is the channel that carries water to the wheel of a mill. It is how a mill gets its power: patient, constant, unadorned. Millrace makes heavy cloth and sturdy clothes in the same spirit. The house carries no founder and no dates; the name points at a place and a way of working.

### The place

All Campaign imagery and place references belong to **Hollins Weir**, an invented mill hamlet on a small river, with a weir, a stone mill, woods and wet fields around it. The name is kept from the prototype's working title. There is no real-world location, county or country named; the geography is felt, never mapped.

### The craft

Heavy cloth woven and finished in the mill, indigo-dyed in the old way, cut and sewn into jackets, shirts and boots. The craft tradition is named plainly: **cloth, dye, stitch**. The Cloths (waxed cotton, selvedge denim, moleskin, and similar) carry it into the shop.

## 8. Tone of voice

**Exacting, unhurried, honest.** Millrace talks like a person who knows the cloth and has nothing to prove.

### Principles

1. **State the fact, then stop.** Weights in ounces, stitches per inch, the place. No adjectives doing a fact's job.
2. **Plain over clever.** Short sentences. Concrete nouns. No puns, no wordplay on the name.
3. **Earned warmth.** Warmth comes through care and precision, never through enthusiasm.
4. **The place is a presence, not a backstory.** Hollins Weir appears the way a street address does: matter-of-fact, never mythologised.
5. **Honest about being a showcase.** The Checkout note and footer credit say it plainly; the rest of the site stays in character.

### Do and don't

| Do | Don't |
|---|---|
| "Cut and sewn at Hollins Weir." | "Lovingly handcrafted with passion." |
| "14oz selvedge, indigo-dyed." | "Our premium, super-durable denim." |
| "Mended free for life." | "Built to last a lifetime, guaranteed!" |
| "Sold out in your size." | "Oops! Looks like this one's gone!" |
| "Your bag is empty." | "Your cart is feeling lonely." |
| "Order placed." | "Yay, thanks for your order!" |

### Rules

- No exclamation marks. No emoji. No ALL CAPS except condensed-caps labels set by the system.
- No heritage clichés: *artisan*, *timeless*, *crafted with love*, *since*, *founded*, *legacy*. No founder figure, no dates.
- No luxury clichés: *curated*, *elevated* (the word), *exclusive*, *discover*.
- Use the glossary: **Piece** (not product or item), **Proof** (not specs), **Look** (not outfit), **Cloth**, **Collection**, **Lookbook**, **Colourway**.
- Numbers are numerals: `14oz`, `3 colours`, `R$ 480`. British or American spelling is picked once: **American** (the site displays prices in BRL), except the Cloth names and **colour / Colourway**, which are trade words and stay traditional.
- Second person is allowed, sparingly. First-person plural ("we") is avoided; the house speaks about the work, not about itself.
- Microcopy is one short line. Error messages say what happened and what to do, with no apology.

### Register by area

- **Editorial layer** (hero lines, Lookbook, brand-promise band, 404): a spare serif sentence, often a fragment. The place line is the one italic.
- **Storefront** (cards, filters, buttons, drawers): sans, labels and facts. No flourishes.
- **Proof:** mono, factual, tabular.
- **Checkout and system messages:** direct and brief.

Sample lines to calibrate tone, not final copy:

- Hero: "Heavy cloth. Plain cut. Hollins Weir."
- Brand promise: "Made at the mill. Mended free for life."
- Showcase note at Checkout: "Showcase store, no payment is taken."
- Empty cart: "Your bag is empty. See the Lookbook."
- 404: "This page isn't here."
