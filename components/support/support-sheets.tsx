"use client";

import { Dialog } from "@base-ui/react/dialog";
import { getCategories, type Category, type CategoryId } from "@/lib/catalog";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Support content opens in right-hand sheets, never pages (DESIGN.md §6).
// One sheet is mounted in the root layout; triggers anywhere in the store open
// it through the shared handle, and base-ui returns focus to that trigger.

export type SupportTopic = "shipping" | "returns" | "repairs" | "size-guide";

interface SupportPayload {
  topic: SupportTopic;
  /** Size guide only: list this Category's table first. */
  category?: CategoryId;
}

const supportSheet = Dialog.createHandle<SupportPayload>();

type SupportSheetTriggerProps = Omit<
  Dialog.Trigger.Props<SupportPayload>,
  "handle" | "payload"
> &
  SupportPayload;

export function SupportSheetTrigger({
  topic,
  category,
  ...props
}: SupportSheetTriggerProps) {
  return (
    <Dialog.Trigger
      data-slot="sheet-trigger"
      handle={supportSheet}
      payload={{ topic, category }}
      {...props}
    />
  );
}

export function SupportSheets() {
  return (
    <Dialog.Root handle={supportSheet}>
      {({ payload }) => (
        <SheetContent side="right">
          {payload && <SupportContent {...payload} />}
        </SheetContent>
      )}
    </Dialog.Root>
  );
}

function SupportContent({ topic, category }: SupportPayload) {
  switch (topic) {
    case "shipping":
      return (
        <Ledger
          title="Envio"
          description="Os pedidos saem de Hollins Weir em até 2 dias úteis."
          rows={[
            ["Padrão", "Frete grátis a partir de R$ 250. Abaixo desse valor, o frete custa R$ 12. A entrega leva de 3 a 5 dias úteis dentro dos EUA."],
            ["Expresso", "Frete de R$ 25, com entrega em 1 a 2 dias úteis."],
            ["Rastreamento", "O link de rastreamento chega por e-mail assim que o pedido é enviado."],
            ["Destino", "As entregas são feitas apenas nos Estados Unidos. Os preços são exibidos em reais (BRL)."],
          ]}
        />
      );
    case "returns":
      return (
        <Ledger
          title="Devoluções"
          description="Você tem 30 dias após a entrega para devolver uma peça sem uso."
          rows={[
            ["Prazo", "Até 30 dias após receber o pedido. A peça deve estar com as etiquetas, sem uso e sem lavagem."],
            ["Custo", "A devolução é gratuita dentro dos EUA. Use a etiqueta de envio pré-paga que acompanha o pedido."],
            ["Reembolso", "O valor é devolvido pela mesma forma de pagamento, em até 5 dias úteis após a peça chegar a Hollins Weir."],
            ["Peças ajustadas", "Calças com a barra feita sob medida não podem ser devolvidas."],
          ]}
        />
      );
    case "repairs":
      return (
        <Ledger
          title="Reparos"
          description="Se uma peça precisar de conserto, ela pode voltar a Hollins Weir. O reparo é gratuito, por toda a vida."
          rows={[
            ["Cobertura", "Todas as peças têm direito a reparo enquanto você as usar. Não é preciso apresentar comprovante de compra."],
            ["Trabalho", "O serviço inclui refazer costuras, trocar botões e rebites, reaplicar a cera e trocar as solas das botas, mantendo a vira original."],
            ["Envio", "O frete de ida e volta é gratuito dentro dos EUA."],
            ["Prazo", "O serviço leva de 3 a 4 semanas em Hollins Weir."],
          ]}
        />
      );
    case "size-guide":
      return <SizeGuide category={category} />;
  }
}

function Ledger({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: readonly (readonly [string, string])[];
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      <dl className="flex-1 overflow-y-auto px-6 py-2">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0">
            <dt className="flex items-baseline gap-3">
              <span className="type-caption text-muted-foreground" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="type-label">{label}</span>
            </dt>
            <dd className="type-body-sm max-w-[52ch]">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function SizeGuide({ category }: { category?: CategoryId }) {
  const categories = [...getCategories()].sort(
    (a, b) => Number(b.id === category) - Number(a.id === category),
  );

  return (
    <>
      <SheetHeader>
        <SheetTitle>Guia de tamanhos</SheetTitle>
        <SheetDescription>Todas as medidas estão em polegadas.</SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-6 py-6">
        {categories.map((entry, index) => (
          <SizeTable key={entry.id} category={entry} index={index} />
        ))}
      </div>
    </>
  );
}

function SizeTable({ category, index }: { category: Category; index: number }) {
  const { sizeGuide } = category;
  const noteId = `size-note-${category.id}`;

  return (
    <section aria-labelledby={`size-${category.id}`}>
      <h3 id={`size-${category.id}`} className="flex items-baseline gap-3 pb-3">
        <span className="type-caption text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="type-label">{category.name}</span>
      </h3>
      <table className="type-proof w-full border-collapse" aria-describedby={noteId}>
        <thead>
          <tr className="border-y border-border">
            <th scope="col" className="type-label py-2 pr-4 text-left">
              Tamanho
            </th>
            {sizeGuide.columns.map((column) => (
              <th key={column} scope="col" className="type-label py-2 pl-4 text-right">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {sizeGuide.rows.map((row) => (
            <tr key={row.size} className="border-b border-border">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                {row.size}
              </th>
              {row.measurements.map((value, column) => (
                <td key={sizeGuide.columns[column]} className="py-2 pl-4 text-right">
                  {formatInches(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p id={noteId} className="type-caption pt-3 text-muted-foreground max-w-[52ch]">
        {sizeGuide.note}
      </p>
    </section>
  );
}

function formatInches(value: number) {
  return `${Number(value.toFixed(2))}`;
}
