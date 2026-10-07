import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Shop",
};

// Interim page until the Collection (#24) lands; it ignores the `cat` and
// `cloth` filters the nav and footer already link with.
export default function ShopPage() {
  return (
    <ComingSoon
      kicker="Shop"
      title="The shop opens here soon."
      line="Jackets, shirts, trousers, knitwear and boots, cut and sewn at Hollins Weir."
      link={{ href: routes.lookbook, label: "See the Lookbook" }}
    />
  );
}
