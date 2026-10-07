import { beforeEach, describe, expect, test } from "bun:test";
import type { StateStorage } from "zustand/middleware";
import { createCartStore, type CartStore } from "./cart";
import { getCategory, getCollection } from "./catalog";
import {
  createOrderNumber,
  createOrderStore,
  FREE_SHIPPING_FROM,
  getShippingCost,
  ORDER_STORAGE_KEY,
  type OrderDetails,
  type OrderStore,
} from "./order";

// Seam 2: the Order store's public actions, against in-memory storages
// standing in for localStorage (cart) and sessionStorage (order).

function memoryStorage() {
  const items = new Map<string, string>();
  const storage: StateStorage = {
    getItem: (name) => items.get(name) ?? null,
    setItem: (name, value) => void items.set(name, value),
    removeItem: (name) => void items.delete(name),
  };
  return { items, storage };
}

const jacket = getCollection().find((piece) => piece.colorways.length > 1)!;
const other = getCollection().find((piece) => piece.id !== jacket.id && piece.price !== jacket.price)!;
const sizeOf = (piece: typeof jacket) => getCategory(piece.category)!.sizes[0];

const details: OrderDetails = {
  email: "shopper@example.com",
  address: {
    firstName: "Ada",
    lastName: "Weir",
    line1: "1 Mill Lane",
    line2: "",
    city: "Hudson",
    state: "NY",
    zip: "12534",
  },
  delivery: "standard",
};

let items: Map<string, string>;
let cart: CartStore;
let store: OrderStore;

beforeEach(() => {
  const cartMemory = memoryStorage();
  cart = createCartStore(() => cartMemory.storage);
  cart.persist.rehydrate();

  const memory = memoryStorage();
  items = memory.items;
  store = createOrderStore({ storage: () => memory.storage, cart, random: () => 0.0421 });
  store.persist.rehydrate();
});

function fillCart() {
  cart.getState().addLine(
    { pieceId: jacket.id, colourwayId: jacket.colorways[1].id, size: sizeOf(jacket), qty: 2 },
    { open: false },
  );
  cart.getState().addLine(
    { pieceId: other.id, colourwayId: other.colorways[0].id, size: sizeOf(other) },
    { open: false },
  );
}

describe("Place order", () => {
  test("snapshots each line with the price paid, produces an order number and clears the cart", () => {
    fillCart();
    const order = store.getState().placeOrder(details)!;

    expect(order.number).toBe("MR-042100");
    expect(order.lines).toEqual([
      {
        pieceId: jacket.id,
        colourwayId: jacket.colorways[1].id,
        size: sizeOf(jacket),
        qty: 2,
        number: jacket.number,
        name: jacket.name,
        colourwayName: jacket.colorways[1].name,
        unitPrice: jacket.price,
      },
      {
        pieceId: other.id,
        colourwayId: other.colorways[0].id,
        size: sizeOf(other),
        qty: 1,
        number: other.number,
        name: other.name,
        colourwayName: other.colorways[0].name,
        unitPrice: other.price,
      },
    ]);
    expect(order.subtotal).toBe(jacket.price * 2 + other.price);
    expect(order.total).toBe(order.subtotal + order.shipping);
    expect(store.getState().order).toEqual(order);
    expect(cart.getState().lines).toEqual([]);
  });

  test("an empty cart places no order", () => {
    expect(store.getState().placeOrder(details)).toBeUndefined();
    expect(store.getState().order).toBeNull();
    expect(items.has(ORDER_STORAGE_KEY)).toBe(false);
  });

  test("order numbers are MR- plus six digits", () => {
    expect(createOrderNumber(() => 0)).toBe("MR-000000");
    expect(createOrderNumber(() => 0.999_999_9)).toBe("MR-999999");
    expect(createOrderNumber()).toMatch(/^MR-\d{6}$/);
  });
});

describe("Shipping", () => {
  test("standard is free from the threshold, express is flat", () => {
    expect(getShippingCost("standard", FREE_SHIPPING_FROM - 1)).toBe(12);
    expect(getShippingCost("standard", FREE_SHIPPING_FROM)).toBe(0);
    expect(getShippingCost("express", FREE_SHIPPING_FROM * 4)).toBe(25);
  });
});

describe("Order persistence", () => {
  test("the order comes back on rehydrate with the prices it was placed at", () => {
    fillCart();
    store.getState().placeOrder(details);

    // Rewrite the stored price: a reload must show the stored snapshot, never
    // a catalog lookup.
    const saved = JSON.parse(items.get(ORDER_STORAGE_KEY)!);
    saved.state.order.lines[0].unitPrice = 1;
    items.set(ORDER_STORAGE_KEY, JSON.stringify(saved));

    const reloaded = createOrderStore({
      storage: () => ({
        getItem: (name) => items.get(name) ?? null,
        setItem: () => {},
        removeItem: () => {},
      }),
      cart,
    });
    expect(reloaded.getState().hasHydrated).toBe(false);
    reloaded.persist.rehydrate();
    expect(reloaded.getState().hasHydrated).toBe(true);
    expect(reloaded.getState().order?.lines[0].unitPrice).toBe(1);
  });

  test("only the order is persisted", () => {
    fillCart();
    const order = store.getState().placeOrder(details);
    expect(JSON.parse(items.get(ORDER_STORAGE_KEY)!)).toEqual({ state: { order }, version: 1 });
  });

  test("persisted state of an unknown version is dropped", () => {
    fillCart();
    const order = store.getState().placeOrder(details);
    items.set(ORDER_STORAGE_KEY, JSON.stringify({ state: { order }, version: 7 }));
    const reloaded = createOrderStore({
      storage: () => ({
        getItem: (name) => items.get(name) ?? null,
        setItem: () => {},
        removeItem: () => {},
      }),
      cart,
    });
    reloaded.persist.rehydrate();
    expect(reloaded.getState().hasHydrated).toBe(true);
    expect(reloaded.getState().order).toBeNull();
  });

  test("unreadable storage hydrates with no order", () => {
    items.set(ORDER_STORAGE_KEY, "{not json");
    store.persist.rehydrate();
    expect(store.getState().hasHydrated).toBe(true);
    expect(store.getState().order).toBeNull();
  });
});
