"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { announce } from "@/components/live-region";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCategory, getCloth, search } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

// How long typing must pause before the count is announced, so a screen
// reader hears one line per word rather than one per keystroke.
const ANNOUNCE_DELAY = 600;

// DESIGN.md §6 Search overlay: full width under the nav, one large serif
// input, compact Piece rows. A plain input followed by a plain list of links,
// not a combobox: Tab moves from the input into the results.
export function SearchOverlayView({
  thumbnails,
}: {
  thumbnails: Readonly<Record<string, ReactNode>>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const result = useMemo(() => search(query), [query]);
  const idle = query.trim() === "";
  const noResults = !idle && result.pieces.length === 0;
  const suggestions = result.suggestions;

  useEffect(() => {
    if (idle) return;
    const count = result.pieces.length;
    const line = count
      ? `${count} ${count === 1 ? "resultado" : "resultados"}`
      : `Nenhuma peça corresponde. Tente ${suggestions.map((category) => category.name).join(", ")}.`;
    const timer = setTimeout(() => announce(line), ANNOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [idle, result, suggestions]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <SheetTrigger render={<Button variant="ghost" size="icon-dense" />}>
        <SearchIcon strokeWidth={1.5} />
        <span className="sr-only">Pesquisar</span>
      </SheetTrigger>
      <SheetContent
        side="top"
        className={cn(
          // Clips down from under the nav instead of sliding over it.
          "top-(--header-height) max-h-[calc(100dvh-var(--header-height))] transition-[clip-path,opacity]",
          "data-[side=top]:data-starting-style:translate-y-0 data-[side=top]:data-ending-style:translate-y-0",
          "data-starting-style:[clip-path:inset(0_0_100%_0)] data-ending-style:[clip-path:inset(0_0_100%_0)]",
          "motion-reduce:duration-(--dur-base) motion-reduce:data-starting-style:[clip-path:none]! motion-reduce:data-ending-style:[clip-path:none]!",
        )}>
        <SheetHeader>
          <SheetTitle>Pesquisar</SheetTitle>
        </SheetHeader>
        <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-col gap-6 px-6 pt-6 pb-8 md:px-8">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Pesquisar peças por nome, categoria ou tecido"
            placeholder="Pesquisar peças"
            autoComplete="off"
            spellCheck={false}
            className="type-h2 h-16 border-0 border-b px-0"
          />

          {noResults && (
            <div className="flex flex-col items-start gap-2">
              <p className="type-h3">Nada corresponde a &ldquo;{query.trim()}&rdquo;.</p>
              <p className="type-body-sm text-muted-foreground">Tente uma categoria.</p>
              <ul className="flex flex-wrap gap-x-6">
                {suggestions.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={routes.category(category.id)}
                      onClick={close}
                      className={cn(buttonVariants({ variant: "link" }), "type-body")}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.pieces.length > 0 && (
            <ul className="min-h-0 overflow-y-auto">
              {result.pieces.map((piece) => (
                <li key={piece.id} className="border-b border-border last:border-b-0">
                  <Link
                    href={routes.piece(piece.id)}
                    onClick={close}
                    className="group grid min-h-11 grid-cols-[4rem_1fr_auto] items-center gap-4 py-3">
                    {thumbnails[piece.id]}
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium group-hover:text-indigo">{piece.name}</span>
                      <span className="type-caption text-muted-foreground">
                        No. {piece.number} · {getCategory(piece.category)!.name} ·{" "}
                        {getCloth(piece.cloth)!.name}
                      </span>
                    </span>
                    <span className="type-price">{formatPrice(piece.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
