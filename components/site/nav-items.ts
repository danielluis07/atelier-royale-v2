import { getCategories } from "@/lib/catalog";
import { routes } from "@/lib/routes";

export interface NavItem {
  href: string;
  label: string;
}

/** The flat nav (DESIGN.md §6): Lookbook first, then the five Categories. */
export function getNavItems(): NavItem[] {
  return [
    { href: routes.lookbook, label: "Lookbook" },
    ...getCategories().map((category) => ({
      href: routes.category(category.id),
      label: category.name,
    })),
  ];
}
