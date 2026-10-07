"use client";

import { useStore } from "zustand";
import { orderStore, type OrderState } from "@/lib/order";

/** Reads the store's single browser instance. */
export function useOrder<T>(selector: (state: OrderState) => T): T {
  return useStore(orderStore, selector);
}
