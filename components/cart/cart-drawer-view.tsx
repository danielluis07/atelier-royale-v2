"use client";

import { useId, useRef, type ReactNode } from "react";
import Link from "next/link";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MAX_QTY, resolveLines, type CartItem } from "@/lib/cart";
import { formatPieceCount, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useCart } from "./use-cart";

interface CartDrawerViewProps {
  /** Still-life thumbnails by `pieceId/colourwayId`. */
  thumbnails: Readonly<Record<string, ReactNode>>;
}

// DESIGN.md §6 Cart drawer: a right-hand stone sheet, 440 wide from md, full
// width below. Opened by the nav bag and by add to cart; base-ui traps focus,
// closes on Esc and returns focus to whatever opened it.
export function CartDrawerView({ thumbnails }: CartDrawerViewProps) {
  const isOpen = useCart((state) => state.isOpen);
  const hasHydrated = useCart((state) => state.hasHydrated);
  const lines = useCart((state) => state.lines);
  const close = useCart((state) => state.close);
  const title = useRef<HTMLHeadingElement>(null);

  const items = resolveLines(lines);
  const count = items.reduce((sum, item) => sum + item.line.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  // A removed or merged row takes its focused control with it; land on the
  // title rather than lose focus to the inert page behind.
  function keepFocus() {
    requestAnimationFrame(() => {
      const popup = title.current?.closest("[data-slot=sheet-content]");
      if (popup && !popup.contains(document.activeElement)) title.current?.focus();
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle ref={title} tabIndex={-1} className="outline-none">
            Bag
          </SheetTitle>
          {hasHydrated && items.length > 0 && (
            <SheetDescription className="type-caption">{formatPieceCount(count)}</SheetDescription>
          )}
        </SheetHeader>

        {/* Nothing shows until the saved cart has loaded: no empty-bag flash. */}
        {hasHydrated &&
          (items.length === 0 ? (
            <div className="flex flex-1 flex-col items-start gap-2 px-6 py-10">
              <p className="type-h3">Your bag is empty.</p>
              <Link
                href={routes.lookbook}
                onClick={close}
                className={cn(buttonVariants({ variant: "link" }), "type-body")}>
                See the Lookbook
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto px-6">
                {/* Rows are keyed by position: a size change keeps its row,
                    so the focused control stays put. */}
                {items.map((item, index) => (
                  <CartRow
                    key={index}
                    item={item}
                    thumbnail={thumbnails[`${item.piece.id}/${item.colorway.id}`]}
                    onNavigate={close}
                    onRowChange={keepFocus}
                  />
                ))}
              </ul>

              <SheetFooter>
                <div className="flex items-baseline justify-between">
                  <span className="type-label">Subtotal</span>
                  <span className="type-price">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="type-label shrink-0 -rotate-2 border border-indigo px-2 py-1 text-indigo">
                    Mended free for life
                  </span>
                  <p className="type-caption text-muted-foreground">
                    Repairs at Hollins Weir are complimentary for every Piece.
                  </p>
                </div>
                <p className="type-caption text-muted-foreground">
                  Shipping is set at Checkout.
                </p>
                <Link href={routes.checkout} onClick={close} className={cn(buttonVariants(), "w-full")}>
                  Checkout
                </Link>
              </SheetFooter>
            </>
          ))}
      </SheetContent>
    </Sheet>
  );
}

function CartRow({
  item,
  thumbnail,
  onNavigate,
  onRowChange,
}: {
  item: CartItem;
  thumbnail: ReactNode;
  onNavigate: () => void;
  onRowChange: () => void;
}) {
  const id = useId();
  const setQty = useCart((state) => state.setQty);
  const setSize = useCart((state) => state.setSize);
  const removeLine = useCart((state) => state.removeLine);
  const { key, line, piece, colorway } = item;
  const label = `${piece.name}, ${colorway.name}, ${line.size}`;

  return (
    <li className="grid grid-cols-[5rem_1fr] gap-4 border-b border-border py-5 last:border-b-0">
      <Link
        href={routes.piece(piece.id)}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="self-start">
        {thumbnail}
      </Link>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <span className="type-caption">No. {piece.number}</span>
            <span className="type-price">{formatPrice(item.lineTotal)}</span>
          </div>
          <Link
            href={routes.piece(piece.id)}
            onClick={onNavigate}
            className="self-start font-medium hover:text-indigo">
            {piece.name}
          </Link>
          <p className="type-body-sm text-muted-foreground">
            {colorway.name}
            {line.qty > 1 && <> · {formatPrice(piece.price)} each</>}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor={`${id}-size`} className="type-label">
              Size
            </label>
            <select
              id={`${id}-size`}
              value={line.size}
              onChange={(event) => {
                setSize(key, event.target.value);
                onRowChange();
              }}
              className="type-proof h-11 min-w-20 border border-input bg-background px-3">
              {item.sizes.map(({ size, soldOut }) => (
                <option
                  key={size}
                  value={size}
                  disabled={soldOut && size !== line.size}>
                  {soldOut ? `${size}, sold out` : size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span id={`${id}-qty`} className="type-label">
              Quantity
            </span>
            <div role="group" aria-labelledby={`${id}-qty`} className="flex">
              <StepperButton
                label={`One fewer, ${label}`}
                disabled={line.qty <= 1}
                onClick={() => setQty(key, line.qty - 1)}>
                <MinusIcon strokeWidth={1.5} />
              </StepperButton>
              <output
                aria-label={`${line.qty} of ${label}`}
                className="type-proof -ml-px flex size-11 items-center justify-center border border-input tabular-nums">
                {line.qty}
              </output>
              <StepperButton
                label={`One more, ${label}`}
                disabled={line.qty >= MAX_QTY}
                onClick={() => setQty(key, line.qty + 1)}
                className="-ml-px">
                <PlusIcon strokeWidth={1.5} />
              </StepperButton>
            </div>
          </div>
        </div>

        <Button
          variant="link"
          className="type-body-sm self-start text-muted-foreground"
          aria-label={`Remove ${label}`}
          onClick={() => {
            removeLine(key);
            onRowChange();
          }}>
          Remove
        </Button>
      </div>
    </li>
  );
}

function StepperButton({
  label,
  disabled,
  onClick,
  className,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center border border-input transition-colors duration-(--dur-fast) ease-mech hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:text-ink-muted [&_svg]:size-4",
        className,
      )}>
      {children}
    </button>
  );
}
