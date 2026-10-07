# Catalog imagery: first-half checkpoint

24 of the 48 unique keys required by issue #35 are delivered. This is the
owner-requested halfway stop, not completion of the issue. The remaining
24 keys are still lifes for the later shirts, trousers, knitwear and boots.

## Verification

- `bun run images:generate`: 45 source JPEGs in the manifest, including the
  existing 21 editorial images and the new 24 catalog images.
- `bun test`: 32 passing tests, zero failures. Delivery priority 2 reports
  exactly 24 missing keys; none of this checkpoint's keys remains missing.
- All 24 delivered files were checked for exact catalog keys, unique keys,
  JPEG format, sRGB colour space, 2048 × 2048 dimensions and blur metadata.
- All 24 keys were rendered through `MillraceImage` using server rendering:
  photographs resolve with blur placeholders and reserved square geometry.
  This checks the shared renderer; it is not a browser CLS measurement.
- Every image was visually inspected. Full-resolution center crops check
  stitching and hardware; additional 100% crops check faces and hands in all
  nine model photographs. No obvious anatomy or hardware artifacts were found.
- Every catalog shot has a blank stone studio background. The four original
  on-body photographs containing scenery were replaced before this checkpoint.
- Each Field Jacket Colourway retains one model across front, back and detail.
  Models A, B and C remain distinct. Their identities and the owner's standing
  pose rule are recorded in `batch-02-continuity.md`.

## Review and production limits

The labeled contact sheet is `batch-02-first-half.jpg`; originals are under
`public/images/pieces/` at the keys in `batch-02-prompts.json`. Generation used
the built-in imagegen tool, one asset per call. The tool returned 1254 × 1254
native sources, resampled to the specified 2048 × 2048 delivery dimensions.
Resampling does not provide native 2K photographic detail. Flat-lay margins
vary with garment width; the whole garment is visible in every still life.

Piece pages are not implemented at this checkpoint. Their eventual gallery
can consume the supplied Field Jacket keys through the existing image component.
