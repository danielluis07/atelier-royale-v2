import { describe, expect, test } from "bun:test";
import {
  getCategories,
  getCategory,
  getCloths,
  getCloth,
  getCollection,
  getColorCount,
  getFeaturedPiece,
  getLook,
  getLookbook,
  getLooks,
  getPiece,
  getRelatedPieces,
  getWornIn,
  search,
  type CategoryId,
  type Piece,
  type ProofLabel,
} from "./index";

const ids = (pieces: readonly Piece[]) => pieces.map((piece) => piece.id);

// Literal expectations come from #6, rather than the module's storage format.
const roster = [
  [
    "014",
    "Chore Jacket",
    "outerwear",
    "selvedge-denim",
    420,
    ["Indigo", "Ecru"],
    undefined,
  ],
  [
    "027",
    "Field Jacket",
    "outerwear",
    "waxed-cotton",
    560,
    ["Olive", "Tobacco", "Navy"],
    undefined,
  ],
  [
    "031",
    "Cruiser Jacket",
    "outerwear",
    "waxed-cotton",
    520,
    ["Tobacco", "Black"],
    undefined,
  ],
  [
    "046",
    "Work Coat",
    "outerwear",
    "moleskin",
    480,
    ["Slate", "Moss"],
    undefined,
  ],
  [
    "052",
    "Rider Jacket",
    "outerwear",
    "selvedge-denim",
    440,
    ["Indigo"],
    "NEW",
  ],
  [
    "068",
    "Mill Overshirt",
    "outerwear",
    "brushed-flannel",
    420,
    ["Grey Check"],
    "LAST OF THE CLOTH",
  ],
  [
    "073",
    "Leather Work Jacket",
    "outerwear",
    "full-grain-leather",
    620,
    ["Saddle"],
    undefined,
  ],
  [
    "101",
    "Work Shirt",
    "shirts",
    "selvedge-denim",
    185,
    ["Indigo", "Ecru"],
    undefined,
  ],
  [
    "104",
    "Western Shirt",
    "shirts",
    "selvedge-denim",
    195,
    ["Indigo"],
    undefined,
  ],
  [
    "112",
    "Flannel Shirt",
    "shirts",
    "brushed-flannel",
    175,
    ["Grey Check", "Red Check", "Green Check"],
    undefined,
  ],
  ["118", "Popover Shirt", "shirts", "brushed-flannel", 180, ["Oat"], "NEW"],
  [
    "125",
    "Moleskin Shirt",
    "shirts",
    "moleskin",
    210,
    ["Slate", "Tobacco"],
    undefined,
  ],
  [
    "131",
    "Straight Jean",
    "trousers",
    "selvedge-denim",
    240,
    ["Indigo", "Rinsed"],
    undefined,
  ],
  [
    "137",
    "Double-Knee Trouser",
    "trousers",
    "waxed-cotton",
    260,
    ["Olive"],
    undefined,
  ],
  [
    "140",
    "Work Trouser",
    "trousers",
    "moleskin",
    230,
    ["Slate", "Moss"],
    undefined,
  ],
  ["146", "Fatigue Trouser", "trousers", "moleskin", 220, ["Oat"], undefined],
  [
    "152",
    "Pleated Trouser",
    "trousers",
    "brushed-flannel",
    250,
    ["Charcoal"],
    "LAST OF THE CLOTH",
  ],
  [
    "160",
    "Shetland Crew",
    "knitwear",
    "shetland-wool",
    260,
    ["Oat", "Navy", "Moss"],
    undefined,
  ],
  [
    "163",
    "Shetland Cardigan",
    "knitwear",
    "shetland-wool",
    320,
    ["Charcoal"],
    undefined,
  ],
  [
    "169",
    "Roll-Neck",
    "knitwear",
    "shetland-wool",
    290,
    ["Ecru", "Navy"],
    "NEW",
  ],
  [
    "177",
    "Engineer Boot",
    "boots",
    "full-grain-leather",
    460,
    ["Black", "Saddle"],
    undefined,
  ],
  [
    "182",
    "Service Boot",
    "boots",
    "full-grain-leather",
    400,
    ["Oxblood"],
    undefined,
  ],
  [
    "188",
    "Moc-Toe Boot",
    "boots",
    "full-grain-leather",
    420,
    ["Saddle"],
    undefined,
  ],
  ["194", "Chukka", "boots", "full-grain-leather", 380, ["Tobacco"], undefined],
];

describe("catalog integrity through its public interface", () => {
  test("offers the exact 24-Piece roster, 39 Colourways and 5 badges", () => {
    const pieces = getCollection().toSorted((a, b) =>
      a.number.localeCompare(b.number),
    );
    expect(
      pieces.map((piece) => [
        piece.number,
        piece.name,
        piece.category,
        piece.cloth,
        piece.price,
        piece.colorways.map((color) => color.name),
        piece.badge,
      ]),
    ).toEqual(roster);
    expect(
      pieces.reduce((sum, piece) => sum + getColorCount(piece.id), 0),
    ).toBe(39);
    expect(pieces.filter((piece) => piece.badge)).toHaveLength(5);
    expect(new Set(pieces.map((piece) => piece.number)).size).toBe(24);
    expect(new Set(pieces.map((piece) => piece.id)).size).toBe(24);
    for (const piece of pieces) {
      expect(piece.number).toMatch(/^\d{3}$/);
      expect(Number(piece.number)).toBeGreaterThanOrEqual(1);
      expect(Number(piece.number)).toBeLessThanOrEqual(199);
      expect(piece.colorways.length).toBeGreaterThanOrEqual(1);
      expect(piece.colorways.length).toBeLessThanOrEqual(3);
      expect(piece.story.length).toBeGreaterThan(0);
    }
  });

  test("Categories have the agreed split, price bands, ordered sizes and size guides", () => {
    const bands: Record<CategoryId, readonly [number, number, number]> = {
      outerwear: [7, 420, 620],
      shirts: [5, 165, 210],
      trousers: [5, 210, 260],
      knitwear: [3, 240, 320],
      boots: [4, 380, 460],
    };
    expect(getCategories().map((category) => category.id)).toEqual([
      "outerwear",
      "shirts",
      "trousers",
      "knitwear",
      "boots",
    ]);
    for (const category of getCategories()) {
      const [count, min, max] = bands[category.id];
      const collection = getCollection({ category: category.id });
      expect(collection).toHaveLength(count);
      expect(getCategory(category.id)).toEqual(category);
      expect(category.intro.length).toBeGreaterThan(0);
      expect(category.sizeGuide.unit).toBe("inches");
      expect(category.sizeGuide.rows.map((row) => row.size)).toEqual([
        ...category.sizes,
      ]);
      for (const row of category.sizeGuide.rows) {
        expect(row.measurements).toHaveLength(
          category.sizeGuide.columns.length,
        );
        expect(row.measurements.every((value) => value > 0)).toBe(true);
      }
      for (const piece of collection) {
        expect(Number.isInteger(piece.price)).toBe(true);
        expect(piece.price).toBeGreaterThanOrEqual(min);
        expect(piece.price).toBeLessThanOrEqual(max);
      }
      expect(category.sizes).toEqual(
        category.id === "boots"
          ? ["7", "8", "9", "10", "11", "12", "13"]
          : category.id === "trousers"
            ? ["28", "30", "32", "34", "36", "38"]
            : ["S", "M", "L", "XL", "XXL"],
      );
    }
    expect(
      getCategory("trousers")!.sizeGuide.rows.every(
        (row) => row.measurements[1] === 34,
      ),
    ).toBe(true);
    expect(getCategory("trousers")!.sizeGuide.note).toContain(
      "chain-stitched to length on request",
    );
  });

  test("6 shared Cloths preserve fixed facts and the shirt-weight exception", () => {
    expect(
      getCloths().map((cloth) => [
        cloth.id,
        cloth.facts.weight,
        cloth.facts.composition,
        cloth.facts.finish,
        cloth.facts.shirtWeight,
      ]),
    ).toEqual([
      ["waxed-cotton", "10oz", "100% cotton", "paraffin wax finish", undefined],
      ["selvedge-denim", "13.5oz", "100% cotton", "rope-dyed indigo", "8oz"],
      ["moleskin", "12oz", "100% cotton", "brushed face", undefined],
      ["brushed-flannel", "9oz", "100% cotton", "double-napped", undefined],
      [
        "shetland-wool",
        "3-ply",
        "100% Shetland wool",
        "natural wool face",
        undefined,
      ],
      [
        "full-grain-leather",
        "2mm",
        "100% full-grain leather",
        "vegetable-tanned",
        undefined,
      ],
    ]);
    for (const cloth of getCloths()) {
      expect(getCloth(cloth.id)).toEqual(cloth);
      expect(cloth.intro.length).toBeGreaterThan(0);
      const collection = getCollection({ cloth: cloth.id });
      expect(collection.length).toBeGreaterThanOrEqual(3);
      expect(collection.length).toBeLessThanOrEqual(5);
      for (const piece of collection) {
        const value = (label: ProofLabel) =>
          piece.proof.find((row) => row.label === label)!.value;
        expect(value("WEIGHT")).toBe(
          cloth.id === "selvedge-denim" && piece.category === "shirts"
            ? "8oz"
            : cloth.facts.weight,
        );
        expect(value("COMPOSITION")).toBe(cloth.facts.composition);
        expect(value("CLOTH")).toBe(`${cloth.name} · ${cloth.facts.finish}`);
      }
    }
  });

  test("Proof follows the fixed ledger order with footwear rows exactly on Boots", () => {
    for (const piece of getCollection()) {
      const labels = piece.proof.map((row) => row.label);
      const expected: ProofLabel[] = [
        "CLOTH",
        "WEIGHT",
        "COMPOSITION",
        "CONSTRUCTION",
      ];
      if (labels.includes("HARDWARE")) expected.push("HARDWARE");
      expected.push("FIT", "MADE IN", "CARE", "REPAIR");
      if (piece.category === "boots") expected.push("LAST", "SOLE", "WELT");
      expect(labels).toEqual(expected);
      expect(piece.proof.every((row) => row.value.trim().length > 0)).toBe(
        true,
      );
      const lines = piece.proof
        .find((row) => row.label === "CONSTRUCTION")!
        .value.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines.length).toBeLessThanOrEqual(5);
      expect(piece.proof.find((row) => row.label === "MADE IN")!.value).toBe(
        piece.category === "boots"
          ? "Hollins Weir · Goodyear welted"
          : "Hollins Weir",
      );
      expect(piece.proof.find((row) => row.label === "REPAIR")!.value).toMatch(
        /^Mended free for life\n.+/,
      );
      if (piece.category === "trousers")
        expect(piece.proof.find((row) => row.label === "FIT")!.value).toContain(
          "34in inseam, sold unhemmed; chain-stitched to length on request",
        );
    }
  });

  test("only the specified Colourway sizes are sold out; every Colourway remains buyable", () => {
    const soldOut: Record<string, readonly string[]> = {};
    for (const piece of getCollection()) {
      const sizes = getCategory(piece.category)!.sizes;
      expect(new Set(piece.colorways.map((color) => color.id)).size).toBe(
        piece.colorways.length,
      );
      for (const color of piece.colorways) {
        expect(color.swatch).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(color.soldOutSizes.length).toBeLessThan(sizes.length);
        expect(new Set(color.soldOutSizes).size).toBe(
          color.soldOutSizes.length,
        );
        expect(color.soldOutSizes.every((size) => sizes.includes(size))).toBe(
          true,
        );
        if (color.soldOutSizes.length)
          soldOut[`${piece.number}/${color.id}`] = color.soldOutSizes;
      }
    }
    expect(soldOut).toEqual({
      "027/olive": ["XL"],
      "014/indigo": ["S"],
      "112/red-check": ["M", "L"],
      "131/indigo": ["30"],
      "160/oat": ["XXL"],
      "152/charcoal": ["34"],
      "177/black": ["9", "10"],
      "188/saddle": ["11"],
    });
  });

  test("8 Looks contain the exact Colourways and wear every Piece", () => {
    const looks = getLooks();
    expect(
      looks.map((look) =>
        look.items.map((item) => [getPiece(item.piece)!.number, item.colorway]),
      ),
    ).toEqual([
      [
        ["027", "olive"],
        ["160", "navy"],
        ["112", "grey-check"],
        ["131", "indigo"],
        ["182", "oxblood"],
      ],
      [
        ["014", "indigo"],
        ["160", "oat"],
        ["140", "slate"],
        ["188", "saddle"],
      ],
      [
        ["073", "saddle"],
        ["104", "indigo"],
        ["131", "rinsed"],
        ["177", "black"],
      ],
      [
        ["046", "moss"],
        ["169", "ecru"],
        ["152", "charcoal"],
        ["194", "tobacco"],
      ],
      [
        ["031", "tobacco"],
        ["101", "ecru"],
        ["137", "olive"],
        ["177", "saddle"],
      ],
      [
        ["052", "indigo"],
        ["118", "oat"],
        ["146", "oat"],
      ],
      [
        ["163", "charcoal"],
        ["125", "slate"],
        ["131", "indigo"],
        ["188", "saddle"],
      ],
      [
        ["068", "grey-check"],
        ["169", "navy"],
        ["140", "moss"],
        ["177", "black"],
      ],
    ]);
    for (const look of looks) {
      expect(getLook(look.id)).toEqual(look);
      expect(getLook(look.number)).toEqual(look);
      expect(look.caption.length).toBeGreaterThan(0);
      expect(look.items.length).toBeGreaterThanOrEqual(3);
      expect(look.items.length).toBeLessThanOrEqual(5);
      for (const item of look.items)
        expect(
          getPiece(item.piece)!.colorways.some(
            (color) => color.id === item.colorway,
          ),
        ).toBe(true);
    }
    for (const piece of getCollection())
      expect(getWornIn(piece.id).length).toBeGreaterThan(0);
  });

  test("the FW26 Lookbook opens on a cover and places its 2 Interstitials between Looks", () => {
    const book = getLookbook();
    expect(book.season).toBe("Fall/Winter 2026");
    expect(book.seasonLabel).toBe("FW26");
    expect(
      book.frames.map((frame) => (frame.kind === "cover" ? "cover" : frame.id)),
    ).toEqual([
      "cover",
      "look-01",
      "look-02",
      "look-03",
      "woods",
      "look-04",
      "look-05",
      "look-06",
      "river",
      "look-07",
      "look-08",
    ]);
    expect(book.frames[0]).toEqual({
      kind: "cover",
      title: "FW26 · Hollins Weir",
    });
    expect(getLooks().map((look) => look.aspect)).toEqual([
      "4:5",
      "4:5",
      "3:2",
      "4:5",
      "3:2",
      "4:5",
      "4:5",
      "3:2",
    ]);
    expect(
      book.frames
        .filter((frame) => frame.kind === "interstitial")
        .map((frame) => frame.aspect),
    ).toEqual(["4:5", "3:2"]);
  });

  test("image keys are unique, lowercase kebab-case and follow #11's 4-shot gallery", () => {
    const keys = [
      ...getCategories().map((category) => category.tileImage),
      ...getCloths().map((cloth) => cloth.image),
      ...getLookbook().frames.flatMap((frame) =>
        frame.kind === "cover"
          ? []
          : frame.kind === "look"
            ? [frame.image, frame.squareImage]
            : [frame.image],
      ),
    ];
    for (const piece of getCollection()) {
      for (const color of piece.colorways) {
        for (const shot of ["still", "front", "back", "detail"] as const) {
          const key = color.images[shot];
          expect(key).toBe(
            `pieces/${piece.number}-${piece.id}/${color.id}-${shot}`,
          );
          keys.push(key);
        }
      }
    }
    expect(keys).toHaveLength(185); // 156 galleries + 16 Look frames/crops + 11 browse + 2 Interstitials.
    expect(new Set(keys).size).toBe(185);
    for (const key of keys)
      expect(key).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)+$/,
      );
  });
});

describe("Collection queries", () => {
  test("filters by Category and Cloth together", () => {
    expect(
      ids(getCollection({ category: "shirts", cloth: "selvedge-denim" })),
    ).toEqual(["work-shirt", "western-shirt"]);
    expect(ids(getCollection({ cloth: "waxed-cotton" }))).toEqual([
      "field-jacket",
      "cruiser-jacket",
      "double-knee-trouser",
    ]);
    expect(
      getCollection({ category: "boots", cloth: "shetland-wool" }),
    ).toEqual([]);
  });

  test("size filters require an available size in the matching Colourway", () => {
    expect(
      ids(getCollection({ category: "outerwear", color: "Olive", size: "XL" })),
    ).toEqual([]);
    expect(
      ids(getCollection({ category: "outerwear", color: "olive", size: "M" })),
    ).toEqual(["field-jacket"]);
    expect(ids(getCollection({ category: "outerwear", size: "XL" }))).toContain(
      "field-jacket",
    );
    expect(
      ids(getCollection({ category: "shirts", color: "red-check", size: "M" })),
    ).toEqual([]);
    expect(
      ids(
        getCollection({ category: "shirts", color: " Red Check ", size: "S" }),
      ),
    ).toEqual(["flannel-shirt"]);
    expect(
      ids(getCollection({ category: "boots", color: "black", size: "9" })),
    ).toEqual([]);
    expect(ids(getCollection({ category: "boots", size: "9" }))).toContain(
      "engineer-boot",
    );
    expect(ids(getCollection({ category: "trousers", size: "34" }))).toEqual([
      "straight-jean",
      "double-knee-trouser",
      "work-trouser",
      "fatigue-trouser",
    ]);
    expect(getCollection({ category: "boots", size: "M" })).toEqual([]);
    expect(getCollection({ color: "purple" })).toEqual([]);
  });

  test("several values in one group match any of them; groups still intersect", () => {
    expect(
      ids(getCollection({ cloth: ["waxed-cotton", "moleskin"] })),
    ).toEqual(ids(getCollection()).filter((id) => {
      const cloth = getPiece(id)!.cloth;
      return cloth === "waxed-cotton" || cloth === "moleskin";
    }));
    expect(
      ids(getCollection({ category: "outerwear", cloth: ["waxed-cotton", "moleskin"] })),
    ).toEqual(["field-jacket", "cruiser-jacket", "work-coat"]);
    // Olive is sold out in XL, Tobacco is not: a size and a colour must meet
    // in one Colourway, but any selected pair will do.
    expect(
      ids(getCollection({ category: "outerwear", color: ["olive"], size: ["XL"] })),
    ).toEqual([]);
    expect(
      ids(
        getCollection({
          category: "outerwear",
          color: ["olive", "Tobacco"],
          size: ["XL"],
        }),
      ),
    ).toContain("field-jacket");
    expect(
      ids(getCollection({ category: "boots", color: ["black"], size: ["9", "11"] })),
    ).toEqual(["engineer-boot"]);
    expect(ids(getCollection({ size: ["M", "34"] }))).toEqual(
      ids(getCollection()).filter(
        (id) =>
          getCollection({ size: "M" }).some((piece) => piece.id === id) ||
          getCollection({ size: "34" }).some((piece) => piece.id === id),
      ),
    );
    expect(getCollection({ cloth: [], size: [], color: [] })).toEqual(
      getCollection(),
    );
  });

  test("Featured and price sorts are stable and leave later queries unchanged", () => {
    const featured = ids(getCollection());
    expect(featured[0]).toBe("field-jacket");
    const low = getCollection({ sort: "price-asc" });
    const high = getCollection({ sort: "price-desc" });
    expect(low.map((piece) => piece.price)).toEqual([
      175, 180, 185, 195, 210, 220, 230, 240, 250, 260, 260, 290, 320, 380, 400,
      420, 420, 420, 440, 460, 480, 520, 560, 620,
    ]);
    expect(high.map((piece) => piece.price)).toEqual([
      620, 560, 520, 480, 460, 440, 420, 420, 420, 400, 380, 320, 290, 260, 260,
      250, 240, 230, 220, 210, 195, 185, 180, 175,
    ]);
    expect(ids(low.filter((piece) => piece.price === 420))).toEqual([
      "chore-jacket",
      "mill-overshirt",
      "moc-toe-boot",
    ]);
    expect(ids(high.filter((piece) => piece.price === 420))).toEqual([
      "chore-jacket",
      "mill-overshirt",
      "moc-toe-boot",
    ]);
    expect(ids(getCollection())).toEqual(featured);
    expect(
      ids(getCollection({ category: "shirts", sort: "price-desc" })),
    ).toEqual([
      "moleskin-shirt",
      "western-shirt",
      "work-shirt",
      "popover-shirt",
      "flannel-shirt",
    ]);
  });
});

describe("derived values and search", () => {
  test("Worn in resolves Looks in Lookbook order, including repeated Pieces", () => {
    expect(getWornIn("straight-jean").map((look) => look.number)).toEqual([
      "01",
      "03",
      "07",
    ]);
    expect(getWornIn("engineer-boot").map((look) => look.number)).toEqual([
      "03",
      "05",
      "08",
    ]);
    expect(getWornIn("field-jacket").map((look) => look.number)).toEqual([
      "01",
    ]);
  });

  test("the featured Piece is No. 027 and colour counts come from the Piece", () => {
    expect(getFeaturedPiece().id).toBe("field-jacket");
    expect(getFeaturedPiece().number).toBe("027");
    expect(getColorCount("field-jacket")).toBe(3);
    expect(getColorCount("chukka")).toBe(1);
  });

  test("related Pieces prioritize Category then Cloth, exclude the current Piece and cap at 3", () => {
    expect(ids(getRelatedPieces("field-jacket"))).toEqual([
      "chore-jacket",
      "cruiser-jacket",
      "work-coat",
    ]);
    expect(ids(getRelatedPieces("shetland-crew"))).toEqual([
      "shetland-cardigan",
      "roll-neck",
    ]);
    expect(ids(getRelatedPieces("moleskin-shirt"))).toEqual([
      "work-shirt",
      "western-shirt",
      "flannel-shirt",
    ]);
  });

  test("search matches case-insensitive substrings of Piece name, Category and Cloth", () => {
    expect(ids(search("  FiElD  ").pieces)).toEqual(["field-jacket"]);
    expect(ids(search("SHIRT").pieces)).toEqual([
      "mill-overshirt",
      "work-shirt",
      "western-shirt",
      "flannel-shirt",
      "popover-shirt",
      "moleskin-shirt",
    ]);
    expect(ids(search("outER").pieces)).toEqual([
      "field-jacket",
      "chore-jacket",
      "cruiser-jacket",
      "work-coat",
      "rider-jacket",
      "mill-overshirt",
      "leather-work-jacket",
    ]);
    expect(ids(search("waxed").pieces)).toEqual([
      "field-jacket",
      "cruiser-jacket",
      "double-knee-trouser",
    ]);
    expect(ids(search("selvedge").pieces)).toEqual([
      "chore-jacket",
      "rider-jacket",
      "work-shirt",
      "western-shirt",
      "straight-jean",
    ]);
    expect(search("field").suggestions).toEqual([]);
    expect(search("olive").pieces).toEqual([]); // Colourway is not a search field.
  });

  test("no matches offer 3 Category exits; blank queries are idle", () => {
    expect(search("not-here").pieces).toEqual([]);
    expect(
      search("not-here").suggestions.map((category) => category.id),
    ).toEqual(["outerwear", "shirts", "trousers"]);
    expect(search(" \n ")).toEqual({ pieces: [], suggestions: [] });
  });

  test("unknown ids have safe empty results", () => {
    expect(getPiece("missing")).toBeUndefined();
    expect(getLook("09")).toBeUndefined();
    expect(getWornIn("missing")).toEqual([]);
    expect(getRelatedPieces("missing")).toEqual([]);
    expect(getColorCount("missing")).toBe(0);
  });

  test("callers cannot alter catalog facts used by subsequent queries", () => {
    const jacket = getPiece("field-jacket")!;
    expect(() => Object.assign(jacket, { price: 1 })).toThrow();
    expect(() =>
      Object.assign(jacket.colorways[0].soldOutSizes, { 0: "M" }),
    ).toThrow();
    expect(() =>
      Object.assign(getLook("01")!.items[0], { colorway: "navy" }),
    ).toThrow();
    expect(getPiece("field-jacket")!.price).toBe(560);
    expect(
      getCollection({ category: "outerwear", color: "olive", size: "XL" }),
    ).toEqual([]);
    expect(getLook("01")!.items[0].colorway).toBe("olive");
  });
});
