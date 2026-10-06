# Menswear web design directions survey

Research for issue #3 (child of map issue #1). Question: how do menswear brands present themselves online across the spectrum, and what does each direction signal? This note does not recommend a direction; the owner decides in a later ticket.

## Method and confidence

Evidence comes in three tiers. Each claim below is tagged.

- **[source]** Typeface names read directly from the live site's HTML/CSS (font-family declarations, loaded font files), fetched 2026-10-06. This is first-party evidence of what the site ships.
- **[write-up]** Taken from a credible third-party article (linked).
- **[observed pattern]** Layout, palette, imagery and motion habits. These are my characterisation of the direction, informed by fetching the pages (which only returned text/markup, not rendered visuals) and general knowledge of the category. They are NOT verified against rendered screenshots. Before the owner relies on any of them, open the reference sites in a browser.

Limits: Loro Piana, Zegna and Brioni returned HTTP 403 to automated fetches, so their fonts were not read from source. Burberry's root page is a region selector for non-browser fetches. Brands change sites often; typefaces here are as of the fetch date. Typeface names are exact; everything visual is approximate.

## 1. Luxury house

**Reference sites:** [Loro Piana](https://www.loropiana.com/en/), [Zegna](https://www.zegna.com/us-en/), [Brioni](https://www.brioni.com/), [Burberry](https://www.burberry.com/) (all bot-blocked or region-gated for automated fetch; open in a browser).

- **Typography.** [write-up] A Monotype study of luxury brands found about 80% use a serif in the logo and about 70% use a geometric sans as the supporting face (Futura and Proxima Nova most common); nine in ten use all-caps for navigation and logos ([Monotype](https://www.monotype.com/resources/expertise/fonts-and-luxury-brands-fashion)). It also warns that hairline strokes render poorly on screen. Examples named there: Gucci (Granjon logo, Futura body), Armani (Didot logo, Montserrat body). [source] Burberry ships a bespoke "burberry-house-regular" font file. [write-up] Burberry returned to a serif wordmark and the Equestrian Knight in 2023 after a sans-serif era ([Dezeen](https://www.dezeen.com/2023/02/07/burberry-daniel-lee-logo-equestrian-knight-design/amp/), [Design Week](https://www.designweek.co.uk/issues/6-february-10-february-2023/burberry-new-logo-daniel-lee/)). Pattern: wordmark is a serif or bespoke face; the UI around it is quiet small-caps sans.
- **Colour.** [observed pattern] White or warm off-white, black, with one house accent (camel, navy, brand red). Colour mostly comes from photography, not UI.
- **Layout.** [observed pattern] Full-bleed hero, generous whitespace, few elements per screen, centred logo with a thin hamburger or sparse top nav. Large product grids appear only deep in category pages.
- **Imagery.** [observed pattern] Campaign photography or film, cinematic, often location-based, models with a distant expression. Product shots on clean grey or white, shown large.
- **Motion.** [observed pattern] Slow fades, autoplay muted video in the hero, restrained hover (second image swap). Little visible UI animation.
- **Product vs editorial.** [observed pattern] Editorial dominates the home page; product pages are calm and spare, often with "contact a client advisor" in place of aggressive upsell. Craft and material story (fibres, ateliers) sits beside the product.
- **Signals.** Heritage, exclusivity, patience, price that is not discussed.
- **Avoid.** Hairline fonts at small sizes; discount banners and urgency timers; crowded grids; stock photography; heavy page weight from autoplay video.

## 2. Contemporary / premium

**Reference sites:** [Ami Paris](https://www.amiparis.com/), [Our Legacy](https://www.ourlegacy.com/), [Norse Projects](https://www.norseprojects.com/).

- **Typography.** [source] Ami loads "Mier A" in light, regular and demi weights (a geometric-grotesque sans). Our Legacy loads Neue Haas Unica Pro (Regular, Bold), a Helvetica-family neo-grotesque. Norse Projects loads Helvetica Neue LT Std in condensed cuts and Inter. Pattern: a single neo-grotesque or geometric sans, lowercase or sentence case, small type, tight tracking. Fewer serifs than luxury.
- **Colour.** [observed pattern] White or light grey base, black text, product colour carries the page. Seasonal accent colours appear in imagery only.
- **Layout.** [observed pattern] Tight uniform product grids (3 or 4 columns desktop, 2 mobile), thin top bar, strong alignment to a visible or implied grid, text kept to captions.
- **Imagery.** [observed pattern] Clean studio shots on plain backgrounds plus slightly loose lookbook photography (street, friends, travel). Less polish than luxury, more attitude.
- **Motion.** [observed pattern] Quick hover image swaps, lightweight transitions, little autoplay.
- **Product vs editorial.** [observed pattern] Product-forward. Lookbooks sit one click away; the home page is mostly a seasonal grid with one editorial hero.
- **Signals.** Design-literate, current, attainable premium, an in-the-know customer.
- **Avoid.** Pretending to be a luxury house (long copy, slow reveals) while selling at premium prices; overuse of mid-grey type that fails contrast; many accent colours.

## 3. Streetwear

**Reference sites:** [Supreme](https://www.supremenewyork.com/), [Palace](https://www.palaceskateboards.com/), [Stüssy](https://www.stussy.com/), [Kith](https://www.kith.com/), [Aimé Leon Dore](https://www.aimeleondore.com/) (the last sits between streetwear and premium). Supreme's own site was not fetched; its logo facts come from a write-up.

- **Typography.** [source] Palace loads Neue Helvetica; Stüssy loads Helvetica Neue LT Pro (Roman, Medium, Bold); Aimé Leon Dore declares Söhne; Kith's site uses Inter plus an Adobe Fonts (Typekit) kit. [write-up] Supreme's box logo is white Futura Heavy Oblique on red, a format borrowed from Barbara Kruger ([Font Alternatives](https://fontalternatives.com/inspiration/supreme-futura/)). Pattern: a house logo does the typographic work; the site itself is plain Helvetica-style sans so the product and the logo stand out.
- **Colour.** [observed pattern] Mostly white or black base with neutral UI; a single signature colour tied to the logo (Supreme red). Palace and Stüssy run near-monochrome UI.
- **Layout.** [observed pattern] Dense grids of product tiles, low-chrome navigation, text lists ("Web Shop", "Shops", "Advice" on Palace, read from its page text). Weekly drop calendar as a content structure. Utilitarian, sometimes deliberately rough.
- **Imagery.** [observed pattern] Flash photography, skate and street scenes, collab announcements, product on flat colour. Lookbooks are loose and cast with friends and talent.
- **Motion.** [observed pattern] Mostly instant. Countdowns, drop states, queue pages and sold-out badges are the main "interaction". Hover swaps on tiles.
- **Product vs editorial.** [observed pattern] The product drop is the content. Editorial is a lookbook link or a collab page. Aimé Leon Dore leans more editorial (lookbook, news, cafe and sound sections noted in its home page text).
- **Signals.** Insider status, scarcity, community, youth culture.
- **Avoid.** Faking scarcity you cannot back up; heavy hero video that slows a drop page; polish so high it loses the rough edge; ironic logos with no real culture behind them.

## 4. Workwear / heritage

**Reference sites:** [Filson](https://www.filson.com/), [Red Wing](https://www.redwingshoes.com/), [Carhartt WIP](https://www.carhartt-wip.com/), [Taylor Stitch](https://www.taylorstitch.com/).

- **Typography.** [source] Filson ships Founders Grotesk (Text, X-Condensed, Mono) and a heavy display face "Mitigate"; Taylor Stitch loads Orbikular (variable serif/display), National 2, and IBM Plex Mono. Carhartt WIP and Red Wing font names were not recoverable from source. Pattern: condensed sans or grotesk headlines in caps, sometimes a serif for story copy, mono for specs (weight, fabric, origin).
- **Colour.** [observed pattern] Earth tones: tan, olive, rust, indigo, off-white paper, plus a single brand colour (Carhartt amber/yellow, Filson green). Dark overlays on photography.
- **Layout.** [observed pattern] Hero banners with bold caps text, category tiles, "Made in" or "since" claims, spec tables on product pages (fabric weight, construction, origin).
- **Imagery.** [observed pattern] Real work and outdoor contexts, weathered texture, craftspeople, documentary-style black-and-white, objects on timber or concrete.
- **Motion.** [observed pattern] Minimal; image carousels and hover swaps. Weight is in photography, not animation.
- **Product vs editorial.** [observed pattern] Balanced. Product pages carry heavy proof (material, construction, guarantee, repair); editorial is a "Journal" or "Stories" section rooted in people and place.
- **Signals.** Durability, authenticity, longevity, practical value.
- **Avoid.** Fake distressing and invented "since 19xx" heritage; stock outdoorsy imagery; grunge that looks like a theme; fonts that read as costume.

## 5. DTC / minimal

**Reference sites:** [Everlane](https://www.everlane.com/), [Buck Mason](https://www.buckmason.com/), [Taylor Stitch](https://www.taylorstitch.com/) (straddles workwear).

- **Typography.** [source] Everlane loads Maison Neue (Book and regular) and a script face (Selva Script) for accents. Buck Mason uses Acumin Pro and Acumin Pro Condensed with Overpass Mono, Proxima Nova Wide, and Big Caslon. Pattern: one friendly neo-grotesque, regular weight, sentence case, mono or small caps for metadata. Easy to read at small sizes.
- **Colour.** [observed pattern] White base, black or charcoal text, a muted palette (sand, olive, navy) to match the product line, bright colour reserved for sale or low-stock labels.
- **Layout.** [observed pattern] Conventional store: product grid with filters, size and colour swatches, review stars, fit guides, size charts. Lots of trust UI (shipping, returns, materials, price transparency).
- **Imagery.** [observed pattern] Bright, consistent, on-model and flat-lay photography on plain backgrounds, plus lifestyle shots. Model height and size listed for fit reference.
- **Motion.** [observed pattern] Almost none beyond product image zoom, quick-add drawers and sticky add-to-cart.
- **Product vs editorial.** [observed pattern] Product and conversion first. Editorial is small: "Our Story", sustainability or factory pages, a short journal.
- **Signals.** Honest value, convenience, clear sizing, low risk.
- **Avoid.** Anonymous Shopify-default look (Everlane's and Filson's page source both contain the same default "Assistant" theme CSS); permanent sale banners; stacked popups on first load; imagery too sparse to show fit.

## Cross-cutting findings

- **UI type is almost always a neo-grotesque or geometric sans.** Across about a dozen sites read from source, serifs appear in logos, story copy or one accent face, not in the interface.
- **Font licensing matters for a portfolio piece.** Many faces above (Söhne, Neue Haas Unica, Maison Neue, Founders Grotesk, Acumin, Orbikular) are commercial. Look-alike open fonts exist; that is for the design ticket.
- **Direction is mostly set by imagery and density, not typeface.** The same Helvetica-family sans appears on Stüssy, Palace, Our Legacy and Norse Projects, yet they feel different because of grid density, photography and copy.

## Comparison table (react, then pick)

| | Luxury house | Contemporary / premium | Streetwear | Workwear / heritage | DTC / minimal |
|---|---|---|---|---|---|
| First impression | Quiet, cinematic | Cool, edited | Loud logo, rough | Rugged, honest | Friendly, clear |
| Type feel | Serif logo, small-caps sans | One neo-grotesque, small | Helvetica plus a big logo | Condensed caps, mono specs | One soft sans |
| Colour | White, black, one accent | White, black, product colour | Mono plus one signature colour | Earth tones | White plus muted tones |
| Layout | Few items, lots of space | Tight even grid | Dense tiles, drop calendar | Banners, spec tables | Standard shop, filters |
| Photos | Campaign film, cinematic | Studio plus loose lookbook | Flash, street, collabs | Real work, texture | Bright, on-model |
| Motion | Slow fades, video | Quick hovers | Instant; countdowns | Minimal | Minimal, functional |
| Story vs product | Story first | Product first | The drop is the story | Balanced, proof heavy | Product and trust first |
| It says | Heritage, exclusive | Design-aware | Insider, scarce | Built to last | Fair, easy |
| Risk | Looks empty if content is thin | Looks generic | Needs real culture | Costume heritage | Looks like every store |
| Effort to look credible | High (photo and film) | Medium | Medium | Medium (real texture) | Low |

## Sources

- Monotype, fonts and luxury brands: https://www.monotype.com/resources/expertise/fonts-and-luxury-brands-fashion
- Dezeen, Burberry logo 2023: https://www.dezeen.com/2023/02/07/burberry-daniel-lee-logo-equestrian-knight-design/amp/
- Design Week, Burberry logo 2023: https://www.designweek.co.uk/issues/6-february-10-february-2023/burberry-new-logo-daniel-lee/
- Font Alternatives, Supreme box logo: https://fontalternatives.com/inspiration/supreme-futura/
- Font names read from live HTML/CSS of: burberry.com, aimeleondore.com, stussy.com, kith.com, palaceskateboards.com, filson.com, everlane.com, buckmason.com, taylorstitch.com, ourlegacy.com, amiparis.com, norseprojects.com (fetched 2026-10-06).
