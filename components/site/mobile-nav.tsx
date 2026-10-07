"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/lib/routes";
import type { NavItem } from "./nav-items";

// Below 1024: a full-height sheet from the left with large serif links,
// Lookbook first (DESIGN.md §5, §6). Following a link closes the sheet.
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-dense" className="-ml-3 lg:hidden" />
        }>
        <MenuIcon strokeWidth={1.5} />
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Principal" className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="type-h1 flex min-h-11 items-center py-2 transition-colors duration-(--dur-fast) ease-mech hover:text-indigo">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="flex-row items-center justify-between">
          <Link
            href={routes.shop}
            onClick={close}
            className="type-label flex min-h-11 items-center hover:text-indigo">
            Todas as peças
          </Link>
          <span className="type-caption text-muted-foreground">Hollins Weir</span>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
