# Shirts galleries: batch 4b

Issue #38 delivers 27 on-body JPEGs at the catalog's exact keys under
`public/images/pieces/`. With the nine existing still lifes, all five Shirts
Pieces now have four gallery images in every Colourway: 36 squares in total.

## Cast and shot list

The owner selected a new cast for Shirts: Model D has a Viking appearance,
Model E has very short dark hair and a moustache, and Model F is blond and
clean-shaven. Their descriptions, saved identity portraits and production
rules are in [the cast note](next-model-cast.md). The [cast prompt records](shirts-cast-prompts.json)
preserve the exact briefs used to establish these identities. Each man wears
three Colourways, with distinct stationary standing poses.

| Piece | Colourway | Model | Worn Proof detail |
|---|---|---|---|
| No. 101 Work Shirt | Indigo | D | Chain-stitched curved hem and felled side seam |
| No. 101 Work Shirt | Ecru | E | Chain-stitched curved hem and felled side seam |
| No. 104 Western Shirt | Indigo | F | Pointed front yoke, flap pocket and pearl-faced snap |
| No. 112 Flannel Shirt | Grey Check | D | Check-matched chest pocket and corozo button |
| No. 112 Flannel Shirt | Red Check | E | Check-matched chest pocket and corozo button |
| No. 112 Flannel Shirt | Green Check | F | Check-matched chest pocket and corozo button |
| No. 118 Popover Shirt | Oat | D | Gusseted side vent and felled side seam |
| No. 125 Moleskin Shirt | Slate | E | Double-stitched worn cuff and corozo button |
| No. 125 Moleskin Shirt | Tobacco | F | Double-stitched worn cuff and corozo button |

Each front references the exact Colourway still life for garment construction
and its cast portrait for identity. Its back and detail reference that front
for the same man, garment and studio session. Six fronts were reframed through
imagegen to exclude the mouth and meet the chin-to-mid-thigh crop; these
revision prompts are recorded alongside their original generation prompts.
The early Model A attempt was replaced after the owner's casting change.

Every image uses a blank seamless stone studio backdrop (`#F3F1EC`), soft
diffused daylight and the muted film-like grade established by earlier batches.
The cast changed at the owner's request; lighting and garment references
retain the existing catalog's continuity. Detail views are tight photographs
of worn garments, rather than flat lays.

## Review artifacts

The contact sheets compare each Colourway's still life, front, back and detail:

- [Work Shirts and Western Shirt](batch-04b-contact-1.jpg)
- [Flannel Shirts](batch-04b-contact-2.jpg)
- [Popover and Moleskin Shirts](batch-04b-contact-3.jpg)

All new photographs were viewed individually and compared on these sheets for
garment colour, texture, pockets, checks, construction, hardware, anatomy,
framing and studio continuity. Every delivered image also received a
512-pixel spot check without resizing. The review found no visible extra
fingers, floating hardware, lettering, logos or watermarks in the inspected
areas. These crops preserve delivery pixels at 100%:

- [Work and Western delivery-resolution crops](batch-04b-spot-1.jpg)
- [Flannel delivery-resolution crops](batch-04b-spot-2.jpg)
- [Popover and Moleskin delivery-resolution crops](batch-04b-spot-3.jpg)

## Production and validation

Generated one photograph per built-in imagegen call. No generation model
version is claimed because the tool does not expose a version selector.
The [image prompt records](batch-04b-prompts.json) retain each key, cast,
references, exact prompt, framing revision and source/delivery dimensions.

Delivery is 2048 × 2048 sRGB JPEG at quality 85, with the grade baked in.
All native outputs were 1254 × 1254 and were resampled with Sharp to the
brief's delivery dimensions. Resampling does not add native photographic detail.
Cast portraits retain their native dimensions and live outside the public
catalog image directory.

- `bun run images:generate`: 134 JPEGs with dimensions and blur metadata.
- All 36 Shirt gallery slots validated as square sRGB JPEGs at least 2048
  pixels wide, with matching manifest dimensions and JPEG blur data.
- `bun test`: 52 passed, zero failed. No Shirt keys remain in the missing
  image report; other imagery batches account for the remaining 54 keys.
- Production HTTP checks: all five Shirt Piece routes returned 200. Each
  rendered its initial gallery and blur placeholders; its page payload
  included all Colourways' image sources.
- All 27 new images returned HTTP 200 image responses from the Next.js
  image optimizer at width 640 and quality 75.
- `MillraceImage` supplies blur-up loading within the existing reserved square
  geometry. Gallery layout and rendering code did not need changes. No browser
  CLS measurement or Lighthouse run was performed.
- The final `bun run build` compiled, type-checked and exited with code 0.
  It also printed the previously documented `/shop` prerender diagnostic
  about `useSearchParams()` outside Suspense, despite that page's existing
  Suspense wrapper. This is not a diagnostic-free build validation. The Shirt
  routes served successfully from the resulting production build.
