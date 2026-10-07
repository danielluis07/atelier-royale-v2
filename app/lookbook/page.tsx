import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { getLookbook } from "@/lib/catalog";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Lookbook",
};

// Interim page until the Lookbook flow (#28) lands.
export default function LookbookPage() {
  const lookbook = getLookbook();

  return (
    <ComingSoon
      kicker={`${lookbook.seasonLabel} · Hollins Weir`}
      title="The Lookbook opens here soon."
      line={lookbook.intro}
      link={{ href: routes.home, label: "Back to Millrace" }}
    />
  );
}
