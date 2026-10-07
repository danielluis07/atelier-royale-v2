# Campaign imagery

Batch 1 delivers the Hero frames, eight Looks and their square companions,
two Interstitials and the 404 weir photograph (21 JPEGs). Reuse the cast and
place references in [the continuity note](images/batch-01-continuity.md) for
later batches; [the prompt records](images/batch-01-prompts.json) include the
outfits and native versus delivery dimensions. Run `bun test` to validate
these slots and their blur metadata.

Batch 2's first half delivers 24 catalog images: three complete Field Jacket
galleries and 12 other still lifes. Review the [contact sheet](images/batch-02-first-half.jpg),
[cast and production rules](images/batch-02-continuity.md),
[prompt records](images/batch-02-prompts.json) and [QA notes](images/batch-02-qa.md).
All catalog photography uses a blank stone background, including model shots.
Upcoming model shots use deliberate stationary standing poses. The remaining
24 still lifes in issue #35 await the owner's next instruction.

Drop source JPEGs into `public/images/`. A key is the path without `.jpg`:
`pieces/027-field-jacket/olive-still` resolves to
`public/images/pieces/027-field-jacket/olive-still.jpg`. Use lowercase kebab-case
and `.jpg`, as in the image brief (#11). Sources remain JPEG; the Next.js
optimiser negotiates AVIF or WebP with the browser at quality 75.

`bun dev` and `bun run build` run the manifest generator first. Restart dev
after adding, replacing or removing photos, or run `bun run images:generate`
while dev is running. Commit `lib/images/manifest.json` with the source images.
The generated file contains oriented dimensions and an 8-pixel JPEG blur for
each source. An empty folder is valid. Corrupt or incorrectly named JPEGs
stop generation without replacing the previous manifest. Other files are ignored.

Render all Campaign imagery through `components/millrace-image.tsx`:

```tsx
<MillraceImage
  imageKey="pieces/027-field-jacket/olive-still"
  slot="collection-card"
  alt="Field Jacket in Olive, still life"
/>
```

Pass meaningful shot-specific alt text, or `alt=""` for decorative imagery.
Missing keys show stone, a hairline diagonal cross and the key in mono.
Both branches reserve the same slot ratio and use cover cropping.
`lib/images/slots.ts` owns all ratios, responsive `sizes` and loading policy;
match a slot's sizes to its consuming layout. Only `home-hero` and `piece-main`
load eagerly with high fetch priority. The Hero ratio changes from 4:5 to 16:9
at 768px; portrait and landscape Look slots also cover Interstitials and Home
teaser frames. Each component renders one image key; choose the supplied Hero
frame appropriate to the composition when building Home.

The Home stub demonstrates the first four catalog still lifes. Drop in
`pieces/027-field-jacket/olive-still.jpg` and restart dev to replace its placeholder
with a blur-up photograph.

`bun test` reports every missing key, deduplicated and grouped by the delivery
priority in #11 (188 shots in total). Missing imagery never fails the test.
