# Batch 1 verification

The 21 JPEGs in issue #34 are present at the catalog keys. Each has the exact
delivery aspect and minimum dimensions, sRGB color and an 8-pixel JPEG blur
entry in the regenerated manifest. The automated acceptance check is
`lib/images/editorial-batch.test.ts`.

- `bun test`: 22 passed, 0 failed. Hero and Looks: 0 missing.
  Interstitials and 404: 0 missing. Other batches still have 167 missing keys.
- `bun run lint`: passed.
- `bun run build`: passed, including TypeScript and static generation.
- Rendered all 21 assets through `MillraceImage` using React server rendering:
  each emits a real optimized image, a blur background and the reserved slot
  aspect ratio, with no marked placeholder.
- Inspected every final generation at native resolution for face, hand and
  hardware defects, clothing color and continuity. Corrected the Chore Jacket's
  upper patch pockets, the river's upstream viewpoint, the Chukka eyelet count
  and the slate moleskin shirt.
- Mobile Hero has its own composition; each square companion retains its
  full frame's model, outfit and setting.

All generated sources were below the brief's delivery dimensions and were
resampled for export. The prompt records disclose native and delivered sizes;
these files should not be described as native 2K or 3.2K generations.

The existing `MillraceImage` component uses the manifest blur data and fixed
slot geometry. This branch's baseline has a foundations Home stub and no
Lookbook or custom 404 page, so live-page verification and the five-route
Lighthouse pass remain part of the page build hand-off. No Lighthouse scores,
screen-reader results or rendered-page layout-shift measurements are claimed
for this asset batch.
