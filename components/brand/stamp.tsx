import { cn } from "@/lib/utils";

// The stamp (DESIGN.md §6 Badges and stamps): indigo text in a 1px indigo
// rectangle, set at -2° like a mark pressed by hand. At most once per screen.
// It never animates its rotation; it is simply there.
export function Stamp({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="stamp"
      className={cn(
        "type-label inline-block -rotate-2 border border-indigo px-3 py-2 text-indigo",
        className,
      )}
      {...props}>
      Reparos gratuitos para toda a vida
    </p>
  );
}
