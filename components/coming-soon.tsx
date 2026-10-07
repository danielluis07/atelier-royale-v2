import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Holds a route the nav and footer already link to until its page lands, so
// no link is a dead end. The Lookbook (#28) replaces it.
export function ComingSoon({
  kicker,
  title,
  line,
  link,
}: {
  kicker: string;
  title: string;
  line: string;
  link: { href: string; label: string };
}) {
  return (
    <section className="mx-auto flex w-full max-w-[1536px] flex-col gap-6 px-4 py-16 md:px-8 md:py-24 lg:px-12 lg:py-32">
      <p className="type-label text-muted-foreground">{kicker}</p>
      <h1 className="type-h1 max-w-[16ch]">{title}</h1>
      <p className="type-lede max-w-[52ch]">{line}</p>
      <Link
        href={link.href}
        className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>
        {link.label}
      </Link>
    </section>
  );
}
