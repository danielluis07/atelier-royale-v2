import { describe, expect, test } from "bun:test";
import {
  collectionHref,
  describeCollection,
  emptyQuery,
  getFilterOptions,
  parseCollectionQuery,
  withCategory,
  withoutFilters,
} from "./collection";
import { formatColorCount, formatPrice } from "./format";
import { routes } from "./routes";

const parse = (search: string) =>
  parseCollectionQuery(new URLSearchParams(search));

describe("Collection URL state", () => {
  test("an empty query is All Pieces in Featured order", () => {
    expect(parse("")).toEqual(emptyQuery);
    expect(collectionHref(emptyQuery)).toBe("/shop");
    expect(describeCollection(emptyQuery).title).toBe("All Pieces");
  });

  test("filters and sort round-trip through a canonical URL", () => {
    const query = parse(
      "sort=price-desc&colour=olive&size=M&cat=outerwear&cloth=waxed-cotton&size=L",
    );
    expect(query).toEqual({
      category: "outerwear",
      cloths: ["waxed-cotton"],
      sizes: ["M", "L"],
      colors: ["olive"],
      sort: "price-desc",
    });
    const href = collectionHref(query);
    expect(href).toBe(
      "/shop?cat=outerwear&cloth=waxed-cotton&size=M&size=L&colour=olive&sort=price-desc",
    );
    expect(parse(href.split("?")[1])).toEqual(query);
  });

  test("colour and color are aliases and accept Colourway names", () => {
    expect(parse("color=Red%20Check&colour=olive&colour=red-check").colors).toEqual(
      ["olive", "red-check"],
    );
  });

  test("unknown and out-of-Category values are dropped", () => {
    expect(
      parse("cat=hats&cloth=tweed&size=XS&colour=purple&sort=newest"),
    ).toEqual(emptyQuery);
    expect(parse("cat=boots&size=M&size=9").sizes).toEqual(["9"]);
    expect(parse("size=M&size=34&size=9").sizes).toEqual(["M", "34", "9"]);
  });

  test("the pre-filtered Category and Cloth links land on their Collections", () => {
    for (const [href, title] of [
      [routes.category("boots"), "Boots"],
      [routes.cloth("selvedge-denim"), "Selvedge denim"],
    ] as const) {
      const query = parse(href.split("?")[1]);
      expect(collectionHref(query)).toBe(href);
      expect(describeCollection(query).title).toBe(title);
      expect(describeCollection(query).intro.length).toBeGreaterThan(0);
    }
  });

  test("switching Category keeps filters but drops sizes it does not offer", () => {
    const query = parse("cat=outerwear&size=M&colour=olive&sort=price-asc");
    expect(withCategory(query, "boots")).toEqual({
      ...query,
      category: "boots",
      sizes: [],
    });
    expect(withCategory(query, "shirts").sizes).toEqual(["M"]);
    expect(withCategory(query, undefined).sizes).toEqual(["M"]);
    expect(withoutFilters(query)).toEqual({
      ...emptyQuery,
      category: "outerwear",
      sort: "price-asc",
    });
  });
});

describe("filter options", () => {
  test("sizes group by shared size run without a Category", () => {
    expect(getFilterOptions().sizes).toEqual([
      { label: "Outerwear, Shirts, Knitwear", sizes: ["S", "M", "L", "XL", "XXL"] },
      { label: "Trousers", sizes: ["28", "30", "32", "34", "36", "38"] },
      { label: "Boots", sizes: ["7", "8", "9", "10", "11", "12", "13"] },
    ]);
    expect(getFilterOptions("boots").sizes).toHaveLength(1);
  });

  test("colours and Cloths are scoped to the Category, each listed once", () => {
    const boots = getFilterOptions("boots");
    expect(boots.cloths.map((cloth) => cloth.id)).toEqual(["full-grain-leather"]);
    expect(boots.colors.map((color) => color.id)).not.toContain("red-check");
    const all = getFilterOptions().colors.map((color) => color.id);
    expect(new Set(all).size).toBe(all.length);
    expect(getFilterOptions().cloths).toHaveLength(6);
    const kept = getFilterOptions("boots", {
      colors: ["red-check"],
      cloths: ["moleskin"],
    });
    expect(kept.colors.map((color) => color.id)).toContain("red-check");
    expect(kept.cloths.map((cloth) => cloth.id)).toEqual([
      "moleskin",
      "full-grain-leather",
    ]);
  });
});

test("prices follow the house style in Brazilian reais", () => {
  expect(formatPrice(480)).toBe("R$ 480");
  expect(formatPrice(1240)).toBe("R$ 1.240");
  expect(formatPrice(12.5)).toBe("R$ 12,50");
  expect(formatPrice(1240.99)).toBe("R$ 1.240,99");
  expect(formatPrice(0)).toBe("R$ 0");
});

test("colour counts follow the house style", () => {
  expect(formatColorCount(1)).toBe("1 colour");
  expect(formatColorCount(3)).toBe("3 colours");
});
