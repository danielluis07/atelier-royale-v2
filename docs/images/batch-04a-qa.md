# Outerwear galleries: batch 4a

Issue #37 delivers 27 new on-body JPEGs under `public/images/pieces/`, using
the exact catalog keys. Together with the existing still lifes and Field
Jacket galleries, all seven Outerwear Pieces have four images in every
Colourway: 48 images across 12 Colourways. The initial batch added missing
images. The owner's subsequent [pose review](model-b-pose-qa.md) replaces
Model B's five batch 4a fronts and the earlier Tobacco Field Jacket front.

## Cast and shot list

Model A reuses `looks/look-02-square`; Model B reuses `looks/look-03-square`.
Their identities follow batch 1's continuity note, including Model B's
clean-shaven face and long dark hair tied at the nape. Each Colourway's front
shot references its existing still life and cast photograph. Its back and
detail reference that front shot, preserving the same model and session.
The owner withdrew the request to introduce and replace models.

All photographs use a blank seamless stone studio backdrop (`#F3F1EC`),
stationary standing poses, diffused daylight and a muted film-like grade,
following the current catalog direction in `DESIGN.md`. The Field Jacket is
excluded from this delivery as specified by the issue.

| Catalog directory | Colourways | Model | Worn Proof detail |
|---|---|---|---|
| `pieces/014-chore-jacket` | Indigo, Ecru | A, B respectively | Bar-tacked patch-pocket corner and stitching |
| `pieces/031-cruiser-jacket` | Tobacco, Black | A | Reinforced back yoke and double stitching |
| `pieces/046-work-coat` | Slate, Moss | B | Reinforced elbow panel and perimeter stitching |
| `pieces/052-rider-jacket` | Indigo | A | Adjustable hem tab and brass tack button |
| `pieces/068-mill-overshirt` | Grey Check | B | Square hem, side vent and seam |
| `pieces/073-leather-work-jacket` | Saddle | B | Reinforced pocket opening and lock-stitched panels |

Each Colourway supplies `<colourway>-front.jpg`, `<colourway>-back.jpg` and
`<colourway>-detail.jpg` in its directory. The existing `-still.jpg` supplies
the first gallery slot.

## Review artifacts

The contact sheets show each Colourway's still life, front, back and detail:

- [Chore Jacket and Tobacco Cruiser](batch-04a-contact-1.jpg)
- [Black Cruiser and Work Coat](batch-04a-contact-2.jpg)
- [Rider, Mill Overshirt and Leather Work Jacket](batch-04a-contact-3.jpg)

Every new image was spot-checked at delivery resolution using 512-pixel crops
without resizing. These record cloth, seams, hems and portions of hands;
the full contact sheets were also reviewed for anatomy, pocket placement,
Colourway, hardware, framing and continuity. No visible extra fingers,
floating hardware, text, logos or watermarks were found in the reviewed areas.

- [Delivery-resolution spot checks 1](batch-04a-spot-1.jpg)
- [Delivery-resolution spot checks 2](batch-04a-spot-2.jpg)
- [Delivery-resolution spot checks 3](batch-04a-spot-3.jpg)

The first Ecru front/back attempts gave Model B loose hair; they were
regenerated with his established low bun. The Ecru and Saddle front/back
views were then reframed through imagegen to crop the head at chin/nape level.
The final contact sheets and spot checks include those revisions.

## Production and validation

Generated one photograph per built-in imagegen call. No specific generation
model version is claimed because the tool does not expose a version selector.
The [prompt records](batch-04a-prompts.json) contain the initial generation
prompts, reference keys, framing revision prompts and source dimensions.
The latest Model B front prompts are in [the pose records](model-b-pose-prompts.json).

Delivery is 2048 × 2048 sRGB JPEG at quality 85, with the grade baked in.
Native outputs below the delivery size were resampled with Sharp; this meets
the delivery dimensions but does not add native photographic detail.

- `bun run images:generate`: 107 JPEGs with dimensions and blur metadata.
- All 48 Outerwear gallery images validated as square sRGB JPEGs at least
  2048 pixels wide, with matching manifest dimensions and blur data.
- `bun test`: 52 passed, zero failed. No Outerwear keys remain in the missing
  image report. The other imagery batches still account for 81 missing keys.
- Production HTTP checks: all six affected Piece routes returned 200 and
  included their first Colourway's four image URLs and blur placeholders.
- All 27 new images returned an image response with HTTP 200 from the Next.js
  image optimizer at width 640 and quality 75.
- Existing `MillraceImage` geometry, responsive sizing and blur-up rendering
  are unchanged. No browser CLS measurement or Lighthouse run was performed.
- `bun run build` compiled and completed with exit code 0, but printed a
  `/shop` prerender diagnostic about `useSearchParams()` outside Suspense.
  This diagnostic is unrelated to this imagery-only change; the existing
  page already has a Suspense boundary. The build is not claimed as a clean
  diagnostic-free validation. The affected Piece routes served successfully
  from the resulting production build.
