"use client";

import { useEffect } from "react";
import { announce } from "@/components/live-region";
import { CART_STORAGE_KEY, cartStore, getCount } from "@/lib/cart";
import { formatPieceCount } from "@/lib/format";

// The cart never rehydrates on its own (lib/cart.ts). This loads the saved
// lines once mounted, reloads them whenever another tab writes, and announces
// every count change after that first load.
export function CartHydrator() {
  useEffect(() => {
    const unsubscribe = cartStore.subscribe((state, previous) => {
      if (!previous.hasHydrated) return;
      const count = getCount(state.lines);
      if (count !== getCount(previous.lines)) announce(`Sacola: ${formatPieceCount(count)}`);
    });

    function onStorage(event: StorageEvent) {
      // A null key means another tab cleared all storage.
      if (event.key === CART_STORAGE_KEY || event.key === null) cartStore.persist.rehydrate();
    }

    cartStore.persist.rehydrate();
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
