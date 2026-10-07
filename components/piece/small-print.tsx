import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SupportSheetTrigger, type SupportTopic } from "@/components/support/support-sheets";
import { buttonVariants } from "@/components/ui/button";
import type { CategoryId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

// Shipping and returns as small print beside the buy button, in native
// disclosures so they never compete with the Proof. The full terms stay in
// the support sheets.
export function SmallPrint({ category }: { category: CategoryId }) {
  return (
    <div className="border-t border-border">
      <Disclosure title="Shipping" topic="shipping">
        Sent from Hollins Weir within 2 working days. Free on US orders over
        $250; $12 below that.
      </Disclosure>
      <Disclosure title="Returns" topic="returns">
        30 days from delivery to send back an unworn Piece. Free within the US.
        {category === "trousers" &&
          " Trousers chain-stitched to length are not returnable."}
      </Disclosure>
    </div>
  );
}

function Disclosure({
  title,
  topic,
  children,
}: {
  title: string;
  topic: SupportTopic;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-border">
      <summary className="type-label flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon
          aria-hidden="true"
          className="size-4 transition-transform duration-(--dur-fast) ease-mech group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="flex flex-col items-start pb-3">
        <p className="type-body-sm max-w-[52ch] text-muted-foreground">{children}</p>
        <SupportSheetTrigger
          topic={topic}
          className={cn(buttonVariants({ variant: "link" }), "type-body-sm")}>
          {title} in full
        </SupportSheetTrigger>
      </div>
    </details>
  );
}
