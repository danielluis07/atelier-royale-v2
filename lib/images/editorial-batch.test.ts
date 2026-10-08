import { expect, test } from "bun:test";
import { join } from "node:path";
import sharp from "sharp";
import { getLookbook, getLooks } from "../catalog";
import manifest from "./manifest.json";
import type { ImageManifest } from "./types";

test("batch 1 delivers all 21 editorial slots as sRGB JPEGs with blur metadata", async () => {
  const slots = [
    { key: "editorial/hero-desktop", width: 2048, height: 1152 },
    { key: "editorial/hero-mobile", width: 1600, height: 2000 },
    ...getLooks().flatMap((look) => [
      {
        key: look.image,
        width: look.aspect === "4:5" ? 1600 : 2400,
        height: look.aspect === "4:5" ? 2000 : 1600,
      },
      { key: look.squareImage, width: 2048, height: 2048 },
    ]),
    ...getLookbook().frames.flatMap((frame) =>
      frame.kind === "interstitial"
        ? [{
            key: frame.image,
            width: frame.aspect === "4:5" ? 1600 : 2400,
            height: frame.aspect === "4:5" ? 2000 : 1600,
          }]
        : [],
    ),
    { key: "editorial/404", width: 2400, height: 1600 },
  ];
  expect(slots).toHaveLength(21);
  expect(new Set(slots.map(({ key }) => key)).size).toBe(21);

  await Promise.all(slots.map(async ({ key, width, height }) => {
    const source = join(import.meta.dir, "../../public/images", `${key}.jpg`);
    const metadata = await sharp(source).metadata();
    expect(metadata.format, key).toBe("jpeg");
    expect(metadata.space, key).toBe("srgb");
    expect(metadata.width, key).toBeGreaterThanOrEqual(width);
    expect(metadata.height, key).toBeGreaterThanOrEqual(height);
    expect(metadata.width! * height, key).toBe(metadata.height! * width);
    const entry = (manifest as ImageManifest)[key];
    expect(entry, key).toBeDefined();
    expect(entry.width, key).toBe(metadata.width);
    expect(entry.height, key).toBe(metadata.height);
    expect(entry.blurDataURL, key).toStartWith("data:image/jpeg;base64,");
    const blur = await sharp(Buffer.from(entry.blurDataURL.split(",")[1], "base64")).metadata();
    expect(blur.format, key).toBe("jpeg");
    expect(Math.max(blur.width!, blur.height!), key).toBe(8);
  }));
});
