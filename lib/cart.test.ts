import { beforeEach, describe, expect, test } from "bun:test";
import type { StateStorage } from "zustand/middleware";
import {
  CART_STORAGE_KEY,
  createCartStore,
  getCount,
  getSubtotal,
  lineKey,
  resolveLines,
  type CartStore,
} from "./cart";
import { getCategory, getCollection, getPiece } from "./catalog";

// Seam 2: the cart's public actions and derived values, against an in-memory
// storage standing in for localStorage.

function memoryStorage() {
  const items = new Map<string, string>();
  const storage: StateStorage = {
    getItem: (name) => items.get(name) ?? null,
    setItem: (name, value) => void items.set(name, value),
    removeItem: (name) => void items.delete(name),
  };
  return { items, storage };
}

// Fixtures come from the catalog, not from literals, so they survive copy edits.
const jacket = getCollection().find((piece) => piece.colorways.length > 1)!;
const [first, second] = getCategory(jacket.category)!.sizes;
const other = getCollection().find((piece) => piece.id !== jacket.id && piece.price !== jacket.price)!;

const line = (size = first, colourwayId = jacket.colorways[0].id) => ({
  pieceId: jacket.id,
  colourwayId,
  size,
});

let items: Map<string, string>;
let store: CartStore;
let cart: () => ReturnType<CartStore["getState"]>;

beforeEach(() => {
  const memory = memoryStorage();
  items = memory.items;
  store = createCartStore(() => memory.storage);
  store.persist.rehydrate();
  cart = () => store.getState();
});

describe("Cart actions", () => {
  test("add puts one line in the cart", () => {
    cart().addLine(line());
    expect(cart().lines).toEqual([{ ...line(), qty: 1 }]);
    expect(getCount(cart().lines)).toBe(1);
  });

  test("adding the same Piece, Colourway and size merges into one line", () => {
    cart().addLine(line());
    cart().addLine(line());
    cart().addLine(line(first, jacket.colorways[1].id));
    expect(cart().lines).toEqual([
      { ...line(), qty: 2 },
      { ...line(first, jacket.colorways[1].id), qty: 1 },
    ]);
    expect(getCount(cart().lines)).toBe(3);
  });

  test("change quantity, and below 1 the line goes", () => {
    cart().addLine(line());
    cart().setQty(lineKey(line()), 3);
    expect(cart().lines).toEqual([{ ...line(), qty: 3 }]);
    cart().setQty(lineKey(line()), 0);
    expect(cart().lines).toEqual([]);
  });

  test("change size moves the line to the new key", () => {
    cart().addLine(line());
    cart().setSize(lineKey(line()), second);
    expect(cart().lines).toEqual([{ ...line(second), qty: 1 }]);
  });

  test("change size into an existing line merges the two", () => {
    cart().addLine(line(), { open: false });
    cart().addLine(line(second), { open: false });
    cart().setQty(lineKey(line()), 2);
    cart().setSize(lineKey(line()), second);
    expect(cart().lines).toEqual([{ ...line(second), qty: 3 }]);
  });

  test("remove takes only that line out", () => {
    cart().addLine(line());
    cart().addLine(line(second));
    cart().removeLine(lineKey(line()));
    expect(cart().lines).toEqual([{ ...line(second), qty: 1 }]);
  });

  test("addLine opens the drawer by default, and not with { open: false }", () => {
    cart().addLine(line(), { open: false });
    expect(cart().isOpen).toBe(false);
    cart().addLine(line());
    expect(cart().isOpen).toBe(true);
    cart().close();
    expect(cart().isOpen).toBe(false);
  });
});

describe("Cart derived values", () => {
  test("subtotal uses current catalog prices", () => {
    cart().addLine(line(), { open: false });
    cart().addLine(line(), { open: false });
    cart().addLine({ pieceId: other.id, colourwayId: other.colorways[0].id, size: getCategory(other.category)!.sizes[0] });
    expect(getSubtotal(cart().lines)).toBe(
      getPiece(jacket.id)!.price * 2 + getPiece(other.id)!.price,
    );
  });

  test("lines the catalog no longer knows are left out", () => {
    const stale = { pieceId: "no-such-piece", colourwayId: "x", size: first };
    cart().addLine(stale, { open: false });
    cart().addLine(line(), { open: false });
    expect(resolveLines(cart().lines).map((item) => item.piece.id)).toEqual([jacket.id]);
    expect(getSubtotal(cart().lines)).toBe(jacket.price);
    expect(getCount(cart().lines)).toBe(1);
  });
});

describe("Cart persistence", () => {
  test("only the lines are persisted", () => {
    cart().addLine(line());
    expect(cart().isOpen).toBe(true);
    const saved = JSON.parse(items.get(CART_STORAGE_KEY)!);
    expect(saved).toEqual({ state: { lines: [{ ...line(), qty: 1 }] }, version: 1 });
  });

  test("a saved cart comes back on rehydrate, closed", () => {
    cart().addLine(line());
    const reloaded = createCartStore(() => ({
      getItem: (name) => items.get(name) ?? null,
      setItem: () => {},
      removeItem: () => {},
    }));
    expect(reloaded.getState().hasHydrated).toBe(false);
    reloaded.persist.rehydrate();
    expect(reloaded.getState().hasHydrated).toBe(true);
    expect(reloaded.getState().lines).toEqual([{ ...line(), qty: 1 }]);
    expect(reloaded.getState().isOpen).toBe(false);
  });

  test("persisted state of an unknown version is dropped", () => {
    items.set(
      CART_STORAGE_KEY,
      JSON.stringify({ state: { lines: [{ ...line(), qty: 1 }] }, version: 7 }),
    );
    store.persist.rehydrate();
    expect(cart().hasHydrated).toBe(true);
    expect(cart().lines).toEqual([]);
    expect(JSON.parse(items.get(CART_STORAGE_KEY)!)).toEqual({ state: { lines: [] }, version: 1 });
  });

  test("unreadable storage hydrates as an empty cart", () => {
    items.set(CART_STORAGE_KEY, "{not json");
    store.persist.rehydrate();
    expect(cart().hasHydrated).toBe(true);
    expect(cart().lines).toEqual([]);
  });

  test("a change written by another tab replaces the lines on rehydrate", () => {
    cart().addLine(line(), { open: false });
    items.set(
      CART_STORAGE_KEY,
      JSON.stringify({ state: { lines: [{ ...line(second), qty: 2 }] }, version: 1 }),
    );
    store.persist.rehydrate();
    expect(cart().lines).toEqual([{ ...line(second), qty: 2 }]);
  });
});
