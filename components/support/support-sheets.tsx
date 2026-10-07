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
          title="Shipping"
          description="Packed at Hollins Weir. Sent within 2 working days."
          rows={[
            ["Standard", "Free on US orders over $250. $12 below that. 3 to 5 working days."],
            ["Express", "$25. 1 to 2 working days."],
            ["Tracking", "A tracking link follows by email when the parcel leaves the mill."],
            ["Where", "United States only. All prices in USD."],
          ]}
        />
      );
    case "returns":
      return (
        <Ledger
          title="Returns"
          description="30 days to send back an unworn Piece."
          rows={[
            ["Window", "30 days from delivery. Tags on, unworn, unwashed."],
            ["Cost", "Free within the US. The prepaid label is in the box."],
            ["Refund", "To the original payment, within 5 working days of arrival at the mill."],
            ["Final", "Trousers chain-stitched to length are not returnable."],
          ]}
        />
      );
    case "repairs":
      return (
        <Ledger
          title="Repairs"
          description="Mended free for life."
          rows={[
            ["Cover", "Every Piece, for as long as it is worn. No receipt needed."],
            ["Work", "Seams resewn, buttons and rivets replaced, wax renewed, boots resoled on the original welt."],
            ["Shipping", "Covered both ways within the US."],
            ["Time", "3 to 4 weeks at Hollins Weir."],
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
        <SheetTitle>Size guide</SheetTitle>
        <SheetDescription>Measurements in inches.</SheetDescription>
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
              Size
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
