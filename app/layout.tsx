import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { archivo, newsreader, plexMono } from "@/fonts";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { LiveRegion } from "@/components/live-region";
import { SiteFooter, CornerMark } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SupportSheets } from "@/components/support/support-sheets";

export const metadata: Metadata = {
  title: {
    default: "Millrace",
    template: "%s · Millrace",
  },
  description:
    "Roupas de trabalho em tecidos pesados, cortadas e costuradas em Hollins Weir. Jaquetas, camisas, calças, malhas e botas, reparadas para a vida toda.",
  applicationName: "Millrace",
};

export const viewport: Viewport = {
  themeColor: "#fcfbf9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full antialiased",
        newsreader.variable,
        archivo.variable,
        plexMono.variable,
      )}>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="type-label sr-only z-50 bg-primary px-4 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:flex focus:h-11 focus:items-center">
          Ir para o conteúdo
        </a>
        <SiteHeader />
        {/* Every route change crossfades the body (DESIGN.md §5); Collection
            filter changes and Colourway swaps crossfade only their images. */}
        <ViewTransition
          update={{
            "collection-filter": "none",
            "piece-colourway": "none",
            default: "page-body",
          }}
          default="none">
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </main>
        </ViewTransition>
        <SiteFooter />
        <CornerMark />
        <SupportSheets />
        <CartDrawer />
        <LiveRegion />
      </body>
    </html>
  );
}
