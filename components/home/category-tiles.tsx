import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import { buttonVariants } from "@/components/ui/button";
import { getCategories, getCollection } from "@/lib/catalog";
import { formatPieceCount } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

// The five Categories, the store's top-level way in. One row of portraits
// from 1024; below that a native scroll strip that runs to the screen edge,
// so each tile keeps its size instead of shrinking to a thumbnail.
export function CategoryTiles() {
  return (
    <section aria-labelledby="categories" className="mx-auto w-full max-w-[1536px] py-16 md:py-24">
      <div className="flex items-baseline justify-between gap-6 px-4 md:px-8 lg:px-12">
        <h2 id="categories" className="type-label">Comprar por categoria</h2>
        <Link href={routes.shop} className={cn(buttonVariants({ variant: "link" }), "type-body-sm")}>
          Ver todas as peças
        </Link>
      </div>
      <ul className="mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] md:scroll-px-8 md:gap-5 md:px-8 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-12 xl:gap-6 [&::-webkit-scrollbar]:hidden">
        {getCategories().map((category) => (
          <li key={category.id} className="w-[66vw] shrink-0 snap-start md:w-[40vw] lg:w-auto">
            <Link href={routes.category(category.id)} className="group flex flex-col">
              <MillraceImage imageKey={category.tileImage} slot="category-tile" alt="" />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <span className="type-h3 transition-colors duration-(--dur-fast) ease-mech group-hover:text-indigo">
                  {category.name}
                </span>
                <span className="type-caption text-muted-foreground">
                  {formatPieceCount(getCollection({ category: category.id }).length)}
                </span>
              </div>
              <span className="type-body-sm mt-1 text-muted-foreground">{category.intro}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
