import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { CartTrigger } from "@/components/cart/cart-trigger";
import { Wordmark } from "@/components/brand/wordmark";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { MobileNav } from "./mobile-nav";
import { getNavItems } from "./nav-items";

// Flat bar from 1024 up; below it a menu button opens the left nav sheet
// (DESIGN.md §4). The header keeps its own view-transition name so it holds
// still while the page body crossfades.
export function SiteHeader() {
  const items = getNavItems();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background [view-transition-name:site-header]">
      <div className="mx-auto grid h-(--header-height) w-full max-w-[1536px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-8 lg:flex lg:gap-12 lg:px-12">
        <MobileNav items={items} />

        <Link
          href={routes.home}
          className="flex h-11 items-center justify-self-center"
          aria-label="Millrace, home">
          <Wordmark className="text-base" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(buttonVariants({ variant: "link" }), "type-label")}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end lg:ml-auto">
          <SearchTrigger />
          <CartTrigger />
        </div>
      </div>
    </header>
  );
}

// Placeholder for the search overlay (#31), which replaces it with a live
// trigger.
function SearchTrigger() {
  return (
    <Button variant="ghost" size="icon-dense" disabled>
      <SearchIcon strokeWidth={1.5} />
      <span className="sr-only">Search</span>
    </Button>
  );
}
