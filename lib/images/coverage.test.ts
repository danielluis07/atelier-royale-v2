import { expect, test } from "bun:test";
import { getCategories, getCloths, getCollection, getFeaturedPiece, getLookbook, getLooks } from "../catalog";
import manifest from "./manifest.json";

test("reports missing Campaign imagery in delivery priority order without failing", () => {
  const pieces = getCollection();
  const galleries = (shots: readonly ("still" | "front" | "back" | "detail")[]) =>
    pieces.flatMap((piece) => piece.colorways.flatMap((colorway) => shots.map((shot) => colorway.images[shot])));
  const priorities = [
    ["1. Hero and Looks", ["editorial/hero-desktop", "editorial/hero-mobile", ...getLooks().flatMap((look) => [look.image, look.squareImage])]],
    ["2. Field Jacket galleries and still lifes", [...getFeaturedPiece().colorways.flatMap((colorway) => Object.values(colorway.images)), ...galleries(["still"])]],
    ["3. Categories and Cloths", [...getCategories().map((category) => category.tileImage), ...getCloths().map((cloth) => cloth.image)]],
    ["4. On-body front", galleries(["front"])],
    ["5. On-body back and detail", galleries(["back", "detail"])],
    ["6. Interstitials and 404", [...getLookbook().frames.flatMap((frame) => frame.kind === "interstitial" ? [frame.image] : []), "editorial/404"]],
  ] as const;
  const seen = new Set<string>();
  let missingCount = 0;
  for (const [label, keys] of priorities) {
    const missing = keys.filter((key) => {
      if (seen.has(key)) return false;
      seen.add(key);
      return !Object.hasOwn(manifest, key);
    });
    missingCount += missing.length;
    console.info(`${label}: ${missing.length} missing${missing.length ? `\n${missing.map((key) => `  ${key}`).join("\n")}` : ""}`);
  }
  console.info(`Campaign imagery: ${seen.size - missingCount}/${seen.size} present. Missing images use marked placeholders.`);
  expect(seen.size).toBe(188);
});
