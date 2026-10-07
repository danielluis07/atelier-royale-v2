import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { archivo, newsreader, plexMono } from "@/fonts";

export const metadata: Metadata = {
  title: {
    default: "Millrace",
    template: "%s · Millrace",
  },
  description:
    "Heavy cloth, plain cut. Jackets, shirts, trousers, knitwear and boots, made at Hollins Weir and mended free for life.",
  applicationName: "Millrace",
};

export const viewport: Viewport = {
  themeColor: "#fcfbf9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        newsreader.variable,
        archivo.variable,
        plexMono.variable,
      )}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
