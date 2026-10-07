import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";

// Four preloaded files in all (docs/build-guide.md): Newsreader roman and
// italic, Archivo with its width axis, IBM Plex Mono regular.

export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
