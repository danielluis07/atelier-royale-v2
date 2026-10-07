import Link from "next/link";
import { ViewTransition } from "react";
import { MillraceImage } from "@/components/millrace-image";
import { RevealLine } from "@/components/reveal-line";
import { buttonVariants } from "@/components/ui/button";
import { getLookbook, getLooks } from "@/lib/catalog";
import { lookMorphName } from "@/lib/lookbook";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** The first Looks of the season, in Lookbook order. */
const teaserCount = 4;

// A strip of the Lookbook's opening Looks. Each frame is the Look's own image
// in its own ratio and slot, so opening it lands on the frame already loaded
// and morphs into it (DESIGN.md §5). Frames share one height: below 1024 they
// scroll natively; from 1024 they share the row in proportion to their ratio.
export function LookbookTeaser() {
  const lookbook = getLookbook();
  const looks = getLooks().slice(0, teaserCount);

  return (
    <section aria-labelledby="lookbook-teaser" className="mx-auto w-full max-w-[1536px] py-16 md:py-24">
      <div className="grid gap-6 px-4 md:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12">
        <div className="flex flex-col gap-4 lg:col-span-6 lg:col-start-2">
          <p className="type-label text-muted-foreground">
            Lookbook · {lookbook.season}
          </p>
          <RevealLine as="h2" className="type-h1 max-w-[16ch]">
            <span id="lookbook-teaser">Eight Looks at Hollins Weir.</span>
          </RevealLine>
        </div>
        <div className="flex flex-col items-start gap-2 lg:col-span-4 lg:col-start-8 lg:self-end">
          <p className="type-lede max-w-[36ch]">{lookbook.intro}</p>
          <Link href={routes.lookbook} className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            See the Lookbook
          </Link>
        </div>
      </div>

      <ul className="lookbook-teaser mt-10 flex snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] md:mt-12 md:scroll-px-8 md:gap-5 md:px-8 lg:overflow-visible lg:px-12 xl:gap-6 [&::-webkit-scrollbar]:hidden">
        {looks.map((look) => (
          <li
            key={look.id}
            className={cn(
              "shrink-0 snap-start lg:min-w-0 lg:shrink lg:basis-0",
              look.aspect === "3:2" ? "lookbook-teaser-landscape" : "lookbook-teaser-portrait",
            )}>
            <Link href={routes.look(look.number)} className="group flex flex-col">
              <ViewTransition name={lookMorphName(look.number)} share="look-morph" default="none">
                <MillraceImage
                  imageKey={look.image}
                  slot={look.aspect === "3:2" ? "look-landscape" : "look-portrait"}
                  alt=""
                />
              </ViewTransition>
              <span className="type-caption mt-3 text-muted-foreground transition-colors duration-(--dur-fast) ease-mech group-hover:text-indigo">
                Look {look.number}
              </span>
              <span className="type-body-sm mt-1 max-w-[40ch]">{look.caption}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
