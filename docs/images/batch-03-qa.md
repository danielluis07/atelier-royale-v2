# Category and Cloth imagery: batch 3

Issue #36: all 11 assets are saved at their exact catalog keys under
`public/images/`. The owner reviewed the images, approved the replacement
redhead, and authorized the pull request.
The labeled review sheet is [batch-03-contact-sheet.jpg](batch-03-contact-sheet.jpg).
The full generation and revision prompts, reference keys and dimensions are in
[batch-03-prompts.json](batch-03-prompts.json).

## Subjects and continuity

| Key | Subject and scene |
| --- | --- |
| `categories/outerwear` | Model A, No. 014 Chore Jacket Ecru, beside the limestone mill wall in the yard |
| `categories/shirts` | Mid-40s redhead with short hair and a medium beard, No. 112 Flannel Shirt Red Check, sleeves rolled, in a covered mill loading passage |
| `categories/trousers` | Model A, No. 137 Double-Knee Trouser Olive, kneeling with a wooden mallet at a field fence post; face outside the frame |
| `categories/knitwear` | Same redhead, No. 160 Shetland Crew Moss, hands in pockets beside a stone field shelter on an upland pasture |
| `categories/boots` | Model A, No. 182 Service Boot Oxblood, knee down in wet field grass beside a puddle; face outside the frame |
| `cloths/waxed-cotton` | Olive 10oz paraffin-waxed cotton, rain beads, wet gate rail at the mill |
| `cloths/selvedge-denim` | Indigo 13.5oz cotton twill, woven selvedge edge, worn mill workbench in window light |
| `cloths/moleskin` | Slate 12oz brushed cotton face, raking light on a wooden bench |
| `cloths/brushed-flannel` | Red Check 9oz double-napped cotton, stone windowsill and condensation |
| `cloths/shetland-wool` | Moss 3-ply Shetland wool, plain knit with mist droplets over a field fence post |
| `cloths/full-grain-leather` | Oxblood 2mm vegetable-tanned leather boot upper, double stitching and mud at the welt on a cobbler's bench |

The identity reference for Model A is `looks/look-02-square`. At owner review,
the long-haired Spanish Model B was replaced in both Category portraits by a
new man in his mid-40s with short copper-red hair and a medium ginger beard.
`categories/shirts` is his identity reference for `categories/knitwear`.
Both portraits also received new scenery: a covered mill loading passage
for Shirts and an upland pasture with a stone shelter for Knitwear. This owner
revision supersedes #14's cast and locations for these two Category keys.
The three new men in `next-model-cast.md` remain reserved for catalog on-body
photography. These Category images follow the editorial location direction.

The explicit Piece and Colourway assignments in #14 take precedence over
the general preference for Colourways no Look wears: Double-Knee Trouser and
Service Boot each have only one Colourway. Garment references come from batch 2.
The Service Boot still-life reference has a cap-toe seam; the new Category shot
follows the catalog's plain-toe description instead. The trouser and boot
backgrounds were revised to remove the river reference's scenery and match
their assigned fields. All six Cloth shots crop out the full
garment. Grade is baked in: soft overcast light, muted natural color and grain.

## Verification

- `bun run images:generate`: 80 source JPEGs; all 11 batch keys have metadata.
- `bun test`: 52 passed, zero failed. Priority 3, Categories and Cloths, reports
  zero missing images. The 108 missing shots belong to later on-body batches.
- Checked all 11 keys against the public catalog queries. Category images
  are exactly 1600 × 2000; Cloth images are exactly 2048 × 2048. All files
  are JPEG quality 85 in sRGB with an embedded sRGB profile.
- Checked each image's delivered dimensions against the manifest and its
  JPEG blur data. Server-rendered every key through `MillraceImage` with the
  matching `category-tile` or `cloth-tile` slot. Each produces a responsive
  image with a blur placeholder and reserved 4:5 or 1:1 geometry.
- Visually inspected every generated photograph and additional 100% delivery
  crops of garment construction, buttons, rivets, laces, knit stitches,
  textile nap and leather stitching. No obvious hand or hardware artifacts
  were found in the selected images. Review remains subjective.

## Delivery and verification limits

Generated with the built-in imagegen tool, which exposes no model version
selector. Native sources are 1122 × 1402 for portraits and 1254 × 1254 for
squares. Sources are resampled to the required delivery dimensions, with a
minimal cover crop to make portrait ratios exact. Resampling does not add
native photographic detail. Selected original sources remain in the generator's
default artifact location; the project consumes the delivered JPEGs. At the
owner's request, the three superseded Spanish-model source images generated
in this session (two Shirts versions and one Knitwear version) were deleted.
The approved redhead sources and delivered portraits are retained.

The Home route is currently a foundations stub and does not yet render
Category tiles or the *By cloth* row. This imagery batch supplies their catalog
keys and verifies the shared renderer; it does not implement those Home
sections or measure browser CLS or Lighthouse performance. Those checks remain
for the consuming page implementation. The existing manifest change was
preserved when adding this batch's entries.
