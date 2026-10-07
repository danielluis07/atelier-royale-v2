import type { CategoryId, ClothId } from "@/lib/catalog";

// The only route paths in the store. Collection filters live in the query
// (`cat`, `cloth`, `size`, `colour`, `sort`), so Category and Cloth links are
// pre-filtered Collections rather than routes of their own.
export const routes = {
  home: "/",
  lookbook: "/lookbook",
  /** Opens the Lookbook at a Look, by its zero-padded number (`03`). */
  look: (number: string) => `/lookbook?look=${number}`,
  shop: "/shop",
  category: (id: CategoryId) => `/shop?cat=${id}`,
  cloth: (id: ClothId) => `/shop?cloth=${id}`,
  piece: (id: string) => `/shop/${id}`,
  checkout: "/checkout",
  confirmation: "/checkout/confirmation",
} as const;
