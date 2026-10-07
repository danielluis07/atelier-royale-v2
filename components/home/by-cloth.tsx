import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import { RevealLine } from "@/components/reveal-line";
import { getCloths } from "@/lib/catalog";
import { routes } from "@/lib/routes";

// *By cloth*: all six Cloths, each opening the Collection pre-filtered to it
// (`/shop?cloth=`). Close-ups of the cloth itself, with its weight in mono.
export function ByCloth() {
  return (
    <section aria-labelledby="by-cloth" className="mx-auto w-full max-w-[1536px] px-4 py-16 md:px-8 md:py-24 lg:px-12">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-6 lg:col-start-2">
          <p className="type-label text-muted-foreground">Tecido</p>
          <RevealLine as="h2" className="type-h1">
            <span id="by-cloth">Por tecido.</span>
          </RevealLine>
        </div>
        <p className="type-lede max-w-[36ch] lg:col-span-4 lg:col-start-8 lg:self-end">
          Cada peça começa com um dos seis tecidos. Escolha aquele que você conhece.
        </p>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-12 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-6 xl:gap-x-6">
        {getCloths().map((cloth) => (
          <li key={cloth.id}>
            <Link href={routes.cloth(cloth.id)} className="group flex flex-col">
              <MillraceImage imageKey={cloth.image} slot="cloth-tile" alt="" />
              <span className="mt-3 font-medium transition-colors duration-(--dur-fast) ease-mech group-hover:text-indigo">
                {cloth.name}
              </span>
              <span className="type-caption mt-1 text-muted-foreground">{cloth.facts.weight}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
