export interface ImageMetadata {
  readonly width: number;
  readonly height: number;
  readonly blurDataURL: string;
}

export type ImageManifest = Readonly<Record<string, ImageMetadata>>;
