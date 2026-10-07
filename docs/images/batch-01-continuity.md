# Campaign imagery: batch 1

Issue #34 follows the shot brief in #11 and the scene list in #14. The catalog
is the source of truth for the eight Looks and their Colourways.

## References for later batches

- **Model A:** `public/images/looks/look-02-square.jpg`; lean man in his mid-30s, angular
  face, straight nose, short wavy dark-brown hair and short brown stubble.
  Appears in both Hero frames and Looks 01, 02, 05 and 06.
- **Model B:** `public/images/looks/look-03-square.jpg`; Spanish man in his
  mid-30s, long dark-brown hair tied in a low bun or ponytail at the nape,
  olive complexion, broad rectangular face, strong straight brows, brown eyes,
  an aquiline nose and a substantial jaw. Clean-shaven, with a sturdy neck.
  Appears in Looks 03, 04, 07 and 08. Preserve the tied hair and distinct facial
  structure; do not derive him by aging Model A.
- **Craftsperson:** secondary figure in `public/images/looks/look-04.jpg` only,
  at a window-lit workbench chain-stitching a hem. Reuse that image if this
  person is needed again; do not add them to Interstitials.
- **Place and grade:** `public/images/editorial/interstitial-river.jpg` is the
  people-free environment reference; `public/images/editorial/hero-desktop.jpg`
  establishes the Hero composition.
  Hollins Weir has rough grey limestone, slate roofs, tall narrow
  mill windows, a low stone weir, wet cobbles and a narrow millrace, with oak,
  birch, dry-stone field walls and wooden gates nearby. No real location.

Use the relevant cast image for identity and the people-free place image for
geography and grade. Assign those roles explicitly so another face does not
leak into a new cast reference. No identity-training IDs are used.

## Gaze direction

The owner's PR revision supersedes the original Scene list's older Model B
and repeated sideways gaze. Both recurring models are now in their mid-30s.
Preserve each frame's gaze in its square companion.

| Frame | Gaze |
|---|---|
| Hero, both compositions | Model A watches the wet walkway, head aligned with his walking body |
| Look 01 | Model A looks upstream; this remains the intentional sideward frame |
| Look 02 | Model A makes direct eye contact while carrying the rope |
| Look 03 | Model B looks ahead at eye level while walking |
| Look 04 | Model B makes direct eye contact at the doorway |
| Look 05 | Model A watches the muddy track |
| Look 06 | Model A makes relaxed eye contact at the gate |
| Look 07 | Model B looks forward at eye level while carrying logs |
| Look 08 | Model B looks toward the horizon with his chin slightly raised |

Do not give Model B a downward gaze, bowed head, bald head, gray hair or beard.
Vary gaze across the campaign deliberately; do not default every shot to profile.

## Shared prompt fragment

Photorealistic, unposed workwear editorial. Soft overcast light, muted natural
color, restrained film grain, damp weathered limestone, visible cloth texture.
No orange/teal treatment, logos, lettering, watermark or decorative accessories.
Natural human anatomy and functional garment hardware. Early autumn leaves
progress to bare trees and frost across Looks 01–08. Each Look wears precisely
its catalog Colourways; layer shirts and knitwear so their collars or necklines
remain visible. Look 06 lists no footwear Piece; its incidental boots carry no
catalog identity.

## Production

Generated with the built-in imagegen tool. The tool does not expose a model
version selector, so no specific GPT Image version is claimed. GPT Image 2.5
was also attempted through Higgsfield, but generation required a paid plan.
The original prompts, reconstructed revision briefs, reference keys and
source dimensions are recorded in `batch-01-prompts.json`. Revision briefs
describe the approved changes; they are not verbatim tool prompts.

Hero mobile is a separately composed portrait of the same scene. Square Look
companions preserve the corresponding full frame's face, outfit and setting.
Delivery is sRGB JPEG at quality 85, with the grade baked in. Sources generated
below delivery dimensions are resampled to the brief's minimum dimensions;
resampling does not add native photographic detail. Per-shot source and final
dimensions are recorded with the prompts.

The existing `MillraceImage` component supplies blur placeholders and reserves
the slot geometry using `lib/images/manifest.json`. Home, Lookbook and the 404
page implementation are separate work; this batch supplies their image keys.
