import { cn } from "cn";

// MILLRACE wordmark (DESIGN.md §7): Archivo at width 112, weight 600, caps,
// tracking +0.18em, never narrower than 96px. Size it with font-size; give it
// clear space equal to the height of the M on every side. Colour follows the
// ground: ink on paper, paper on indigo-deep. Never indigo.
function Wordmark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="wordmark"
      className={cn(
        "inline-block min-w-24 font-sans font-semibold whitespace-nowrap text-foreground uppercase leading-none tracking-[0.18em] [font-stretch:112%]",
        // Trailing tracking would push the mark off-centre.
        "-mr-[0.18em]",
        className,
      )}
      {...props}>
      Millrace
    </span>
  );
}

export { Wordmark };
