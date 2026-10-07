# Knitwear galleries: batch 4d

Issue #40 supplies 18 on-body photographs across six Colourways. Together
with their existing still lifes, all three Knitwear Pieces have complete
four-square galleries. The owner's additional request replaces the Knitwear
category portrait with an icy outdoor scene and a seated pose.

| Piece | Colourway | Model | Worn Proof detail |
|---|---|---|---|
| No. 160 Shetland Crew | Oat | A | Linked shoulder seam and ribbed crew neckline |
| No. 160 Shetland Crew | Navy | B | Linked shoulder seam and ribbed crew neckline |
| No. 160 Shetland Crew | Moss | D, bearded | Ribbed cuff and sleeve transition |
| No. 163 Shetland Cardigan | Charcoal | E, moustached | Reinforced button band, corozo buttons and pocket edge |
| No. 169 Roll-Neck | Ecru | F, blond | Deep ribbed roll neck and linked shoulder seam |
| No. 169 Roll-Neck | Navy | D, bearded | Deep ribbed roll neck and linked shoulder seam |

Oat and Navy Crew sessions were generated before the owner's cast change.
The remaining sessions use the existing D, E and F references from
[the catalog cast](next-model-cast.md). Fronts for those Colourways were
replaced as well, so each set preserves the same model in front, back and
detail. The early A/B versions of those four sets were discarded.

Every studio front references its exact Colourway still life for garment
construction and a separate cast reference for identity. Back and detail
shots reference the selected front. Catalog shots keep the blank seamless
stone backdrop, stationary poses and muted diffuse-light grade.

`categories/knitwear` shows Model B wearing the Moss Shetland Crew, seated on
a limestone bank beside an icy river and snow-dusted mill landscape, with
one forearm resting on his raised knee. This supersedes the earlier category
scene and pose. It retains the 4:5 slot and existing image key.

Generated one photograph per built-in imagegen call. The tool does not expose
a model version selector. Exact final prompts and reference roles are in
[the prompt set](batch-04d-prompts.json). Sources are resampled to 2048 × 2048
for galleries and 1600 × 2000 for the category, then converted to sRGB JPEG
at quality 85. Native dimensions are recorded per asset; resampling does not
add native photographic detail.

All selected photographs were inspected individually for colour, texture,
construction, framing, anatomy, hardware and continuity. Full-resolution
spot sheets preserve 512 × 512 delivery pixels without resizing. No visible
anatomy or hardware defects, logos, lettering or watermarks were found in
the inspected areas.

Review artifacts, with rows in table order:

- [Oat and Navy Crew galleries](batch-04d-contact-1.jpg), [100% spots](batch-04d-spot-1.jpg)
- [Moss Crew and Charcoal Cardigan](batch-04d-contact-2.jpg), [100% spots](batch-04d-spot-2.jpg)
- [Ecru and Navy Roll-Neck](batch-04d-contact-3.jpg), [100% spots](batch-04d-spot-3.jpg)

Validation:

- Manifest regeneration: 173 JPEGs with dimensions and blur metadata.
- All 24 Knitwear gallery slots validated as 2048 × 2048 sRGB JPEGs with
  matching manifest dimensions and JPEG blur data; category validated at
  1600 × 2000 in sRGB.
- `bun test`: 56 passed, zero failed. No Knitwear keys remain missing. The
  remaining 15 missing keys belong to Boots.
- `bun run build`: compiled and type-checked, exit code 0. It printed the
  previously documented collection-route `useSearchParams()` prerender
  diagnostic despite its existing Suspense wrapper. The build was not
  diagnostic-free.
- Production Chrome: 48 gallery checks across every Colourway and all four
  shots, at 1440 × 1000 and 390 × 844. Each thumbnail selected the expected
  optimized image, decoded successfully and retained square geometry.
  Colourway selection worked. Category image decoded in both viewports.
  No uncaught browser exceptions; Home CLS was 0 in both viewports.
- These are local image and browser checks, not a Lighthouse performance run.
