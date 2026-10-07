"use client";

import { useStore } from "zustand";
import { cartStore, type CartState } from "@/lib/cart";

/** Reads the store's single browser instance. */
export function useCart<T>(selector: (state: CartState) => T): T {
  return useStore(cartStore, selector);
}
