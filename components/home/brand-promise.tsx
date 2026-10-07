import { Stamp } from "@/components/brand/stamp";
import { RevealLine } from "@/components/reveal-line";
import { SupportSheetTrigger } from "@/components/support/support-sheets";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The brand promise, full bleed on stone so the stamp keeps its indigo
// (DESIGN.md §6). The place line is the page's one italic; it wipes in once,
// then the stamp is simply there, already pressed at -2° (globals.css
// `.after-reveal`). The repair terms open as the Repairs sheet.
export function BrandPromise() {
  return (
    <section aria-labelledby="brand-promise" className="bg-stone">
      <div className="mx-auto grid w-full max-w-[1536px] gap-8 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-48">
        <div className="flex flex-col items-start gap-8 lg:col-span-7 lg:col-start-2">
          <p className="type-label text-muted-foreground">Feita no moinho</p>
          <RevealLine as="h2" className="type-display italic">
            <span id="brand-promise">Cortada e costurada em Hollins Weir.</span>
          </RevealLine>
          <Stamp className="after-reveal" />
        </div>
        <div className="flex flex-col items-start gap-2 lg:col-span-3 lg:col-start-9 lg:self-end">
          <p className="type-body max-w-[36ch]">
            Traga qualquer peça de volta enquanto você a usar. Refazemos costuras,
            trocamos botões e rebites, renovamos a cera e refazemos as solas das
            botas no debrum original. Cobrimos o frete de ida e volta dentro dos EUA.
          </p>
          <SupportSheetTrigger topic="repairs" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            Ler os termos de reparo
          </SupportSheetTrigger>
        </div>
      </div>
    </section>
  );
}
