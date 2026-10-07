# Trousers galleries: batch 4c

Issue #39 supplies 21 on-body photographs across seven Colourways. With the
seven existing still lifes, the five Trousers Pieces have 28 gallery squares.

## Cast and shot list

The cast and muted film-like grade follow [batch 1](batch-01-continuity.md).
Each front uses its exact catalog Colourway still life for garment construction
and Model A or B's campaign reference for cast continuity. Back and worn detail
views reference the corresponding studio front. Heads are outside the
waist-to-ankle composition; the cast references establish build and skin tone.
All catalog views use the seamless stone studio background (`#F3F1EC`) and
diffused daylight required by `DESIGN.md` and the owner's
[batch 2 production rules](batch-02-continuity.md).

| Piece | Colourway | Model | Worn Proof detail |
|---|---|---|---|
| No. 131 Straight Jean | Indigo | A | Brass pocket rivet and chain-stitched waistband |
| No. 131 Straight Jean | Rinsed | B | Brass pocket rivet and chain-stitched waistband |
| No. 137 Double-Knee Trouser | Olive | A | Reinforced knee panel, stitching and brass rivet |
| No. 140 Work Trouser | Slate | B | Bar-tacked belt loop and deep pocket opening |
| No. 140 Work Trouser | Moss | A | Bar-tacked belt loop and deep pocket opening |
| No. 146 Fatigue Trouser | Oat | B | Adjustable waist tab and corozo button |
| No. 152 Pleated Trouser | Charcoal | A | Welted rear pocket in brushed cotton flannel |

Models stand in deliberate stationary poses. Full views retain both trouser
legs and the waistband, with ankle drape representing the fixed 34in inseam.
Lower edges are unfinished, without cuffs or turned-up hems. The existing
still lifes depict finished lower edges; this batch follows the ticket's
unhemmed specification for the new on-body images. Indigo front and back,
Rinsed back, Olive Double-Knee front and back, Moss Work Trouser front and back,
and Oat Fatigue Trouser back received focused imagegen edits to remove copied
hem stitching. The original briefs and exact revision
prompts are recorded in [the prompt set](batch-04c-prompts.json).

## Review artifacts

Contact sheets show still life, front, back and detail for each Colourway:

- [Straight Jeans and Double-Knee Trouser](batch-04c-contact-1.jpg)
- [Work Trousers](batch-04c-contact-2.jpg)
- [Fatigue and Pleated Trousers](batch-04c-contact-3.jpg)

Delivery-resolution crops retain 512 × 512 source pixels without resizing:

- [Jeans and Double-Knee spot checks](batch-04c-spot-1.jpg)
- [Work Trouser spot checks](batch-04c-spot-2.jpg)
- [Fatigue and Pleated spot checks](batch-04c-spot-3.jpg)

## Production

Generated one photograph per built-in imagegen call. The tool exposes no model
version selector, so no specific model version is claimed. Prompt records
include each catalog key, model, reference keys, exact prompt, revisions,
native source dimensions and delivered dimensions.

Delivery uses sRGB JPEG at quality 85 with the grade baked in, at 2048 × 2048.
All native sources were 1254 × 1254 and were resampled with Sharp; resampling does not
add native photographic detail. The existing `MillraceImage` component supplies
blur-up loading and reserves the square gallery geometry.

All new photographs were inspected individually and on the contact sheets for
colour, texture, construction, anatomy, hardware, framing and studio continuity.
Each delivered image received a 100% spot check through the crops above. No
visible extra fingers, floating hardware, text, logos or watermarks were found
in the inspected areas.

## Validation

- `bun run images:generate`: 155 JPEGs with dimensions and blur metadata.
- All 28 Trousers gallery slots validated as square sRGB JPEGs at least 2048
  pixels wide, with matching manifest dimensions and JPEG blur data.
- `bun test`: 52 passed, zero failed. No Trouser keys remain in the missing
  image report. The 33 remaining keys belong to Knitwear and Boots batches.
- `bun run build`: compiled, type-checked and exited with code 0. It printed
  the previously documented `/shop` prerender diagnostic about
  `useSearchParams()` outside Suspense, despite the page's existing Suspense
  wrapper. This was not a diagnostic-free build; no application code changed
  in this batch.
- Headless Chrome against the production server passed 56 gallery checks:
  all four shots in every Colourway, at 1440 × 1000 desktop and 390 × 844
  mobile viewports. Each thumbnail selected the expected optimized image,
  which decoded successfully and retained square geometry without a marked
  placeholder. Colourway changes also selected the expected media.
- Maximum observed cumulative layout shift was 0.00182 on the desktop
  Straight Jean page; the other nine route/viewport combinations recorded 0.
  There were no uncaught browser exceptions. This was a local browser check,
  not a throttled Lighthouse run.
