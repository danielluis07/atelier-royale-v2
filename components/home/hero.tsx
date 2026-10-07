import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import { RevealLine } from "@/components/reveal-line";
import { buttonVariants } from "@/components/ui/button";
import { getLookbook } from "@/lib/catalog";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

// The campaign Hero (DESIGN.md §4, §5): full bleed, one line, two exits. Each
// breakpoint has its own frame. On mobile the 4:5 frame stands alone and the
// line sits under it on paper, so nothing covers the jacket. From 768 the
// 16:9 frame carries the line top left, over the trees and clear of the
// weir's white water, on the plain 0.4 scrim. The line wipes in once; the
// image never moves. This is the page's only high-priority image.
export function Hero() {
  const lookbook = getLookbook();

  return (
    <section aria-labelledby="hero-line" className="relative">
      <MillraceImage
        imageKey="editorial/hero-mobile"
        desktopImageKey="editorial/hero-desktop"
        slot="home-hero"
        alt="A man in an olive Field Jacket and selvedge jeans walks the wet stone path along the millrace, the weir and the mill behind him."
      />
      <div aria-hidden="true" className="absolute inset-0 hidden bg-black/40 md:block" />

      <div className="md:ground-photo md:absolute md:inset-0">
        <div className="mx-auto flex w-full max-w-[1536px] flex-col items-start gap-6 px-4 pt-8 pb-16 md:px-8 md:pt-12 lg:gap-8 lg:px-12 lg:pt-20">
          <p className="type-label text-muted-foreground">
            Hollins Weir · {lookbook.seasonLabel}
          </p>
          <RevealLine as="h1" className="type-display max-w-[14ch] text-balance">
            <span id="hero-line">Heavy cloth. Plain cut.</span>
          </RevealLine>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link href={routes.lookbook} className={cn(buttonVariants())}>
              See the Lookbook
            </Link>
            <Link href={routes.shop} className={cn(buttonVariants({ variant: "secondary" }))}>
              Shop all Pieces
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
