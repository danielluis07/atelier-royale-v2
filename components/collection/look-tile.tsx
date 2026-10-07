import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import type { Look } from "@/lib/catalog";
import { routes } from "@/lib/routes";

// The one way back from the Storefront to the editorial: Look 01's square
// crop in the grid, opening the Lookbook at that Look.
export function LookTile({ look }: { look: Look }) {
  return (
    <Link href={routes.look(look.number)} className="group flex flex-col">
      <MillraceImage
        imageKey={look.squareImage}
        slot="look-square"
        alt=""
      />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="type-caption">Look {look.number}</span>
        <span className="type-label text-muted-foreground">Lookbook</span>
      </div>
      <span className="mt-2 font-medium">{look.caption}</span>
      <span className="type-body-sm text-muted-foreground group-hover:text-indigo transition-colors duration-(--dur-fast) ease-mech">
        See this Look
      </span>
    </Link>
  );
}
