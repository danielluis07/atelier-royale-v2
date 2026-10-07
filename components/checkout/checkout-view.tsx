"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useCart } from "@/components/cart/use-cart";
import { SpecHeading } from "@/components/piece/spec-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { resolveLines, type CartItem } from "@/lib/cart";
import { formatPieceCount, formatPrice } from "@/lib/format";
import {
  deliveryMethods,
  FREE_SHIPPING_FROM,
  getShippingCost,
  orderStore,
  type DeliveryMethod,
} from "@/lib/order";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Field, SelectField } from "./field";
import { usStates } from "./us-states";

/** The fake pending state before the order is written (#7). */
const PLACING_MS = 600;

interface CheckoutViewProps {
  /** Still-life thumbnails by `pieceId/colourwayId`. */
  thumbnails: Readonly<Record<string, ReactNode>>;
}

// DESIGN.md §6 Forms and Checkout: one page of numbered spec-sheet sections
// beside a sticky order summary (from lg), which collapses to a bar under the
// nav below lg. The form is always rendered, so nothing shifts when the saved
// cart loads; only the summary and the Place order button wait for it.
export function CheckoutView({ thumbnails }: CheckoutViewProps) {
  const router = useRouter();
  const hasHydrated = useCart((state) => state.hasHydrated);
  const lines = useCart((state) => state.lines);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  // Frozen at submit: placing the order empties the cart, and the page must
  // keep showing what is being ordered until the confirmation replaces it.
  const [placing, setPlacing] = useState<readonly CartItem[] | null>(null);

  const items = placing ?? resolveLines(lines);
  const isEmpty = hasHydrated && items.length === 0;
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = getShippingCost(delivery, subtotal);
  const totals = { subtotal, shipping, total: subtotal + shipping };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (placing || !hasHydrated || isEmpty) return;
    const form = event.currentTarget;

    // checkValidity fires `invalid` on every failing field, which sets its
    // voiced message; flushSync commits those messages before focus moves, so
    // the first invalid field is announced with its message.
    let valid = true;
    flushSync(() => {
      valid = form.checkValidity();
    });
    if (!valid) {
      form.querySelector<HTMLElement>("input:invalid, select:invalid")?.focus();
      return;
    }

    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    setPlacing(items);
    setTimeout(() => {
      const order = orderStore.getState().placeOrder({
        email: value("email"),
        delivery,
        address: {
          firstName: value("firstName"),
          lastName: value("lastName"),
          line1: value("line1"),
          line2: value("line2"),
          city: value("city"),
          state: value("state"),
          zip: value("zip"),
        },
      });
      if (order) router.push(routes.confirmation);
      else setPlacing(null);
    }, PLACING_MS);
  }

  const summary = (
    <OrderSummary
      items={items}
      hasHydrated={hasHydrated}
      thumbnails={thumbnails}
      totals={totals}
    />
  );

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 pt-0 pb-24 md:px-8 lg:px-12 lg:pt-12 lg:pb-32">
      <SummaryBar total={hasHydrated && !isEmpty ? totals.total : undefined}>
        {summary}
      </SummaryBar>

      <div className="flex flex-col gap-12 pt-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pt-0">
        <div className="flex flex-col gap-12 lg:col-span-7">
          <h1 className="type-h1">Finalizar compra</h1>

          <form
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-16">
            <Section number="01" title="Contato">
              <Field
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                required
                messages={{
                  valueMissing: "Informe um e-mail para receber a confirmação do pedido.",
                  typeMismatch: "Este e-mail está incompleto. Use o formato nome@exemplo.com.",
                }}
              />
            </Section>

            <Section number="02" title="Envio">
              <div className="grid gap-6 md:grid-cols-2">
                <Field
                  label="Nome"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  messages={{ valueMissing: "Informe o nome de quem recebe." }}
                />
                <Field
                  label="Sobrenome"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  messages={{ valueMissing: "Informe o sobrenome de quem recebe." }}
                />
                <Field
                  label="Endereço"
                  name="line1"
                  autoComplete="address-line1"
                  required
                  className="md:col-span-2"
                  messages={{ valueMissing: "Informe a rua e o número." }}
                />
                <Field
                  label="Apartamento, sala"
                  name="line2"
                  autoComplete="address-line2"
                  className="md:col-span-2"
                />
                <Field
                  label="Cidade"
                  name="city"
                  autoComplete="address-level2"
                  required
                  className="md:col-span-2"
                  messages={{ valueMissing: "Informe a cidade." }}
                />
                <SelectField
                  label="Estado"
                  name="state"
                  autoComplete="address-level1"
                  required
                  defaultValue=""
                  messages={{ valueMissing: "Escolha o estado." }}>
                  <option value="" disabled>
                    Escolha
                  </option>
                  {usStates.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </SelectField>
                <Field
                  label="ZIP code"
                  name="zip"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  pattern="\d{5}(-\d{4})?"
                  maxLength={10}
                  required
                  messages={{
                    valueMissing: "Informe o ZIP code.",
                    patternMismatch: "O ZIP code tem 5 dígitos, como 12534.",
                  }}
                />
              </div>
              <p className="type-caption text-muted-foreground">
                Enviamos apenas para os Estados Unidos.
              </p>
            </Section>

            <Section number="03" title="Entrega">
              <DeliveryOptions value={delivery} subtotal={subtotal} onChange={setDelivery} />
            </Section>

            <Section number="04" title="Pagamento">
              <div className="flex flex-col gap-6 bg-stone p-6 md:p-8">
                <p className="type-lede max-w-[36ch]">
                  Loja de demonstração, nenhum pagamento é cobrado.
                </p>
                {isEmpty ? (
                  <p className="type-body-sm">
                    Sua sacola está vazia, então não há pedido a fazer.{" "}
                    <Link
                      href={routes.lookbook}
                      className={cn(buttonVariants({ variant: "link" }), "type-body-sm h-auto")}>
                      Abrir o Lookbook
                    </Link>
                  </p>
                ) : (
                  <p className="type-body-sm text-muted-foreground">
                    Total {formatPrice(totals.total)}, com frete incluído.
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  {/* Stays focusable while placing: aria-disabled, not disabled. */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isEmpty}
                    aria-disabled={!hasHydrated || placing ? true : undefined}>
                    Fazer pedido
                  </Button>
                  <p role="status" className="type-caption min-h-[1.4em] text-center">
                    {placing && "Fazendo o pedido…"}
                  </p>
                </div>
              </div>
            </Section>
          </form>
        </div>

        <aside
          aria-label="Resumo do pedido"
          className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-[calc(var(--header-height)+2rem)] flex flex-col gap-6">
            <h2 className="type-label border-b border-foreground pb-3">Resumo do pedido</h2>
            {summary}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  const id = `checkout-${number}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6 border-t border-border pt-6">
      <SpecHeading id={id} number={number}>
        {title}
      </SpecHeading>
      {children}
    </section>
  );
}

function DeliveryOptions({
  value,
  subtotal,
  onChange,
}: {
  value: DeliveryMethod;
  subtotal: number;
  onChange: (method: DeliveryMethod) => void;
}) {
  const id = useId();

  return (
    <fieldset className="flex flex-col">
      <legend className="sr-only">Forma de entrega</legend>
      {(Object.keys(deliveryMethods) as DeliveryMethod[]).map((method) => {
        const cost = getShippingCost(method, subtotal);
        return (
          <label
            key={method}
            htmlFor={`${id}-${method}`}
            className="-mt-px flex min-h-16 cursor-pointer items-center gap-4 border border-input px-4 py-3 has-checked:z-10 has-checked:border-foreground">
            <input
              id={`${id}-${method}`}
              type="radio"
              name="delivery"
              value={method}
              checked={value === method}
              onChange={() => onChange(method)}
              className="size-4 shrink-0 accent-ink"
            />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="font-medium">{deliveryMethods[method].name}</span>
              <span className="type-body-sm text-muted-foreground">
                {deliveryMethods[method].days}
                {method === "standard" &&
                  `, grátis a partir de ${formatPrice(FREE_SHIPPING_FROM)}`}
              </span>
            </span>
            <span className="type-price">{cost === 0 ? "Grátis" : formatPrice(cost)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

/** Below lg: a disclosure bar under the nav that opens the summary in place. */
function SummaryBar({ total, children }: { total?: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="sticky top-(--header-height) z-30 -mx-4 border-b border-border bg-stone md:-mx-8 lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex h-14 w-full items-center justify-between gap-4 px-4 md:px-8">
        <span className="type-label flex items-center gap-2">
          {open ? "Ocultar resumo do pedido" : "Ver resumo do pedido"}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-(--dur-fast) ease-mech motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </span>
        {total !== undefined && <span className="type-price">{formatPrice(total)}</span>}
      </button>
      <div
        id={id}
        hidden={!open}
        className="max-h-[calc(100dvh-var(--header-height)-3.5rem)] overflow-y-auto px-4 pb-6 md:px-8">
        {children}
      </div>
    </div>
  );
}

function OrderSummary({
  items,
  hasHydrated,
  thumbnails,
  totals,
}: {
  items: readonly CartItem[];
  hasHydrated: boolean;
  thumbnails: Readonly<Record<string, ReactNode>>;
  totals: { subtotal: number; shipping: number; total: number };
}) {
  // Nothing shows until the saved cart has loaded: no empty-bag flash.
  if (!hasHydrated) return <div className="min-h-40" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 py-4">
        <p className="type-h3">Sua sacola está vazia.</p>
        <Link href={routes.lookbook} className={cn(buttonVariants({ variant: "link" }), "type-body")}>
          Abrir o Lookbook
        </Link>
      </div>
    );
  }

  const count = items.reduce((sum, item) => sum + item.line.qty, 0);

  return (
    <div className="flex flex-col gap-4">
      <p className="type-caption text-muted-foreground">{formatPieceCount(count)}</p>
      <ul>
        {items.map(({ key, line, piece, colorway, lineTotal }) => (
          <li
            key={key}
            className="grid grid-cols-[4rem_1fr] gap-4 border-b border-border py-4 first:pt-0">
            <div aria-hidden="true">{thumbnails[`${piece.id}/${colorway.id}`]}</div>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="type-caption">No. {piece.number}</span>
                <span className="type-price">{formatPrice(lineTotal)}</span>
              </div>
              <span className="font-medium">{piece.name}</span>
              <span className="type-body-sm text-muted-foreground">
                {colorway.name} · {line.size}
                {line.qty > 1 && <> · {line.qty} × {formatPrice(piece.price)}</>}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-2">
        <Total label="Subtotal" value={formatPrice(totals.subtotal)} />
        <Total
          label="Frete"
          value={totals.shipping === 0 ? "Grátis" : formatPrice(totals.shipping)}
        />
        <Total label="Total" value={formatPrice(totals.total)} strong />
      </dl>
      <p className="type-caption text-muted-foreground">
        Reparos gratuitos para toda a vida, em Hollins Weir.
      </p>
    </div>
  );
}

function Total({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
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
