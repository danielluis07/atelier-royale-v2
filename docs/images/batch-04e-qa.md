# Boots galleries: batch 4e

Issue #41 delivers 15 on-body photographs across five Colourways. Together
with the five existing still lifes, all four Boot Pieces now have complete
four-square galleries. All 188 Campaign imagery keys are present.

| Piece | Colourway | Cast reference | Worn Proof detail |
|---|---|---|---|
| No. 177 Engineer Boot | Black | A | Goodyear welt, round last and instep buckle |
| No. 177 Engineer Boot | Saddle | B | Goodyear welt, instep buckle and stacked heel |
| No. 182 Service Boot | Oxblood | A | Goodyear welt and stacked heel |
| No. 188 Moc Toe Boot | Saddle | B | Hand-stitched moc toe, welt and wedge sole |
| No. 194 Chukka | Tobacco | A | Double-stitched quarter, welt and crepe sole |

Fronts reference the exact Colourway still life for product construction and
the batch 1 cast image for wearer continuity. Rear and detail views reference
the selected front, retaining the same trousers, wearer, leather and lighting.
The framing is knee down; faces and hands are outside every frame. The
Service Boot on-body views follow the catalog's plain-toe specification,
omitting the decorative toe-cap seam in its pre-existing still life.

The owner's recorded catalog direction in DESIGN.md and
[batch 2 continuity](batch-02-continuity.md) supersedes the ticket's outdoor
setting. Every photograph uses a blank seamless stone studio floor and
backdrop, stationary poses, soft diffuse daylight and a muted film-like grade.
The Portuguese website copy and existing still lifes are preserved.

Generated one photograph per built-in imagegen call. Exact prompts,
reference roles, native dimensions and delivery dimensions are recorded in
[the prompt set](batch-04e-prompts.json). The tool does not expose a model
version selector. Native 1254 × 1254 sources are resampled to 2048 × 2048
and converted to sRGB JPEG at quality 85; resampling does not add native
photographic detail.

Every photograph was reviewed for colour, material, framing, sole type,
construction and session continuity. The spot sheets retain 512 × 512
delivery pixels without resizing. No visible anatomy, stitching or hardware
defects, text, logos or watermarks were found in the inspected areas.

Review artifacts, in table order:

- [Engineer Boot galleries](batch-04e-contact-1.jpg), [100% spots](batch-04e-spot-1.jpg)
- [Service and Moc Toe galleries](batch-04e-contact-2.jpg), [100% spots](batch-04e-spot-2.jpg)
- [Chukka gallery](batch-04e-contact-3.jpg), [100% spots](batch-04e-spot-3.jpg)

Validation:

- Manifest regeneration: 188 JPEGs, each with dimensions and blur metadata.
- All 20 Boot gallery slots validated as 2048 × 2048 sRGB JPEGs with
  matching manifest dimensions and JPEG blur data.
- Image and manifest tests: four passed, zero failed. Coverage reports
  188/188 keys present, with no missing images in any delivery priority.
- Full `bun test`: 43 passed, 13 failed. Failures are unchanged English-copy
  and English-search expectations after the owner's Portuguese translation.
- `bun run build`: compiled and type-checked, exit code 0. It printed the
  previously documented collection-route `useSearchParams()` prerender
  diagnostic despite the existing Suspense wrapper; not diagnostic-free.
- Production Chrome: 40 gallery checks across five Colourways and all four
  views, at 1440 × 1000 and 390 × 844. Colourway radios and thumbnails
  selected the expected optimized image; every image decoded and retained
  square geometry. No uncaught browser exceptions. Maximum measured page
  CLS was 0.002443. The existing MillraceImage supplies blur-up placeholders
  and reserves the same square geometry for every view.
- These are image and browser checks, not a Lighthouse performance run.
