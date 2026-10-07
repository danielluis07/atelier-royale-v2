# Campaign imagery: batch 1

Issue #34 follows the shot brief in #11 and the scene list in #14. The catalog
is the source of truth for the eight Looks and their Colourways.

## References for later batches

- **Model A:** `public/images/looks/look-01.jpg`; lean man in his 30s, angular
  face, straight nose, short wavy dark-brown hair and short brown stubble.
  Appears in both Hero frames and Looks 01, 02, 05 and 06.
- **Model B:** `public/images/looks/look-03.jpg`; lean, sturdy man in his 50s,
  weathered lined face, broad straight nose, short salt-and-pepper hair and a
  close grey beard. Appears in Looks 03, 04, 07 and 08.
- **Craftsperson:** secondary figure in `public/images/looks/look-04.jpg` only,
  at a window-lit workbench chain-stitching a hem. Reuse that image if this
  person is needed again; do not add them to Interstitials.
- **Place and grade:** `public/images/editorial/hero-desktop.jpg` is the master
  reference. Hollins Weir has rough grey limestone, slate roofs, tall narrow
  mill windows, a low stone weir, wet cobbles and a narrow millrace, with oak,
  birch, dry-stone field walls and wooden gates nearby. No real location.

Use the relevant cast image and the master place image together as generation
references. Faces, garment construction and geography take precedence over
incidental poses. No identity-training IDs are used.

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
version selector, so no specific GPT Image version is claimed. The complete
per-shot prompts and reference keys are in `batch-01-prompts.json`.

Hero mobile is a separately composed portrait of the same scene. Square Look
companions preserve the corresponding full frame's face, outfit and setting.
Delivery is sRGB JPEG at quality 85, with the grade baked in. Sources generated
below delivery dimensions are resampled to the brief's minimum dimensions;
resampling does not add native photographic detail. Per-shot source and final
dimensions are recorded with the prompts.

The existing `MillraceImage` component supplies blur placeholders and reserves
the slot geometry using `lib/images/manifest.json`. Home, Lookbook and the 404
page implementation are separate work; this batch supplies their image keys.
