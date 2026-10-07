import type { Metadata } from "next";
import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { RevealLine } from "@/components/reveal-line";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

// Editorial 404 (DESIGN.md §6 Edge states): one serif line that reveals once,
// the weir, and a way back into the Lookbook.
export default function NotFound() {
  return (
    <section className="mx-auto grid w-full max-w-[1536px] gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-32">
      <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-2 lg:self-center">
        <p className="type-caption text-muted-foreground">404</p>
        <RevealLine as="h1" className="type-display max-w-[11ch]">
          Esta página não está aqui.
        </RevealLine>
        <p className="type-lede max-w-[36ch]">
          Este endereço está desatualizado. O Lookbook continua aqui.
        </p>
        <Link
          href={routes.lookbook}
          className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>
          Ver o Lookbook
        </Link>
      </div>
      <MillraceImage
        imageKey="editorial/404"
        slot="not-found"
        alt="O açude de Hollins Weir, com a água branca caindo sobre as pedras abaixo da parede do moinho"
        className="lg:col-span-6 lg:col-start-7"
      />
    </section>
  );
}
