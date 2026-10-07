# Catalog access layer

Pages and browser stores import from `@/lib/catalog`. The catalog is synchronous,
pure TypeScript and independent of Next.js, React and browser APIs. It contains
the roster from #6 and the four-shot Colourway galleries amended by #11.

| Query                                | Result                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `getCategories()`, `getCategory(id)` | Navigation Categories and their size guides                                   |
| `getCloths()`, `getCloth(id)`        | Cloth facts and browse copy                                                   |
| `getPiece(id)`                       | A Piece by garment slug, or `undefined`                                       |
| `getCollection(filter?)`             | Filtered Pieces in Featured order by default                                  |
| `getLookbook()`, `getLooks()`        | Ordered cover, Look and Interstitial frames; Looks alone                      |
| `getLook(id)`                        | A Look by `look-03` or zero-padded number `03`, or `undefined`                |
| `getWornIn(pieceId)`                 | Reverse lookup of Looks, in Lookbook order                                    |
| `getColorCount(pieceId)`             | Colourway count; `0` for an unknown Piece                                     |
| `getFeaturedPiece()`                 | Piece with the lowest Featured rank: Field Jacket, No. 027                    |
| `getRelatedPieces(pieceId)`          | Up to 3 other Pieces: same Category first, then same Cloth, in Featured order |
| `search(query)`                      | `{ pieces, suggestions }`, matching name, Category and Cloth                  |

All results are readonly and frozen, including nested objects. Derived values
are calculated by the access layer and never stored on a Piece.

```ts
import { getCollection, getPiece, getWornIn } from "@/lib/catalog";

const jacket = getPiece("field-jacket");
const looks = getWornIn("field-jacket");
const collection = getCollection({
  category: "outerwear",
  cloth: "waxed-cotton",
  color: "olive",
  size: "M",
  sort: "price-asc",
});
```

Filters intersect. Category and Cloth use ids; sizes are strings, including
waist and US boot sizes. Colour accepts either its id (`red-check`) or name
(`Red Check`), case-insensitively. Cloth, size and colour also take a list,
which matches any of its values (`cloth: ["waxed-cotton", "moleskin"]`); an
empty list is no filter. A size must be available in a selected Colourway;
without a colour filter, availability in any Colourway is sufficient.
Sort values are `featured`, `price-asc` and `price-desc`. Price ties use Featured
rank, then Piece number, so ordering remains stable across queries.

Search trims whitespace and matches case-insensitive substrings. A blank query
returns an idle result with no suggestions. A nonblank query with no matches
suggests the first 3 navigation Categories. Unknown Piece ids yield empty
Worn in and related lists.

The Cloth facts retain #6's explicit selvedge exception: shirts weigh 8oz;
the other denim Pieces weigh 13.5oz. The remaining shared weight, composition
and finish values are consistent. Proof rows use newline-separated text for
construction and the repair promise. Boot-only rows follow `REPAIR`.

Image keys are paths under `public/images` without an extension. Gallery order
is `still`, `front`, `back`, `detail`. The catalog supplies 185 unique keys:
156 gallery images, 16 Look images/crops, 11 Category/Cloth images and
2 Interstitials. Hero and 404 imagery belong to the editorial image pipeline
(#22), rather than a catalog entity.

## Testing pattern

Run `bun test` (or `bun run test`). `lib/catalog/catalog.test.ts` tests Seam 1
from #19 exclusively through `@/lib/catalog`'s public queries. Expected roster,
Look pairings, sold-out sizes and Cloth facts come from the specification.
Tests do not import the storage module or assert its internal layout. Follow
the same pattern when extending the catalog queries. Image manifest generation
and missing-file diagnostics belong to the image pipeline in #22.
