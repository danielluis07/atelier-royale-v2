"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// One field and a button, no request: submitting swaps the form for a serif
// confirmation line and moves focus to it, so focus is never dropped.
export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const confirmation = useRef<HTMLParagraphElement>(null);
  const id = useId();

  useEffect(() => {
    if (done) confirmation.current?.focus();
  }, [done]);

  if (done) {
    return (
      <p ref={confirmation} tabIndex={-1} className="type-lede max-w-[32ch]">
        Noted. The FW26 Lookbook comes to you first.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}>
      <label htmlFor={id} className="type-label">
        Email
      </label>
      <div className="flex flex-wrap gap-3">
        <Input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          required
          className="min-w-48 flex-1"
        />
        <Button type="submit" variant="secondary">
          Sign up
        </Button>
      </div>
    </form>
  );
}
