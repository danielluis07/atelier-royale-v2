"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addTransitionType,
  startTransition,
  useEffect,
  useId,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  ViewTransition,
  type ReactNode,
} from "react";
import { ChevronDownIcon } from "lucide-react";
import { announce } from "@/components/live-region";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories, getCollection, type CollectionSort } from "@/lib/catalog";
import {
  activeFilterCount,
  collectionHref,
  describeCollection,
  emptyQuery,
  getFilterOptions,
  parseCollectionQuery,
  sortOptions,
  toggle,
  withCategory,
  withoutFilters,
  type CollectionQuery,
} from "@/lib/collection";
import { formatPieceCount } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Marks filter navigations so only the grid crossfades (globals.css). */
const filterTransition = "collection-filter";
/** The Look tile sits after the fourth card, or last in a shorter grid. */
const lookTilePosition = 4;

interface CollectionViewProps {
  /** Server-rendered Piece cards by Piece id, so images stay on the server. */
  cards: Readonly<Record<string, ReactNode>>;
  lookTile: ReactNode;
}

/** Reads the filters from the URL; must sit inside a Suspense boundary. */
export function CollectionFromUrl(props: CollectionViewProps) {
  const params = useSearchParams();
  const query = useMemo(() => parseCollectionQuery(params), [params]);
  return <CollectionView query={query} {...props} />;
}

/** The prerendered stand-in until the URL is known: All Pieces. */
export function CollectionFallback(props: CollectionViewProps) {
  return <CollectionView query={emptyQuery} {...props} />;
}

function CollectionView({
  query,
  cards,
  lookTile,
}: CollectionViewProps & { query: CollectionQuery }) {
  const router = useRouter();
  // Controls follow the click at once; the grid follows the committed URL.
  const [pending, setPending] = useOptimistic(query);
  // Two clicks can land before a re-render; each change starts from the
  // latest queued query, not the last rendered one.
  const latest = useRef(pending);
  useEffect(() => {
    latest.current = pending;
  }, [pending]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const focusResults = useRef(false);

  const pieces = getCollection({
    category: query.category,
    cloth: query.cloths,
    size: query.sizes,
    color: query.colors,
    sort: query.sort,
  });
  const { kicker, title, intro } = describeCollection(query);
  const href = collectionHref(query);
  const filterCount = activeFilterCount(pending);

  function navigate(update: (current: CollectionQuery) => CollectionQuery) {
    const next = update(latest.current);
    latest.current = next;
    startTransition(() => {
      addTransitionType(filterTransition);
      setPending(next);
      router.push(collectionHref(next), { scroll: false });
    });
  }

  function clearFilters() {
    focusResults.current = true;
    navigate(withoutFilters);
  }

  // Announce the new count after a change, never on arrival.
  const announced = useRef(href);
  useEffect(() => {
    if (announced.current === href) return;
    announced.current = href;
    announce(
      pieces.length
        ? formatPieceCount(pieces.length)
        : "No Pieces match these filters.",
    );
    if (focusResults.current) {
      focusResults.current = false;
      resultsRef.current?.focus();
    }
  }, [href, pieces.length]);

  const items = pieces.map((piece) => (
    <li key={piece.id}>{cards[piece.id]}</li>
  ));
  items.splice(
    Math.min(lookTilePosition, items.length),
    0,
    <li key="look-tile">{lookTile}</li>,
  );

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 pb-24 md:px-8 lg:px-12 lg:pb-32">
      <header className="flex flex-col gap-4 py-12 md:py-16 lg:py-24">
        <p className="type-label text-muted-foreground">{kicker}</p>
        <h1 className="type-h1">{title}</h1>
        <p className="type-lede max-w-[52ch]">{intro}</p>
      </header>

      <nav aria-label="Categories" className="border-t border-border py-4">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Chip query={withCategory(pending, undefined)} active={!pending.category}>
              All
            </Chip>
          </li>
          {getCategories().map((category) => (
            <li key={category.id}>
              <Chip
                query={withCategory(pending, category.id)}
                active={pending.category === category.id}>
                {category.name}
              </Chip>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-y border-border py-2">
        <Button
          variant="ghost"
          size="dense"
          className="type-label -ml-6 lg:hidden"
          aria-expanded={filtersOpen}
          aria-controls="collection-filters"
          onClick={() => setFiltersOpen((open) => !open)}>
          Filter{filterCount > 0 && ` · ${filterCount}`}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "transition-transform duration-(--dur-fast) ease-mech motion-reduce:transition-none",
              filtersOpen && "rotate-180",
            )}
          />
        </Button>
        <p className="type-label hidden lg:block">Filter</p>
        <div className="ml-auto flex items-center gap-6">
          <p className="type-caption text-muted-foreground">
            {formatPieceCount(pieces.length)}
          </p>
          <SortSelect
            value={pending.sort}
            onChange={(sort) => navigate((current) => ({ ...current, sort }))}
          />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-6">
        <div
          id="collection-filters"
          className={cn("lg:col-span-3", !filtersOpen && "max-lg:hidden")}>
          <Filters
            query={pending}
            onChange={navigate}
            onClear={clearFilters}
          />
        </div>

        <div
          ref={resultsRef}
          tabIndex={-1}
          aria-label={`${title}, ${formatPieceCount(pieces.length)}`}
          role="region"
          className="pt-6 outline-none lg:col-span-9 lg:pt-8">
          {/* One block crossfade per filter change; cards never move on
              their own (DESIGN.md §5). */}
          <ViewTransition
            default="none"
            update={{ [filterTransition]: "collection-grid", default: "none" }}>
            <div>
              {pieces.length ? (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:gap-x-6 lg:gap-y-12">
                  {items}
                </ul>
              ) : (
                <EmptyState
                  canClear={activeFilterCount(query) > 0}
                  onClear={clearFilters}
                />
              )}
            </div>
          </ViewTransition>
        </div>
      </div>
    </div>
  );
}

function Chip({
  query,
  active,
  children,
}: {
  query: CollectionQuery;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={collectionHref(query)}
      scroll={false}
      transitionTypes={[filterTransition]}
      aria-current={active ? "true" : undefined}
      className={cn(
        "type-label inline-flex h-11 items-center border px-4 transition-colors duration-(--dur-base) ease-mech",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input text-foreground hover:border-foreground",
      )}>
      {children}
    </Link>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: CollectionSort;
  onChange: (sort: CollectionSort) => void;
}) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="type-label text-muted-foreground">
        Sort
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as CollectionSort)}
          className="type-body-sm h-11 appearance-none border border-input bg-background pr-10 pl-3 text-foreground">
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
        />
      </div>
    </div>
  );
}

function Filters({
  query,
  onChange,
  onClear,
}: {
  query: CollectionQuery;
  onChange: (update: (current: CollectionQuery) => CollectionQuery) => void;
  onClear: () => void;
}) {
  const options = getFilterOptions(query.category, query);

  return (
    <div className="flex flex-col pb-6 lg:pt-4">
      <FilterGroup legend="Size">
        {options.sizes.map((run) => (
          <div key={run.label} className="flex flex-col">
            {options.sizes.length > 1 && (
              <p className="type-caption pt-2 text-muted-foreground">{run.label}</p>
            )}
            <div className="grid grid-cols-3 gap-x-4 sm:grid-cols-5 lg:grid-cols-3">
              {run.sizes.map((size) => (
                <Option
                  key={size}
                  checked={query.sizes.includes(size)}
                  onToggle={() =>
                    onChange((current) => ({
                      ...current,
                      sizes: toggle(current.sizes, size),
                    }))
                  }>
                  <span className="font-mono">{size}</span>
                </Option>
              ))}
            </div>
          </div>
        ))}
      </FilterGroup>

      <FilterGroup legend="Colour">
        <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">
          {options.colors.map((color) => (
            <Option
              key={color.id}
              checked={query.colors.includes(color.id)}
              onToggle={() =>
                onChange((current) => ({
                  ...current,
                  colors: toggle(current.colors, color.id),
                }))
              }>
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full border border-hairline"
                style={{ backgroundColor: color.swatch }}
              />
              {color.name}
            </Option>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup legend="Cloth">
        <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">
          {options.cloths.map((cloth) => (
            <Option
              key={cloth.id}
              checked={query.cloths.includes(cloth.id)}
              onToggle={() =>
                onChange((current) => ({
                  ...current,
                  cloths: toggle(current.cloths, cloth.id),
                }))
              }>
              {cloth.name}
            </Option>
          ))}
        </div>
      </FilterGroup>

      {activeFilterCount(query) > 0 && (
        <Button variant="link" className="self-start" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-border py-4 first:pt-4 lg:first:pt-0">
      <legend className="type-label float-left w-full pb-2">{legend}</legend>
      <div className="clear-left flex flex-col">{children}</div>
    </fieldset>
  );
}

function Option({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <label className="type-body-sm flex min-h-11 cursor-pointer items-center gap-3">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className="flex items-center gap-2">{children}</span>
    </label>
  );
}

function EmptyState({
  canClear,
  onClear,
}: {
  canClear: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-6 py-12 lg:py-16">
      <p className="type-h3 max-w-[28ch]">
        No Piece is made in that combination.
      </p>
      <div className="flex flex-wrap items-center gap-6">
        {canClear && (
          <Button variant="secondary" onClick={onClear}>
            Clear filters
          </Button>
        )}
        <Link
          href={routes.shop}
          scroll={false}
          transitionTypes={[filterTransition]}
          className={buttonVariants({ variant: "link" })}>
          See all Pieces
        </Link>
      </div>
    </div>
  );
}
