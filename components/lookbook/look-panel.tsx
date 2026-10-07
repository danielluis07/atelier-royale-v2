"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/use-cart";
import { announce } from "@/components/live-region";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { addedLabel, describeQuickAdd, quickAddLine, type LookPiece } from "@/lib/lookbook";
import { routes } from "@/lib/routes";

/** How long the button reads "Added · M" (DESIGN.md §5). */
const addedFor = 2000;

const desktop = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const query = matchMedia(desktop);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** A right drawer from md, a bottom sheet below it. Closed on the server, so its guess never shows. */
function useSide() {
  return useSyncExternalStore(
    subscribe,
    () => (matchMedia(desktop).matches ? "right" : "bottom"),
    () => "right" as const,
  );
}

interface LookPanelProps {
  number: string;
  caption: string;
  pieces: readonly LookPiece[];
  /** The Look's frame, kept in view above the mobile bottom sheet. */
  image: ReactNode;
  /** Still-life thumbnails in the Colourway worn, by Piece id. */
  thumbnails: Readonly<Record<string, ReactNode>>;
}

// DESIGN.md §6 Look panel: "Shop this Look" under a Look's caption opens its
// Pieces in the cart drawer's chrome. Quick add never opens the cart; the
// button confirms in place and the live region announces it.
export function LookPanel({ number, caption, pieces, image, thumbnails }: LookPanelProps) {
  const side = useSide();

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="link" className="type-body-sm self-start" />}>
        Comprar este look
        <span className="sr-only">, Look {number}</span>
      </SheetTrigger>
      <SheetContent
        side={side}
        backdrop={
          // The strip's own frame sits mostly under the sheet and the header,
          // so the band above the sheet shows the Look itself. Taps pass through
          // to the scrim, which only closes when it is the target itself.
          side === "bottom" && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[15dvh] overflow-hidden">
              {image}
            </div>
          )
        }>
        <SheetHeader>
          <SheetTitle>Look {number}</SheetTitle>
          <SheetDescription>{caption}</SheetDescription>
        </SheetHeader>
        <ul className="flex-1 overflow-y-auto overscroll-contain px-6">
          {pieces.map((piece) => (
            <LookPanelRow key={piece.id} piece={piece} thumbnail={thumbnails[piece.id]} />
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}

function LookPanelRow({ piece, thumbnail }: { piece: LookPiece; thumbnail: ReactNode }) {
  const id = useId();
  const addLine = useCart((state) => state.addLine);
  const [size, setSize] = useState("");
  const [missingSize, setMissingSize] = useState(false);
  const [added, setAdded] = useState<string>();
  const select = useRef<HTMLSelectElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const soldOut = piece.sizes.every((entry) => entry.soldOut);
  const errorId = `${id}-size-error`;

  useEffect(() => () => clearTimeout(timer.current), []);

  function quickAdd() {
    const line = quickAddLine(piece, size);
    if (!line) {
      setMissingSize(true);
      select.current?.focus();
      return;
    }
    addLine(line, { open: false });
    announce(describeQuickAdd(piece, line.size));
    setAdded(line.size);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(undefined), addedFor);
  }

  return (
    <li className="grid grid-cols-[5rem_1fr] gap-4 border-b border-border py-5 last:border-b-0">
      <Link href={routes.piece(piece.id)} tabIndex={-1} aria-hidden="true" className="self-start">
        {thumbnail}
      </Link>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <span className="type-caption">No. {piece.number}</span>
            <span className="type-price">{formatPrice(piece.price)}</span>
          </div>
          <Link href={routes.piece(piece.id)} className="self-start font-medium hover:text-indigo">
            {piece.name}
          </Link>
          <p className="type-body-sm text-muted-foreground">{piece.colourwayName}</p>
        </div>

        {soldOut ? (
          <p className="type-body-sm text-muted-foreground">Esta cor está esgotada.</p>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor={`${id}-size`} className="type-label">
                  Tamanho
                </label>
                <select
                  ref={select}
                  id={`${id}-size`}
                  value={size}
                  aria-invalid={missingSize || undefined}
                  aria-describedby={missingSize ? errorId : undefined}
                  onChange={(event) => {
                    setSize(event.target.value);
                    setMissingSize(false);
                  }}
                  className="type-proof h-11 min-w-24 border border-input bg-background px-3 aria-invalid:border-destructive">
                  <option value="" disabled>
                    Escolha
                  </option>
                  {piece.sizes.map((entry) => (
                    <option key={entry.size} value={entry.size} disabled={entry.soldOut}>
                      {entry.soldOut ? `${entry.size}, esgotado` : entry.size}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="secondary"
                size="dense"
                className="min-w-36 px-4"
                aria-label={added ? undefined : `Adicionar rapidamente, ${piece.name}`}
                onClick={quickAdd}>
                {added ? addedLabel(added) : "Adicionar rapidamente"}
              </Button>
            </div>
            {missingSize && (
              <p id={errorId} className="type-body-sm text-destructive">
                Escolha um tamanho.
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
