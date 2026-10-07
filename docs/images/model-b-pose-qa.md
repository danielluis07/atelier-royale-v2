# Model B: front pose revisions

The owner's review requested a distinct stationary standing pose for every
catalog front shot of the established Spanish model. Six approved front
photographs were edited with the built-in imagegen tool and replaced at
their existing catalog filenames. No obsolete copies remain in `public/images/`.

| Front image key | Pose |
|---|---|
| `pieces/014-chore-jacket/ecru-front` | Torso angled, one hand in a trouser pocket, opposite arm down |
| `pieces/027-field-jacket/tobacco-front` | Both hands in lower jacket pockets, elbows bent outward |
| `pieces/046-work-coat/slate-front` | Hands behind the back, shoulders open |
| `pieces/046-work-coat/moss-front` | One hand on the hip, elbow outward, opposite arm down |
| `pieces/068-mill-overshirt/grey-check-front` | One hand adjusting the opposite sleeve cuff at waist level |
| `pieces/073-leather-work-jacket/saddle-front` | One hand touching the collar, opposite hand in a trouser pocket |

Each edit references the approved earlier photograph at the same key to
preserve identity, clothing, underlayers, hardware, stone backdrop and grade.
Model B remains clean-shaven with long dark-brown hair tied at the nape.
The owner requested front-image changes; back and detail views retain their
existing poses, model and garments from the same studio direction.

The [six-image contact sheet](model-b-pose-contact.jpg) shows the final poses.
[Delivery-resolution spot checks](model-b-pose-spot.jpg) show hands, cuffs,
hardware and pocket edges in 512-pixel crops without resizing. Both sheets
were reviewed: the arm placements are distinct, the main garment features
remain readable, and no visible extra fingers or floating hardware were
found in the inspected regions. The Moss pose partly covers its lower pocket,
as expected when the hand rests on the hip; the other gallery views show it.

The [exact prompts](model-b-pose-prompts.json) record source and delivery
dimensions for all six replacements. These are the latest production records
for these keys, superseding the corresponding batch 2 and batch 4a front
prompts. JPEG output is sRGB at quality 85 and 2048 × 2048. Smaller native
sources were resampled for delivery; resampling adds no native detail.

Validation:

- Regenerated `lib/images/manifest.json`: 107 JPEGs, including updated blur
  placeholders for all six replaced fronts.
- All six files validated as 2048 × 2048 sRGB JPEGs with matching manifest
  dimensions and JPEG blur metadata.
- `bun test`: 52 passed, zero failed; no missing Outerwear gallery keys.
- Refreshed all three batch 4a gallery contact sheets and their spot checks
  so they show the current images.
- No application source code changed. This revision did not rerun the build
  or browser performance measurements; the initial batch's build diagnostic
  and production-image checks are recorded in `batch-04a-qa.md`.
