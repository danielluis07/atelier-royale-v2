import Image from "next/image";
import type { CSSProperties } from "react";
import manifest from "@/lib/images/manifest.json";
import { imageSlots, type ImageSlot } from "@/lib/images/slots";
import type { ImageManifest } from "@/lib/images/types";
import { cn } from "@/lib/utils";

interface MillraceImageProps {
  imageKey: string;
  slot: ImageSlot;
  alt: string;
  className?: string;
}

/** Shared geometry keeps missing shots and photographs in the same space. */
export function MillraceImage({ imageKey, slot, alt, className }: MillraceImageProps) {
  const definition = imageSlots[slot];
  const metadata = Object.hasOwn(manifest, imageKey)
    ? (manifest as ImageManifest)[imageKey]
    : undefined;
  const style = {
    "--image-aspect": definition.aspectRatio,
    "--image-desktop-aspect": "desktopAspectRatio" in definition
      ? definition.desktopAspectRatio
      : definition.aspectRatio,
  } as CSSProperties;

  return (
    <div className={cn("millrace-image", className)} style={style}>
      {metadata ? (
        <Image
          src={{ src: `/images/${imageKey}.jpg`, ...metadata }}
          alt={alt}
          fill
          sizes={definition.sizes}
          placeholder="blur"
          quality={75}
          loading={definition.highPriority ? "eager" : "lazy"}
          fetchPriority={definition.highPriority ? "high" : undefined}
          className="object-cover"
        />
      ) : (
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
            PLACEHOLDER · {imageKey}
          </span>
        </div>
      )}
    </div>
  );
}
