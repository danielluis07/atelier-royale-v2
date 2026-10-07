export type CategoryId =
  "outerwear" | "shirts" | "trousers" | "knitwear" | "boots";
export type ClothId =
  | "waxed-cotton"
  | "selvedge-denim"
  | "moleskin"
  | "brushed-flannel"
  | "shetland-wool"
  | "full-grain-leather";
export type Size =
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "28"
  | "30"
  | "32"
  | "34"
  | "36"
  | "38"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13";
export type ProofLabel =
  | "CLOTH"
  | "WEIGHT"
  | "COMPOSITION"
  | "CONSTRUCTION"
  | "HARDWARE"
  | "FIT"
  | "MADE IN"
  | "CARE"
  | "REPAIR"
  | "LAST"
  | "SOLE"
  | "WELT";
export type ImageAspect = "1:1" | "4:5" | "3:2";

export interface SizeGuide {
  readonly unit: "inches";
  readonly columns: readonly string[];
  readonly rows: readonly {
    readonly size: Size;
    readonly measurements: readonly number[];
  }[];
  readonly note: string;
}

export interface Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly intro: string;
  readonly sizes: readonly Size[];
  readonly sizeGuide: SizeGuide;
  readonly tileImage: string;
}

export interface Cloth {
  readonly id: ClothId;
  readonly name: string;
  readonly intro: string;
  readonly facts: {
    readonly weight: string;
    readonly shirtWeight?: string;
    readonly composition: string;
    readonly finish: string;
  };
  readonly image: string;
}

export interface Colorway {
  readonly id: string;
  readonly name: string;
  readonly swatch: string;
  readonly images: {
    readonly still: string;
    readonly front: string;
    readonly back: string;
    readonly detail: string;
  };
  readonly soldOutSizes: readonly Size[];
}

export interface ProofRow {
  readonly label: ProofLabel;
  readonly value: string;
}

export interface Piece {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly category: CategoryId;
  readonly cloth: ClothId;
  readonly price: number;
  readonly badge?: "NEW" | "LAST OF THE CLOTH";
  readonly story: string;
  readonly proof: readonly ProofRow[];
  readonly featuredRank: number;
  readonly colorways: readonly Colorway[];
}

export interface Look {
  readonly kind: "look";
  readonly id: string;
  readonly number: string;
  readonly caption: string;
  readonly image: string;
  readonly squareImage: string;
  readonly aspect: ImageAspect;
  readonly items: readonly {
    readonly piece: string;
    readonly colorway: string;
  }[];
}

export interface Interstitial {
  readonly kind: "interstitial";
  readonly id: string;
  readonly image: string;
  readonly aspect: ImageAspect;
  readonly caption: string;
}

export interface LookbookCover {
  readonly kind: "cover";
  readonly title: string;
}

export interface Lookbook {
  readonly season: string;
  readonly seasonLabel: string;
  readonly intro: string;
  readonly frames: readonly (LookbookCover | Look | Interstitial)[];
}

export type CollectionSort = "featured" | "price-asc" | "price-desc";
/** One value or several; several match any of them, and an empty list is no filter. */
export type FilterValue<T> = T | readonly T[];
export interface CollectionFilter {
  readonly category?: CategoryId;
  readonly cloth?: FilterValue<ClothId>;
  readonly size?: FilterValue<Size>;
  readonly color?: FilterValue<string>;
  readonly sort?: CollectionSort;
}

export interface SearchResult {
  readonly pieces: readonly Piece[];
  readonly suggestions: readonly Category[];
}
