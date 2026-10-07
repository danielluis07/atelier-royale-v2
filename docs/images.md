# Campaign imagery

Batch 1 delivers the Hero frames, eight Looks and their square companions,
two Interstitials and the 404 weir photograph (21 JPEGs). Reuse the cast and
place references in [the continuity note](images/batch-01-continuity.md) for
later batches; [the prompt records](images/batch-01-prompts.json) include the
outfits and native versus delivery dimensions. Run `bun test` to validate
these slots and their blur metadata.

Batch 2 delivers all 48 catalog images required by issue #35: three complete
Field Jacket galleries and the other 36 Colourway still lifes. Review the
[first-half contact sheet](images/batch-02-first-half.jpg),
[second-half contact sheet](images/batch-02-second-half.jpg),
[cast and production rules](images/batch-02-continuity.md),
[prompt records](images/batch-02-prompts.json), [first-half QA](images/batch-02-qa.md)
and [second-half QA](images/batch-02-second-half-qa.md).
All catalog photography uses a blank stone background, including model shots.
Upcoming model shots use deliberate stationary standing poses. The owner's
[three new men](images/next-model-cast.md) supply the Shirts cast in batch 4b.

Batch 3 supplies the five Category tiles and six *By cloth* photographs for
issue #36. Review the [labeled contact sheet](images/batch-03-contact-sheet.jpg),
[production and verification notes](images/batch-03-qa.md), and
[prompt records](images/batch-03-prompts.json). The Category portraits use
Model A from batch 1 and the owner's replacement redhead, a man in his mid-40s
with short hair and a medium beard; the Cloth close-ups use the catalog's material
facts and batch 2 still lifes as references. The owner reviewed the imagery
and approved the replacement redhead for Shirts and Knitwear.

Batch 4a completes the Outerwear on-body galleries for issue #37: 27 new
front, back and worn Proof-detail photographs across nine Colourways. The
existing Field Jacket galleries and all still lifes remain in place. Models
A and B from batch 1 supply the cast; no new models were introduced. Review
the [delivery and QA notes](images/batch-04a-qa.md), which link the three
contact sheets, delivery-resolution spot checks and exact prompt records.
Every Outerwear Colourway now has its four catalog squares and blur metadata.

After review, Model B's six catalog fronts received distinct standing poses,
including the Tobacco Field Jacket front from batch 2. The replacements use
the same keys; see the [pose review and prompt records](images/model-b-pose-qa.md).

Batch 4b completes the Shirts galleries for issue #38 with 27 front, back
and worn Proof-detail photographs across nine Colourways. The owner selected
Models D (Viking appearance), E (short hair and moustache) and F (blond and
clean-shaven) for this batch. Their [identity references](images/next-model-cast.md)
are saved for future continuity. Review the [delivery and QA notes](images/batch-04b-qa.md),
contact sheets and [prompt records](images/batch-04b-prompts.json). Together
with the existing still lifes, every Shirt Colourway has four catalog squares.

Batch 4c completes the Trousers galleries for issue #39 with 21 front, back
and worn Proof-detail photographs across seven Colourways. Models A and B
from batch 1 supply the cast. Full views show the fixed 34in length and
unfinished lower edges. Review the [delivery and QA notes](images/batch-04c-qa.md),
which link the gallery contact sheets, delivery-resolution spot checks and
[prompt records](images/batch-04c-prompts.json). Every Trouser Colourway has
four catalog squares with blur metadata.

Batch 4e completes the Boots galleries for issue #41 with 15 front, rear
and worn Proof-detail photographs across five Colourways. Batch 1 cast
references A and B supply wearer continuity, with knee-down framing and
the seamless stone catalog backdrop. Review the
[delivery and QA notes](images/batch-04e-qa.md), contact sheets, delivery-pixel
spot checks and [prompt records](images/batch-04e-prompts.json). Every Boot
Colourway now has its four squares and blur metadata; all 188 Campaign keys
are present. The Portuguese website copy is preserved.

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
