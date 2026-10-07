"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Stand-in until the footer newsletter lands: no backend, a fake success.
export function NewsletterStub() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="type-lede">
        Noted. The Lookbook comes to you first.
      </p>
    );
  }

  return (
    <form
      className="flex max-w-xl flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}>
      <div className="flex flex-col gap-2">
        <label htmlFor="stub-email" className="type-label">
          Email
        </label>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            id="stub-email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <Button type="submit">Sign up</Button>
        </div>
      </div>
      <label className="flex items-center gap-3 type-body-sm">
        <Checkbox name="lookbook" defaultChecked />
        Send the FW26 Lookbook when it opens
      </label>
    </form>
  );
}
