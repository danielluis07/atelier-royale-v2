import type { Metadata } from "next";
import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { RevealLine } from "@/components/reveal-line";

export const metadata: Metadata = {
  title: "Page not found",
};

// Editorial 404 (DESIGN.md §6 Edge states): one serif line that reveals once,
// the weir, and a way back into the Lookbook.
export default function NotFound() {
  return (
    <section className="mx-auto grid w-full max-w-[1536px] gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-32">
      <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-2 lg:self-center">
        <p className="type-caption text-muted-foreground">404</p>
        <RevealLine as="h1" className="type-display max-w-[11ch]">
          This page isn&rsquo;t here.
        </RevealLine>
        <p className="type-lede max-w-[36ch]">
          The address may be wrong, or the page has moved. The Lookbook is
          where it always is.
        </p>
        <Link
          href={routes.lookbook}
          className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>
          See the Lookbook
        </Link>
      </div>
      <MillraceImage
        imageKey="editorial/404"
        slot="not-found"
        alt="The weir at Hollins Weir, water falling white over stone below the mill wall"
        className="lg:col-span-6 lg:col-start-7"
      />
    </section>
  );
}
