import { createStore } from "zustand/vanilla";
import { persist, type PersistStorage, type StateStorage } from "zustand/middleware";
import { getCategory, getPiece, type Colorway, type Piece, type Size } from "@/lib/catalog";

// The cart (#19, second test seam). Lines hold ids only; name and price are
// looked up from the catalog at read time, so a stored cart never shows a
// stale price. Only the lines are persisted. The store never rehydrates on its
// own: <CartHydrator /> calls rehydrate on mount and on the `storage` event,
// and `hasHydrated` gates the count and the drawer contents until then.

export type CartLine = { pieceId: string; colourwayId: string; size: string; qty: number };

export const CART_STORAGE_KEY = "millrace.cart.v1";
const CART_VERSION = 1;
/** A believable ceiling for one line; the stepper stops here. */
export const MAX_QTY = 10;

/** Lines are keyed by Piece + Colourway + size. */
export function lineKey(line: Pick<CartLine, "pieceId" | "colourwayId" | "size">) {
  return `${line.pieceId}/${line.colourwayId}/${line.size}`;
}

export interface CartState {
  readonly lines: readonly CartLine[];
  readonly isOpen: boolean;
  readonly hasHydrated: boolean;
  /** Adds `qty` (default 1) or merges into the line with the same key. Opens the drawer unless `open: false`. */
  addLine(line: Omit<CartLine, "qty"> & { qty?: number }, options?: { open?: boolean }): void;
  /** Below 1 removes the line. */
  setQty(key: string, qty: number): void;
  /** Merges into an existing line when the new size makes the same key. */
  setSize(key: string, size: string): void;
  removeLine(key: string): void;
  clear(): void;
  open(): void;
  close(): void;
}

type PersistedCart = Pick<CartState, "lines">;

/** A Piece line the catalog can still show: unknown Pieces, Colourways or sizes resolve to nothing. */
export interface CartItem {
  readonly key: string;
  readonly line: CartLine;
  readonly piece: Piece;
  readonly colorway: Colorway;
  /** The sizes the line can switch to: the Category's sizes, sold-out ones marked. */
  readonly sizes: readonly { readonly size: Size; readonly soldOut: boolean }[];
  readonly lineTotal: number;
}

export function resolveLine(line: CartLine): CartItem | undefined {
  const piece = getPiece(line.pieceId);
  const colorway = piece?.colorways.find((entry) => entry.id === line.colourwayId);
  if (!piece || !colorway) return undefined;
  const sizes = getCategory(piece.category)!.sizes;
  if (!sizes.includes(line.size as Size)) return undefined;
  return {
    key: lineKey(line),
    line,
    piece,
    colorway,
    sizes: sizes.map((size) => ({ size, soldOut: colorway.soldOutSizes.includes(size) })),
    lineTotal: piece.price * line.qty,
  };
}

export function resolveLines(lines: readonly CartLine[]): readonly CartItem[] {
  return lines.map(resolveLine).filter((item) => item !== undefined);
}

/** Always at current catalog prices. */
export function getSubtotal(lines: readonly CartLine[]): number {
  return resolveLines(lines).reduce((sum, item) => sum + item.lineTotal, 0);
}

export function getCount(lines: readonly CartLine[]): number {
  return resolveLines(lines).reduce((sum, item) => sum + item.line.qty, 0);
}

function clampQty(qty: number) {
  return Math.min(MAX_QTY, Math.floor(qty));
}

/** Keeps only well-formed lines the catalog still knows, merging duplicate keys. */
function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines: CartLine[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const { pieceId, colourwayId, size, qty } = entry as Record<string, unknown>;
    if (typeof pieceId !== "string" || typeof colourwayId !== "string" || typeof size !== "string") continue;
    if (typeof qty !== "number" || !Number.isFinite(qty) || qty < 1) continue;
    const line = { pieceId, colourwayId, size, qty: clampQty(qty) };
    if (!resolveLine(line)) continue;
    const existing = lines.findIndex((other) => lineKey(other) === lineKey(line));
    if (existing === -1) lines.push(line);
    else lines[existing] = { ...lines[existing], qty: clampQty(lines[existing].qty + line.qty) };
  }
  return lines;
}

/**
 * JSON over a StateStorage that may be missing (server, blocked storage) or
 * hold garbage. Either way the cart reads as empty instead of throwing, so
 * hydration always finishes.
 */
function jsonStorage(getStorage: () => StateStorage | undefined): PersistStorage<PersistedCart> {
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
        // Full or blocked storage: the cart still works for this page view.
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
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function createCartStore(storage: () => StateStorage | undefined = browserStorage) {
  return createStore<CartState>()(
    persist(
      (set, get) => {
        function update(lines: CartLine[]) {
          set({ lines });
        }

        return {
          lines: [],
          isOpen: false,
          hasHydrated: false,

          addLine({ qty = 1, ...line }, { open = true } = {}) {
            const key = lineKey(line);
            const lines = [...get().lines];
            const index = lines.findIndex((other) => lineKey(other) === key);
            if (index === -1) lines.push({ ...line, qty: clampQty(qty) });
            else lines[index] = { ...lines[index], qty: clampQty(lines[index].qty + qty) };
            set({ lines, ...(open && { isOpen: true }) });
          },

          setQty(key, qty) {
            if (qty < 1) return get().removeLine(key);
            update(get().lines.map((line) => (lineKey(line) === key ? { ...line, qty: clampQty(qty) } : line)));
          },

          setSize(key, size) {
            const lines = [...get().lines];
            const index = lines.findIndex((line) => lineKey(line) === key);
            if (index === -1) return;
            const moved = { ...lines[index], size };
            const target = lines.findIndex((line) => lineKey(line) === lineKey(moved));
            if (target === index) return;
            if (target === -1) {
              lines[index] = moved;
            } else {
              // The line folds into the one that already had this size.
              lines[target] = { ...lines[target], qty: clampQty(lines[target].qty + moved.qty) };
              lines.splice(index, 1);
            }
            update(lines);
          },

          removeLine(key) {
            update(get().lines.filter((line) => lineKey(line) !== key));
          },

          clear() {
            update([]);
          },

          open() {
            set({ isOpen: true });
          },

          close() {
            set({ isOpen: false });
          },
        };
      },
      {
        name: CART_STORAGE_KEY,
        version: CART_VERSION,
        storage: jsonStorage(storage),
        skipHydration: true,
        partialize: (state): PersistedCart => ({ lines: state.lines }),
        // Only version 1 exists, so any other version is dropped.
        migrate: (): PersistedCart => ({ lines: [] }),
        merge: (persisted, current) => ({
          ...current,
          lines: sanitize((persisted as Partial<PersistedCart> | undefined)?.lines),
          hasHydrated: true,
        }),
      },
    ),
  );
}

export type CartStore = ReturnType<typeof createCartStore>;

/** The store's single browser instance. */
export const cartStore = createCartStore();
