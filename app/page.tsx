import { Wordmark } from "@/components/brand/wordmark";
import { MillraceImage } from "@/components/millrace-image";
import { getCollection } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NewsletterStub } from "./_components/newsletter-stub";

// Foundations stub: the brand on paper and on indigo-deep until Home lands.
export default function Home() {
  return (
    <>
      <header className="border-b border-border px-4 py-6 md:px-8 lg:px-12">
        <Wordmark className="text-lg" />
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex flex-col gap-8 px-4 py-16 md:px-8 md:py-24 lg:px-12 lg:py-32">
          <p className="type-label text-muted-foreground">Hollins Weir · FW26</p>
          <h1 className="type-display max-w-[12ch]">Heavy cloth. Plain cut.</h1>
          <p className="type-lede max-w-[52ch]">
            The shop opens here soon. Jackets, shirts, trousers, knitwear and
            boots, cut and sewn at the mill.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <RepairsSheet trigger={<Button />} />
            <Button variant="secondary" disabled>
              Shop opens soon
            </Button>
            <RepairsSheet trigger={<Button variant="link" />} label="Read the repair promise" />
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:max-w-sm">
            <Badge>New</Badge>
            <div className="flex items-baseline justify-between">
              <span className="type-caption">No. 027</span>
              <span className="type-price">$520</span>
            </div>
            <span className="font-medium">Field Jacket</span>
            <span className="type-body-sm text-muted-foreground">3 colours</span>
          </div>
        </section>

        <section aria-label="Pieces" className="grid grid-cols-2 gap-4 px-4 pb-16 md:grid-cols-3 md:gap-5 md:px-8 lg:px-12 xl:grid-cols-4 xl:gap-6 max-w-[1536px] w-full mx-auto">
          {getCollection().slice(0, 4).map((piece) => (
            <figure key={piece.id}>
              <MillraceImage
                imageKey={piece.colorways[0].images.still}
                slot="collection-card"
                alt={`${piece.name}, ${piece.colorways[0].name}, still life`}
              />
              <figcaption className="type-caption mt-3">
                No. {piece.number} · {piece.name}
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="ground-indigo-deep flex flex-col gap-8 px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <Wordmark className="text-lg" />
          <p className="type-h2 italic max-w-[24ch]">
            Made at the mill. Mended free for life.
          </p>
          <NewsletterStub />
          <RepairsSheet trigger={<Button variant="secondary" className="self-start" />} />
        </section>
      </main>
    </>
  );
}

function RepairsSheet({
  trigger,
  label = "Repairs",
}: {
  trigger: React.ComponentProps<typeof SheetTrigger>["render"];
  label?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger render={trigger}>{label}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Repairs</SheetTitle>
          <SheetDescription>Mended free for life.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-6 py-6 type-body max-w-[62ch]">
          <p>
            Every Piece goes back to Hollins Weir for mending, for as long as
            it is worn. Seams are resewn, buttons replaced, wax renewed.
          </p>
          <p className="type-caption text-muted-foreground">
            Repairs return in 3 to 4 weeks.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
