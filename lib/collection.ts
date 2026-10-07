import {
  getCategories,
  getCategory,
  getCloth,
  getCloths,
  getCollection,
  type CategoryId,
  type Cloth,
  type ClothId,
  type CollectionSort,
  type Size,
} from "@/lib/catalog";
import { routes } from "@/lib/routes";

// The Collection's filter and sort state lives in the URL (`cat`, `cloth`,
// `size`, `colour` or `color`, `sort`). Repeating a key selects several values
// in one group. Unknown values are dropped, so a stale or hand-edited link
// still lands on a sensible Collection.

export interface CollectionQuery {
  readonly category?: CategoryId;
  readonly cloths: readonly ClothId[];
  readonly sizes: readonly Size[];
  /** Colourway ids, e.g. `red-check`. */
  readonly colors: readonly string[];
  readonly sort: CollectionSort;
}

export const sortOptions: readonly { value: CollectionSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const emptyQuery: CollectionQuery = {
  cloths: [],
  sizes: [],
  colors: [],
  sort: "featured",
};

interface ColorOption {
  readonly id: string;
  readonly name: string;
  readonly swatch: string;
}

/** Colourways keyed by id and lowercased name, both accepted in the URL. */
function colorIndex(category?: CategoryId): Map<string, ColorOption> {
  const index = new Map<string, ColorOption>();
  for (const piece of getCollection({ category })) {
    for (const { id, name, swatch } of piece.colorways) {
      if (index.has(id)) continue;
      index.set(id, { id, name, swatch });
      index.set(name.toLowerCase(), { id, name, swatch });
    }
  }
  return index;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export function parseCollectionQuery(params: {
  getAll(name: string): string[];
}): CollectionQuery {
  const category = getCategories().find(
    (entry) => entry.id === params.getAll("cat")[0],
  )?.id;
  const clothIds = new Set<string>(getCloths().map((cloth) => cloth.id));
  const offeredSizes = new Set<string>(
    category
      ? getCategory(category)!.sizes
      : getCategories().flatMap((entry) => entry.sizes),
  );
  const colors = colorIndex();
  const sort = sortOptions.find(
    (option) => option.value === params.getAll("sort")[0],
  )?.value;

  return {
    category,
    cloths: unique(params.getAll("cloth")).filter((id): id is ClothId =>
      clothIds.has(id),
    ),
    sizes: unique(params.getAll("size")).filter((size): size is Size =>
      offeredSizes.has(size),
    ),
    colors: unique(
      [...params.getAll("colour"), ...params.getAll("color")]
        .map((value) => colors.get(value.trim().toLowerCase())?.id)
        .filter((id) => id !== undefined),
    ),
    sort: sort ?? "featured",
  };
}

/** The canonical URL for a query: fixed key order, defaults left out. */
export function collectionHref(query: CollectionQuery): string {
  const params = new URLSearchParams();
  if (query.category) params.append("cat", query.category);
  for (const cloth of query.cloths) params.append("cloth", cloth);
  for (const size of query.sizes) params.append("size", size);
  for (const color of query.colors) params.append("colour", color);
  if (query.sort !== "featured") params.append("sort", query.sort);
  const search = params.toString();
  return search ? `${routes.shop}?${search}` : routes.shop;
}

/** Switching Category keeps every filter except sizes the new Category lacks. */
export function withCategory(
  query: CollectionQuery,
  category: CategoryId | undefined,
): CollectionQuery {
  const sizes = category ? getCategory(category)!.sizes : undefined;
  return {
    ...query,
    category,
    sizes: sizes
      ? query.sizes.filter((size) => sizes.includes(size))
      : query.sizes,
  };
}

export function toggle<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

export function activeFilterCount(query: CollectionQuery): number {
  return query.cloths.length + query.sizes.length + query.colors.length;
}

/** Clears size, colour and Cloth; the Category and sort stay. */
export function withoutFilters(query: CollectionQuery): CollectionQuery {
  return { ...query, cloths: [], sizes: [], colors: [] };
}

/** One Category or one Cloth gives the page its name and intro line. */
export function describeCollection(query: CollectionQuery): {
  kicker: string;
  title: string;
  intro: string;
} {
  if (query.category) {
    const category = getCategory(query.category)!;
    return { kicker: "Category", title: category.name, intro: category.intro };
  }
  if (query.cloths.length === 1) {
    const cloth = getCloth(query.cloths[0])!;
    return { kicker: "Cloth", title: cloth.name, intro: cloth.intro };
  }
  return {
    kicker: "Collection",
    title: "All Pieces",
    intro:
      "Jackets, shirts, trousers, knitwear and boots. Cut and sewn at Hollins Weir.",
  };
}

export interface SizeGroup {
  readonly label: string;
  readonly sizes: readonly Size[];
}

export interface FilterOptions {
  readonly sizes: readonly SizeGroup[];
  readonly colors: readonly ColorOption[];
  readonly cloths: readonly Cloth[];
}

/**
 * Options follow the Category only, so they hold still while other filters
 * change; a selected colour or Cloth from outside it stays listed so it can be
 * unticked. Without a Category, sizes are grouped by the Categories that share
 * a size run (tops, waists, boots).
 */
export function getFilterOptions(
  category?: CategoryId,
  selected: Pick<CollectionQuery, "colors" | "cloths"> = emptyQuery,
): FilterOptions {
  const categories = category ? [getCategory(category)!] : getCategories();
  const runs = new Map<string, { names: string[]; sizes: readonly Size[] }>();
  for (const entry of categories) {
    const key = entry.sizes.join(",");
    const run = runs.get(key);
    if (run) run.names.push(entry.name);
    else runs.set(key, { names: [entry.name], sizes: entry.sizes });
  }
  const scope = getCollection({ category });
  const allColors = colorIndex();
  const colors = [
    ...colorIndex(category).values(),
    ...selected.colors.map((id) => allColors.get(id)!),
  ].filter(
    (color, index, all) => all.findIndex((entry) => entry.id === color.id) === index,
  );

  return {
    sizes: [...runs.values()].map((run) => ({
      label: run.names.join(", "),
      sizes: run.sizes,
    })),
    colors,
    cloths: getCloths().filter(
      (cloth) =>
        selected.cloths.includes(cloth.id) ||
        scope.some((piece) => piece.cloth === cloth.id),
    ),
  };
}
