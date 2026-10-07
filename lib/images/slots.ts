interface ImageSlotDefinition {
  readonly aspectRatio: string;
  readonly desktopAspectRatio?: string;
  readonly sizes: string;
  readonly highPriority: boolean;
}

// Page margins and breakpoints follow DESIGN.md. Keep these in sync with the
// consuming layouts; loading policy cannot be overridden at a call site.
// The Collection grid: 2 columns, 3 from 768, and from 1024 it shares the
// row with the filter column (9 of 12 columns).
const collectionSizes = "(min-width: 1536px) 342px, (min-width: 1024px) calc((100vw - 96px) / 4 - 16px), (min-width: 768px) calc((100vw - 104px) / 3), calc((100vw - 48px) / 2)";
// Home: the five Category tiles share one row from 1024 and scroll as a strip
// below it; the six Cloths run 2, 3, then 6 across.
const categoryTileSizes = "(min-width: 1536px) 269px, (min-width: 1024px) calc((100vw - 192px) / 5), (min-width: 768px) 40vw, 66vw";
const clothTileSizes = "(min-width: 1536px) 220px, (min-width: 1200px) calc((100vw - 216px) / 6), (min-width: 768px) calc((100vw - 104px) / 3), calc((100vw - 48px) / 2)";
const mainSizes = "(min-width: 1536px) 708px, (min-width: 1200px) calc((100vw - 120px) / 2), (min-width: 768px) calc((100vw - 84px) / 2), calc(100vw - 32px)";

export const imageSlots = {
  "home-hero": { aspectRatio: "4 / 5", desktopAspectRatio: "16 / 9", sizes: "100vw", highPriority: true },
  "piece-main": { aspectRatio: "1 / 1", sizes: mainSizes, highPriority: true },
  "piece-gallery": { aspectRatio: "1 / 1", sizes: mainSizes, highPriority: false },
  "piece-thumbnail": { aspectRatio: "1 / 1", sizes: "(min-width: 768px) 96px, 64px", highPriority: false },
  "collection-card": { aspectRatio: "1 / 1", sizes: collectionSizes, highPriority: false },
  "home-featured": { aspectRatio: "1 / 1", sizes: mainSizes, highPriority: false },
  "category-tile": { aspectRatio: "4 / 5", sizes: categoryTileSizes, highPriority: false },
  "cloth-tile": { aspectRatio: "1 / 1", sizes: clothTileSizes, highPriority: false },
  "look-portrait": { aspectRatio: "4 / 5", sizes: "(min-width: 1200px) 60vw, 85vw", highPriority: false },
  "look-landscape": { aspectRatio: "3 / 2", sizes: "(min-width: 1200px) 85vw, 100vw", highPriority: false },
  "look-square": { aspectRatio: "1 / 1", sizes: collectionSizes, highPriority: false },
  "cart-thumbnail": { aspectRatio: "1 / 1", sizes: "80px", highPriority: false },
  "look-panel-thumbnail": { aspectRatio: "1 / 1", sizes: "80px", highPriority: false },
  "search-thumbnail": { aspectRatio: "1 / 1", sizes: "64px", highPriority: false },
  "order-thumbnail": { aspectRatio: "1 / 1", sizes: "64px", highPriority: false },
  lightbox: { aspectRatio: "1 / 1", sizes: "(min-width: 768px) 80vw, 100vw", highPriority: false },
  "not-found": { aspectRatio: "3 / 2", sizes: mainSizes, highPriority: false },
} as const satisfies Record<string, ImageSlotDefinition>;

export type ImageSlot = keyof typeof imageSlots;
