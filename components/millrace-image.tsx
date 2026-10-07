import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import manifest from "@/lib/images/manifest.json";
import { imageSlots, type ImageSlot } from "@/lib/images/slots";
import type { ImageManifest, ImageMetadata } from "@/lib/images/types";
import { cn } from "@/lib/utils";

interface MillraceImageProps {
  imageKey: string;
  slot: ImageSlot;
  alt: string;
  /**
   * Art direction: a second composition shown from 768px, where the slot
   * switches to its desktop ratio. A separate frame, never a crop.
   */
  desktopImageKey?: string;
  className?: string;
}

function lookup(imageKey: string): ImageMetadata | undefined {
  return Object.hasOwn(manifest, imageKey)
    ? (manifest as ImageManifest)[imageKey]
    : undefined;
}

function source(imageKey: string, metadata: ImageMetadata) {
  return { src: `/images/${imageKey}.jpg`, ...metadata };
}

/** Shared geometry keeps missing shots and photographs in the same space. */
export function MillraceImage({ imageKey, slot, alt, desktopImageKey, className }: MillraceImageProps) {
  const definition = imageSlots[slot];
  const metadata = lookup(imageKey);
  const desktopMetadata = desktopImageKey ? lookup(desktopImageKey) : undefined;
  const artDirected = desktopImageKey !== undefined;
  const style = {
    "--image-aspect": definition.aspectRatio,
    "--image-desktop-aspect": "desktopAspectRatio" in definition
      ? definition.desktopAspectRatio
      : definition.aspectRatio,
  } as CSSProperties;
  const loading = {
    loading: definition.highPriority ? "eager" : "lazy",
    fetchPriority: definition.highPriority ? "high" : undefined,
  } as const;

  let image;
  if (artDirected && metadata && desktopMetadata) {
    // Both frames go through the optimiser; the browser fetches only the one
    // its media query picks. The blur sits on the slot, per breakpoint.
    const common = { alt, fill: true, sizes: definition.sizes, quality: 75, ...loading };
    const desktop = getImageProps({ ...common, src: source(desktopImageKey, desktopMetadata) }).props;
    const mobile = getImageProps({ ...common, src: source(imageKey, metadata) }).props;
    Object.assign(style, {
      "--image-blur": `url("${metadata.blurDataURL}")`,
      "--image-desktop-blur": `url("${desktopMetadata.blurDataURL}")`,
    });
    image = (
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
        <img {...mobile} alt={alt} className="object-cover" />
      </picture>
    );
  } else if (!artDirected && metadata) {
    image = (
      <Image
        src={source(imageKey, metadata)}
        alt={alt}
        fill
        sizes={definition.sizes}
        placeholder="blur"
        quality={75}
        {...loading}
        className="object-cover"
      />
    );
  } else {
    image = (
      <div
        className="millrace-image-placeholder"
        role={alt ? "img" : undefined}
        aria-label={alt ? `Placeholder: ${alt}` : undefined}
        aria-hidden={alt ? undefined : true}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 100 100 M100 0 0 100" fill="none" stroke="var(--hairline)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="type-caption relative bg-stone px-3 py-2 text-center text-ink-muted [overflow-wrap:anywhere]">
          PLACEHOLDER ·{" "}
          {desktopImageKey ? (
            <>
              <span className="md:hidden">{imageKey}</span>
              <span className="hidden md:inline">{desktopImageKey}</span>
            </>
          ) : (
            imageKey
          )}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("millrace-image", className)}
      data-art-directed={artDirected && metadata && desktopMetadata ? "" : undefined}
      style={style}
    >
      {image}
    </div>
  );
}
