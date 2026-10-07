/**
 * A spec-sheet section heading (DESIGN.md §4): the mono number sits in the
 * margin on desktop and above the title on mobile.
 */
export function SpecHeading({
  id,
  number,
  children,
}: {
  id: string;
  number: string;
  children: string;
}) {
  return (
    <h2 id={id} className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
      <span className="type-caption text-muted-foreground" aria-hidden="true">
        {number}
      </span>
      <span className="type-label">{children}</span>
    </h2>
  );
}
