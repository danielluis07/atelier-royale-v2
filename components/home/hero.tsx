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
// 16:9 frame carries a narrower line top left, over the trees and clear of
// the model in the center, on the plain 0.4 scrim. The line wipes in once; the
// image never moves. This is the page's only high-priority image.
export function Hero() {
  const lookbook = getLookbook();

  return (
    <section aria-labelledby="hero-line" className="relative">
      <MillraceImage
        imageKey="editorial/hero-mobile"
        desktopImageKey="editorial/hero-desktop"
        slot="home-hero"
        alt="Homem de jaqueta de campo verde-oliva e jeans selvedge no caminho de pedras molhadas junto ao canal. Ao fundo, o açude e o moinho."
      />
      <div aria-hidden="true" className="absolute inset-0 hidden bg-black/40 md:block" />

      <div className="md:ground-photo md:absolute md:inset-0">
        <div className="mx-auto flex w-full max-w-[1536px] flex-col items-start gap-6 px-4 pt-8 pb-16 md:px-8 md:pt-12 lg:gap-8 lg:px-12 lg:pt-20">
          <p className="type-label text-muted-foreground">
            Hollins Weir · {lookbook.seasonLabel}
          </p>
          <RevealLine
            as="h1"
            className="type-display max-w-[14ch] text-balance md:max-w-[min(34vw,27rem)] md:text-[clamp(2.75rem,4.75vw,4.5rem)]">
            <span id="hero-line">Roupa boa acompanha a vida</span>
          </RevealLine>
          <div className="flex flex-wrap gap-3 md:max-w-[34vw] md:gap-4 lg:max-w-none">
            <Link href={routes.lookbook} className={cn(buttonVariants())}>
              Ver o lookbook
            </Link>
            <Link href={routes.shop} className={cn(buttonVariants({ variant: "secondary" }))}>
              Ver a coleção
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
