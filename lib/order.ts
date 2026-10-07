import { createStore } from "zustand/vanilla";
import { persist, type PersistStorage, type StateStorage } from "zustand/middleware";
import { cartStore, getSubtotal, resolveLines, type CartStore } from "@/lib/cart";

// The order (#19, second test seam). Unlike cart lines, order lines are
// snapshots: number, name, Colourway and price are frozen when the order is
// placed, so the confirmation shows what the Shopper paid. The order lives in
// sessionStorage: it survives a reload, not a closed tab. Like the cart, it
// never rehydrates on its own; the confirmation page calls rehydrate on mount.

export const ORDER_STORAGE_KEY = "millrace.order.v1";
const ORDER_VERSION = 1;

export type DeliveryMethod = "standard" | "express";

/** Standard ships free from this subtotal (the shipping sheet's terms). */
export const FREE_SHIPPING_FROM = 250;

export const deliveryMethods: Readonly<
  Record<DeliveryMethod, { readonly name: string; readonly days: string }>
> = {
  standard: { name: "Padrão", days: "3 a 5 dias úteis" },
  express: { name: "Expresso", days: "1 a 2 dias úteis" },
};

export function getShippingCost(method: DeliveryMethod, subtotal: number): number {
  if (method === "express") return 25;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : 12;
}

export interface OrderLine {
  readonly pieceId: string;
  readonly colourwayId: string;
  readonly size: string;
  readonly qty: number;
  /** Frozen at placement. */
  readonly number: string;
  readonly name: string;
  readonly colourwayName: string;
  readonly unitPrice: number;
}

export interface ShippingAddress {
  readonly firstName: string;
  readonly lastName: string;
  readonly line1: string;
  readonly line2: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
}

export interface Order {
  /** `MR-` plus six digits. */
  readonly number: string;
  readonly placedAt: string;
  readonly email: string;
  readonly address: ShippingAddress;
  readonly delivery: DeliveryMethod;
  readonly lines: readonly OrderLine[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
}

export interface OrderDetails {
  readonly email: string;
  readonly address: ShippingAddress;
  readonly delivery: DeliveryMethod;
}

export interface OrderState {
  readonly order: Order | null;
  readonly hasHydrated: boolean;
  /**
   * Snapshots the cart into an order, stores it and clears the cart. An empty
   * cart places nothing and returns undefined.
   */
  placeOrder(details: OrderDetails): Order | undefined;
}

type PersistedOrder = Pick<OrderState, "order">;

export function createOrderNumber(random: () => number = Math.random): string {
  return `MR-${String(Math.floor(random() * 1_000_000)).padStart(6, "0")}`;
}

/** A stored order is trusted only if it has the shape the page renders. */
function sanitize(value: unknown): Order | null {
  if (!value || typeof value !== "object") return null;
  const order = value as Partial<Order>;
  if (typeof order.number !== "string" || !Array.isArray(order.lines) || order.lines.length === 0)
    return null;
  if (typeof order.total !== "number" || typeof order.subtotal !== "number") return null;
  return order as Order;
}

function jsonStorage(getStorage: () => StateStorage | undefined): PersistStorage<PersistedOrder> {
  return {
    getItem(name) {
      try {
        const raw = getStorage()?.getItem(name);
        return typeof raw === "string" ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    setItem(name, value) {
      try {
        getStorage()?.setItem(name, JSON.stringify(value));
      } catch {
        // Full or blocked storage: the confirmation still shows this page view.
      }
    },
    removeItem(name) {
      try {
        getStorage()?.removeItem(name);
      } catch {}
    },
  };
}

function browserStorage(): StateStorage | undefined {
  return typeof window === "undefined" ? undefined : window.sessionStorage;
}

export function createOrderStore({
  storage = browserStorage,
  cart = cartStore,
  random = Math.random,
  now = () => new Date(),
}: {
  storage?: () => StateStorage | undefined;
  cart?: CartStore;
  random?: () => number;
  now?: () => Date;
} = {}) {
  return createStore<OrderState>()(
    persist(
      (set) => ({
        order: null,
        hasHydrated: false,

        placeOrder({ email, address, delivery }) {
          const cartLines = cart.getState().lines;
          const items = resolveLines(cartLines);
          if (items.length === 0) return undefined;

          const subtotal = getSubtotal(cartLines);
          const shipping = getShippingCost(delivery, subtotal);
          const order: Order = {
            number: createOrderNumber(random),
            placedAt: now().toISOString(),
            email,
            address,
            delivery,
            lines: items.map(({ line, piece, colorway }) => ({
              pieceId: piece.id,
              colourwayId: colorway.id,
              size: line.size,
              qty: line.qty,
              number: piece.number,
              name: piece.name,
              colourwayName: colorway.name,
              unitPrice: piece.price,
            })),
            subtotal,
            shipping,
            total: subtotal + shipping,
          };

          set({ order });
          cart.getState().clear();
          return order;
        },
      }),
      {
        name: ORDER_STORAGE_KEY,
        version: ORDER_VERSION,
        storage: jsonStorage(storage),
        skipHydration: true,
        partialize: (state): PersistedOrder => ({ order: state.order }),
        // Only version 1 exists, so any other version is dropped.
        migrate: (): PersistedOrder => ({ order: null }),
        // An order placed in this page view is kept when storage is blocked
        // and has nothing to give back.
        merge: (persisted, current) => ({
          ...current,
          order: sanitize((persisted as Partial<PersistedOrder> | undefined)?.order) ?? current.order,
          hasHydrated: true,
        }),
      },
    ),
  );
}

export type OrderStore = ReturnType<typeof createOrderStore>;

/** The store's single browser instance. */
export const orderStore = createOrderStore();
