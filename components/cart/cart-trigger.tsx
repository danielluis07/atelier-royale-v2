"use client";

import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCount } from "@/lib/cart";
import { formatPieceCount } from "@/lib/format";
import { useCart } from "./use-cart";

// The nav bag button. The count appears only once the saved cart has loaded,
// so a reload never shows an empty bag or a wrong number first.
export function CartTrigger() {
  const open = useCart((state) => state.open);
  const count = useCart((state) => (state.hasHydrated ? getCount(state.lines) : undefined));

  return (
    <Button
      variant="ghost"
      size="icon-dense"
      className="-mr-3 w-auto min-w-11 px-2.5"
      aria-haspopup="dialog"
      onClick={open}>
      <ShoppingBagIcon strokeWidth={1.5} />
      {count !== undefined && count > 0 && (
        <span aria-hidden="true" className="type-caption tabular-nums">
          {count}
        </span>
      )}
      <span className="sr-only">
        {count ? `Sacola, ${formatPieceCount(count)}` : "Sacola"}
      </span>
    </Button>
  );
}
