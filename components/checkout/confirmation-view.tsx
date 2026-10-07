"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SpecHeading } from "@/components/piece/spec-heading";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { deliveryMethods, orderStore, type Order } from "@/lib/order";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useOrder } from "./use-order";

// DESIGN.md §6 Order confirmation: the order number in mono, the lines at the
// prices paid in the ledger style, and what happens next, ending on the
// repair promise. The order comes from sessionStorage, so nothing renders
// until it has loaded; then focus moves to the H1 (docs/build-guide.md §1).
export function ConfirmationView() {
  const hasHydrated = useOrder((state) => state.hasHydrated);
  const order = useOrder((state) => state.order);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    orderStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hasHydrated) heading.current?.focus();
  }, [hasHydrated]);

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-[1536px] px-4 pt-12 pb-24 md:px-8 lg:px-12 lg:pt-16 lg:pb-32">
      {hasHydrated &&
        (order ? (
          <Placed order={order} headingRef={heading} />
        ) : (
          <NoOrder headingRef={heading} />
        ))}
    </div>
  );
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

function Placed({ order, headingRef }: { order: Order; headingRef: HeadingRef }) {
  const delivery = deliveryMethods[order.delivery];
  const { city, state } = order.address;

  return (
    <div className="flex flex-col gap-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div className="flex flex-col gap-6 lg:col-span-5">
        <h1 ref={headingRef} tabIndex={-1} className="type-h1 outline-none">
          Pedido realizado.
        </h1>
        <dl className="flex flex-col gap-1">
          <dt className="type-label">Número do pedido</dt>
          <dd className="font-mono text-2xl tracking-wide">{order.number}</dd>
        </dl>
        <p className="type-lede max-w-[36ch]">
          Obrigado. A confirmação segue para {order.email}.
        </p>
      </div>

      <div className="flex flex-col gap-16 lg:col-span-6 lg:col-start-7">
        <section aria-labelledby="order-pieces" className="flex flex-col gap-6">
          <SpecHeading id="order-pieces" number="01">
            Peças
          </SpecHeading>
          <OrderLedger order={order} />
        </section>

        <section aria-labelledby="order-next" className="flex flex-col gap-6">
          <SpecHeading id="order-next" number="02">
            O que acontece agora
          </SpecHeading>
          <ol className="border-t border-foreground">
            {[
              "O pedido é separado e embalado em Hollins Weir.",
              "Ele sai do moinho em até 2 dias úteis, com um link de rastreamento por e-mail.",
              `A entrega ${delivery.name.toLowerCase()} chega a ${city}, ${state} em ${delivery.days}.`,
              "Quando uma peça precisar de reparo, mande-a de volta ao moinho. Reparos gratuitos para toda a vida.",
            ].map((step, index, steps) => (
              <li
                key={index}
                className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-border py-4">
                <span className="type-caption text-muted-foreground" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={cn(index === steps.length - 1 ? "type-lede" : "type-body")}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <Link
            href={routes.lookbook}
            className={cn(buttonVariants({ variant: "link" }), "type-body self-start")}>
            Voltar ao Lookbook
          </Link>
        </section>
      </div>
    </div>
  );
}

function OrderLedger({ order }: { order: Order }) {
  return (
    <div className="flex flex-col">
      <ul className="border-t border-foreground">
        {order.lines.map((line) => (
          <li
            key={`${line.pieceId}/${line.colourwayId}/${line.size}`}
            className="grid grid-cols-[3.5rem_1fr_auto] gap-x-4 gap-y-1 border-b border-border py-4">
            <span className="type-caption pt-1">No. {line.number}</span>
            <span className="flex flex-col gap-1">
              <span className="font-medium">{line.name}</span>
              <span className="type-proof text-muted-foreground">
                {line.colourwayName} · {line.size} · {line.qty} × {formatPrice(line.unitPrice)}
              </span>
            </span>
            <span className="type-price pt-1">{formatPrice(line.unitPrice * line.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-2 pt-4">
        <LedgerTotal label="Subtotal" value={formatPrice(order.subtotal)} />
        <LedgerTotal
          label={`Frete, ${deliveryMethods[order.delivery].name.toLowerCase()}`}
          value={order.shipping === 0 ? "Grátis" : formatPrice(order.shipping)}
        />
        <LedgerTotal label="Total pago" value={formatPrice(order.total)} strong />
      </dl>
    </div>
  );
}

function LedgerTotal({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between",
        strong && "mt-2 border-t border-foreground pt-3",
      )}>
      <dt className="type-label">{label}</dt>
      <dd className="type-price">{value}</dd>
    </div>
  );
}

function NoOrder({ headingRef }: { headingRef: HeadingRef }) {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-2">
        <h1 ref={headingRef} tabIndex={-1} className="type-h1 max-w-[16ch] outline-none">
          Nenhum pedido por aqui.
        </h1>
        <p className="type-lede max-w-[40ch]">
          A confirmação de um pedido fica nesta página até a aba ser fechada. O Lookbook
          continua aberto.
        </p>
        <Link
          href={routes.lookbook}
          className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>
          Ver o Lookbook
        </Link>
      </div>
    </div>
  );
}
