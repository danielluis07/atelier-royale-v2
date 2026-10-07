"use client";

import {
  addTransitionType,
  startTransition,
  useId,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { SupportSheetTrigger } from "@/components/support/support-sheets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Colorway, Piece, Size } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { galleryViews, pieceMorphName } from "./gallery-views";

/** Marks Colourway swaps so only the gallery crossfades (globals.css). */
const colorwayTransition = "piece-colourway";
const galleryUpdate = { [colorwayTransition]: "piece-gallery", default: "none" };

/** One Colourway's server-rendered images, in `galleryViews` order. */
export interface ColorwayMedia {
  readonly slides: readonly ReactNode[];
  readonly thumbnails: readonly ReactNode[];
}

interface PieceViewProps {
  piece: Piece;
  sizes: readonly Size[];
  /** By Colourway id. */
  media: Readonly<Record<string, ColorwayMedia>>;
  smallPrint: ReactNode;
  /** The Proof ledger: under the gallery, beside the sticky buy panel. */
  children: ReactNode;
}

// DESIGN.md §6 Piece page. Below md: gallery, buy panel, Proof. From md the
// buy panel takes the right column and stays in view down the gallery and the
// Proof ledger.
export function PieceView({ piece, sizes, media, smallPrint, children }: PieceViewProps) {
  const [colorwayId, setColorwayId] = useState(piece.colorways[0].id);
  const colorway = piece.colorways.find((entry) => entry.id === colorwayId)!;

  // The gallery crossfades to the new Colourway; text swaps instantly.
  function chooseColorway(next: Colorway) {
    startTransition(() => {
      addTransitionType(colorwayTransition);
      setColorwayId(next.id);
    });
  }

  return (
    <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-5 md:gap-y-24 lg:gap-x-6">
      <Gallery
        pieceId={piece.id}
        label={`${piece.name} in ${colorway.name}`}
        media={media[colorway.id]}
        className="md:col-span-6"
      />
      <div className="md:col-span-6 md:col-start-7 md:row-span-2 md:row-start-1 lg:col-span-5 lg:col-start-8">
        <BuyPanel
          piece={piece}
          sizes={sizes}
          colorway={colorway}
          onColorway={chooseColorway}
          smallPrint={smallPrint}
          className="md:sticky md:top-[calc(var(--header-height)+2rem)]"
        />
      </div>
      <div className="max-md:mt-14 md:col-span-6 md:row-start-2">{children}</div>
    </div>
  );
}

function Gallery({
  pieceId,
  label,
  media,
  className,
}: {
  pieceId: string;
  label: string;
  media: ColorwayMedia;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  /** The slide a thumbnail or key is scrolling to; swipes have none. */
  const target = useRef<number | null>(null);
  const count = media.slides.length;

  // Below md the slides are a swipeable strip with native snapping. From md
  // they stack and crossfade, so the strip has nothing to scroll.
  function show(index: number) {
    const next = Math.min(Math.max(index, 0), count - 1);
    setActive(next);
    const element = strip.current;
    if (!element || element.scrollWidth <= element.clientWidth) return;
    target.current = next;
    element.scrollTo({
      left: next * element.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  // Follow swipes once a slide has snapped into place.
  function onScroll() {
    const element = strip.current;
    if (!element || element.scrollWidth <= element.clientWidth) return;
    const position = element.scrollLeft / element.clientWidth;
    const index = Math.round(position);
    if (Math.abs(position - index) > 0.01) return;
    if (target.current !== null && target.current !== index) return;
    target.current = null;
    setActive(index);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    show(active + (event.key === "ArrowRight" ? 1 : -1));
  }

  return (
    <div className={className}>
      {/* The main image morphs from the Collection card (DESIGN.md §5). */}
      <ViewTransition
        name={pieceMorphName(pieceId)}
        share="piece-morph"
        update={galleryUpdate}
        default="none">
        <div
          ref={strip}
          role="group"
          aria-label={`${label}, ${count} images`}
          tabIndex={0}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:grid md:overflow-hidden [&::-webkit-scrollbar]:hidden">
          {media.slides.map((slide, index) => (
            <div
              key={galleryViews[index].image}
              aria-hidden={index === active ? undefined : true}
              className={cn(
                "w-full shrink-0 snap-start snap-always md:[grid-area:1/1] md:transition-opacity md:duration-(--dur-base) md:ease-mech",
                index !== active && "md:pointer-events-none md:opacity-0",
              )}>
              {slide}
            </div>
          ))}
        </div>
      </ViewTransition>

      <ViewTransition update={galleryUpdate} default="none">
        <ul className="mt-3 flex gap-2 md:mt-4 md:gap-3">
          {media.thumbnails.map((thumbnail, index) => (
            <li key={galleryViews[index].image}>
              <button
                type="button"
                aria-label={galleryViews[index].label}
                aria-pressed={index === active}
                onClick={() => show(index)}
                className={cn(
                  "block w-16 border transition-colors duration-(--dur-fast) ease-mech md:w-24",
                  index === active ? "border-foreground" : "border-transparent hover:border-input",
                )}>
                {thumbnail}
              </button>
            </li>
          ))}
        </ul>
      </ViewTransition>
    </div>
  );
}

function BuyPanel({
  piece,
  sizes,
  colorway,
  onColorway,
  smallPrint,
  className,
}: {
  piece: Piece;
  sizes: readonly Size[];
  colorway: Colorway;
  onColorway: (colorway: Colorway) => void;
  smallPrint: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [size, setSize] = useState<Size>();
  const [missingSize, setMissingSize] = useState(false);
  const sizeGroup = useRef<HTMLFieldSetElement>(null);
  // A size sold out in the chosen Colourway is not chosen.
  const chosen = size && !colorway.soldOutSizes.includes(size) ? size : undefined;
  const noteId = `${id}-size-note`;
  const errorId = `${id}-size-error`;
  const soldOutNote = colorway.soldOutSizes.length > 0;
  const describedBy =
    [missingSize && errorId, soldOutNote && noteId].filter(Boolean).join(" ") ||
    undefined;

  function addToCart() {
    if (!chosen) {
      setMissingSize(true);
      sizeGroup.current
        ?.querySelector<HTMLInputElement>("input:not(:disabled)")
        ?.focus();
      return;
    }
    // The line ({ pieceId, colourwayId, size }) goes to the cart store in the
    // Cart ticket (#26).
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex min-h-6 items-center gap-3">
          <p className="type-caption">No. {piece.number}</p>
          {piece.badge && <Badge>{piece.badge}</Badge>}
        </div>
        <h1 className="type-h2">{piece.name}</h1>
        <p className="type-price">{formatPrice(piece.price)}</p>
      </div>

      <fieldset>
        <legend className="type-label float-left w-full pb-1">
          Colour
          <span
            aria-hidden="true"
            className="type-body-sm ml-3 tracking-normal normal-case [font-stretch:100%] text-muted-foreground">
            {colorway.name}
          </span>
        </legend>
        <div className="clear-left -ml-2.5 flex flex-wrap">
          {piece.colorways.map((entry) => {
            const checked = entry.id === colorway.id;
            return (
              <label
                key={entry.id}
                className="flex size-11 cursor-pointer items-center justify-center has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring">
                <input
                  type="radio"
                  name={`${id}-colour`}
                  value={entry.id}
                  checked={checked}
                  onChange={() => onColorway(entry)}
                  className="sr-only"
                />
                <span className="sr-only">{entry.name}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-6 rounded-full border border-hairline transition-shadow duration-(--dur-base) ease-mech",
                    checked && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                  )}
                  style={{ backgroundColor: entry.swatch }}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset ref={sizeGroup}>
        <legend className="type-label float-left w-full pb-3">Size</legend>
        <div className="clear-left flex flex-wrap gap-2">
          {sizes.map((entry) => {
            const soldOut = colorway.soldOutSizes.includes(entry);
            const checked = entry === chosen;
            return (
              <label
                key={entry}
                className={cn(
                  "type-proof relative flex h-12 min-w-12 items-center justify-center border px-3 transition-colors duration-(--dur-base) ease-mech has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                  soldOut
                    ? "cursor-not-allowed border-border text-muted-foreground"
                    : checked
                      ? "cursor-pointer border-primary bg-primary text-primary-foreground"
                      : "cursor-pointer border-input hover:border-foreground",
                )}>
                <input
                  type="radio"
                  name={`${id}-size`}
                  value={entry}
                  checked={checked}
                  disabled={soldOut}
                  aria-disabled={soldOut || undefined}
                  aria-describedby={describedBy}
                  onChange={() => {
                    setSize(entry);
                    setMissingSize(false);
                  }}
                  className="sr-only"
                />
                {entry}
                {soldOut && (
                  <>
                    <span className="sr-only">, sold out</span>
                    <svg
                      aria-hidden="true"
                      className="absolute inset-0 size-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none">
                      <path
                        d="M0 100 100 0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </>
                )}
              </label>
            );
          })}
        </div>
        <div className="flex flex-col gap-1 pt-3 empty:hidden">
          {missingSize && (
            <p id={errorId} className="type-body-sm text-destructive">
              Choose a size.
            </p>
          )}
          {soldOutNote && (
            <p id={noteId} className="type-caption text-muted-foreground">
              Struck sizes are sold out in {colorway.name}.
            </p>
          )}
          {piece.category === "trousers" && (
            <p className="type-caption text-muted-foreground">
              34in inseam. Sold unhemmed; chain-stitched to length on request.
            </p>
          )}
        </div>
      </fieldset>

      <p className="type-lede max-w-[52ch]">{piece.story}</p>

      <div className="flex flex-col items-start gap-2">
        <Button type="button" className="w-full" onClick={addToCart}>
          Add to cart
        </Button>
        <SupportSheetTrigger
          topic="size-guide"
          category={piece.category}
          render={<Button variant="link" />}>
          Size guide
        </SupportSheetTrigger>
      </div>

      {smallPrint}
    </div>
  );
}
