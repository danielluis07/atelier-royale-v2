import { expect, test } from "bun:test";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { generateImageManifest } from "./generate-image-manifest";

test("regenerates empty, added and removed JPEGs with oriented dimensions and a small blur", async () => {
  const directory = await mkdtemp(join(tmpdir(), "millrace-images-"));
  const images = join(directory, "images");
  const output = join(directory, "generated/manifest.json");
  try {
    expect(await generateImageManifest(images, output)).toEqual({});
    expect(await Bun.file(output).json()).toEqual({});
    const pieceDirectory = join(images, "pieces/027-field-jacket");
    await mkdir(pieceDirectory, { recursive: true });
    const photo = join(pieceDirectory, "olive-still.jpg");
    await sharp({ create: { width: 60, height: 40, channels: 3, background: "#263766" } })
      .withMetadata({ orientation: 6 }).jpeg().toFile(photo);
    const generated = await generateImageManifest(images, output);
    const metadata = generated["pieces/027-field-jacket/olive-still"];
    expect(metadata.width).toBe(40);
    expect(metadata.height).toBe(60);
    expect(metadata.blurDataURL).toStartWith("data:image/jpeg;base64,");
    const blur = await sharp(Buffer.from(metadata.blurDataURL.split(",")[1], "base64")).metadata();
    expect(Math.max(blur.width!, blur.height!)).toBe(8);
    expect(await generateImageManifest(images, output)).toEqual(generated);
    expect(await Bun.file(output).json()).toEqual(generated);
    await rm(photo);
    expect(await generateImageManifest(images, output)).toEqual({});
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("a corrupt source fails without replacing the last valid manifest", async () => {
  const directory = await mkdtemp(join(tmpdir(), "millrace-images-"));
  try {
    const images = join(directory, "images");
    const output = join(directory, "manifest.json");
    await generateImageManifest(images, output);
    await Bun.write(join(images, "broken.jpg"), "invalid JPEG");
    await expect(generateImageManifest(images, output)).rejects.toThrow();
    expect(await Bun.file(output).json()).toEqual({});
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
