"use client";

import { useSyncExternalStore } from "react";

// One polite live region for the whole store (docs/build-guide.md §1): quick
// add, cart count, Lookbook position, search count. Mount <LiveRegion /> once
// in the root layout and call announce() from any client code.

let message = "";
let pending: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Clearing first lets the same line be announced twice in a row. */
export function announce(text: string) {
  clearTimeout(pending);
  message = "";
  emit();
  pending = setTimeout(() => {
    message = text;
    emit();
  }, 100);
}

export function LiveRegion() {
  const text = useSyncExternalStore(
    subscribe,
    () => message,
    () => "",
  );

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {text}
    </div>
  );
}
