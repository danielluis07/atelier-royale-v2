import { cn } from "cn";

// The race line (DESIGN.md §7): two parallel hairlines with one short indigo
// segment between them, the millrace channel. A graphic accent, at most once
// per view, never part of the wordmark lockup.
function RaceLine({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="race-line"
      className={cn("relative h-1.75 w-full border-y border-hairline", className)}
      {...props}>
      <span className="absolute top-1/2 left-[18%] h-0.5 w-8 -translate-y-1/2 bg-indigo" />
    </div>
  );
}

export { RaceLine };
