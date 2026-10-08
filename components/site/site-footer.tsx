import Link from "next/link";
import { RaceLine } from "@/components/brand/race-line";
import { Wordmark } from "@/components/brand/wordmark";
import {
  SupportSheetTrigger,
  type SupportTopic,
} from "@/components/support/support-sheets";
import { buttonVariants } from "@/components/ui/button";
import { getCategories, getLookbook } from "@/lib/catalog";
import { routes } from "@/lib/routes";
import { showcaseCredit } from "@/lib/site";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "./newsletter-form";

const linkClass = cn(
  buttonVariants({ variant: "link" }),
  "type-body-sm justify-start",
);

const supportTopics: { topic: SupportTopic; label: string }[] = [
  { topic: "shipping", label: "Envio" },
  { topic: "returns", label: "Devoluções" },
  { topic: "repairs", label: "Reparos" },
  { topic: "size-guide", label: "Guia de tamanhos" },
];

// Four hairline-ruled columns on desktop, stacked on mobile (DESIGN.md §6).
// Support links open sheets, never pages. The footer keeps its own
// view-transition name so it holds still while the page body crossfades.
export function SiteFooter() {
  const lookbook = getLookbook();

  return (
    <footer className="border-t border-border [view-transition-name:site-footer]">
      <div className="mx-auto w-full max-w-[1536px] px-4 md:px-8 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Loja">
            <ul>
              <li>
                <Link href={routes.shop} className={linkClass}>
                  Todas as peças
                </Link>
              </li>
              {getCategories().map((category) => (
                <li key={category.id}>
                  <Link
                    href={routes.category(category.id)}
                    className={linkClass}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Lookbook">
            <p className="type-lede max-w-[32ch]">{lookbook.intro}</p>
            <Link href={routes.lookbook} className={cn(linkClass, "mt-2")}>
              Ver o lookbook {lookbook.seasonLabel}
            </Link>
          </FooterColumn>

          <FooterColumn title="Atendimento">
            <ul>
              {supportTopics.map(({ topic, label }) => (
                <li key={topic}>
                  <SupportSheetTrigger topic={topic} className={linkClass}>
                    {label}
                  </SupportSheetTrigger>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Novidades por e-mail">
            <p className="type-body-sm text-muted-foreground max-w-[40ch]">
              Novas peças, tecidos e fotos do lookbook. Alguns e-mails por
              temporada.
            </p>
            <NewsletterForm />
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-6 border-t border-border py-10 md:flex-row md:items-end md:justify-between">
          <div className="flex w-fit flex-col gap-4">
            <Wordmark className="text-lg" />
            <RaceLine />
          </div>
          <p className="type-caption text-muted-foreground max-w-[52ch]">
            Site de demonstração criado por {showcaseCredit.name}. Millrace e
            Hollins Weir são fictícios. As compras são simuladas, sem cobrança
            ou envio.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-border py-8 first:border-t-0 md:nth-2:border-t-0 lg:border-t-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
      <h2 className="type-label">{title}</h2>
      {children}
    </section>
  );
}
