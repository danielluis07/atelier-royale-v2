import { readdir, mkdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import sharp from "sharp";
import type { ImageManifest, ImageMetadata } from "../lib/images/types";

const projectRoot = resolve(import.meta.dir, "..");

/** Missing imagery is valid. Invalid JPEGs fail before replacing the manifest. */
export async function generateImageManifest(
  imagesDirectory = join(projectRoot, "public/images"),
  outputFile = join(projectRoot, "lib/images/manifest.json"),
): Promise<ImageManifest> {
  await mkdir(imagesDirectory, { recursive: true });
  const manifest: Record<string, ImageMetadata> = {};

  async function scan(directory: string): Promise<void> {
    const entries = (await readdir(directory, { withFileTypes: true })).sort(
      (a, b) => a.name.localeCompare(b.name, "en"),
    );
    for (const entry of entries) {
      const filename = join(directory, entry.name);
      if (entry.isDirectory()) {
        await scan(filename);
        continue;
      }
      if (!entry.isFile() || !/\.jpe?g$/i.test(entry.name)) continue;
      const imagePath = relative(imagesDirectory, filename).replaceAll("\\", "/");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*\.jpg$/.test(imagePath)) {
        throw new Error(`Use lowercase kebab-case paths and the .jpg extension: ${imagePath}`);
      }
      const image = sharp(filename);
      const metadata = await image.metadata();
      if (metadata.format !== "jpeg" || !metadata.width || !metadata.height) {
        throw new Error(`Expected a JPEG with dimensions: ${imagePath}`);
      }
      const rotated = (metadata.orientation ?? 1) >= 5;
      const blur = await image.rotate().resize(8, 8, { fit: "inside" }).jpeg({ quality: 40 }).toBuffer();
      manifest[imagePath.slice(0, -4)] = {
        width: rotated ? metadata.height : metadata.width,
        height: rotated ? metadata.width : metadata.height,
        blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
      };
    }
  }

  await scan(imagesDirectory);
  await mkdir(dirname(outputFile), { recursive: true });
  const generated = `${JSON.stringify(manifest, null, 2)}\n`;
  const existing = Bun.file(outputFile);
  // Avoid touching an unchanged import and triggering needless dev recompiles.
  if (!(await existing.exists()) || (await existing.text()) !== generated) {
    await Bun.write(outputFile, generated);
  }
  return manifest;
}

if (import.meta.main) {
  const manifest = await generateImageManifest();
  console.info(`Image manifest: ${Object.keys(manifest).length} JPEGs.`);
}
