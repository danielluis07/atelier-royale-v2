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
          <p className="type-label text-muted-foreground">Do moinho de Hollins Weir</p>
          <RevealLine as="h2" className="type-display italic">
            <span id="brand-promise">O cuidado continua depois da compra.</span>
          </RevealLine>
          <Stamp className="after-reveal" />
        </div>
        <div className="flex flex-col items-start gap-2 lg:col-span-3 lg:col-start-9 lg:self-end">
          <p className="type-body max-w-[36ch]">
            Cada peça é feita em Hollins Weir e pode voltar para reparo sempre que
            precisar. O serviço inclui costuras, botões, rebites, uma nova camada
            de cera e a troca das solas, mantendo a vira original das botas.
            O frete de ida e volta é por nossa conta dentro dos EUA.
          </p>
          <SupportSheetTrigger topic="repairs" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            Como funcionam os reparos
          </SupportSheetTrigger>
        </div>
      </div>
    </section>
  );
}
