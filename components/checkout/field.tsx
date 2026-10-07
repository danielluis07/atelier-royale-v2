"use client";

import { useId, useState, type ComponentProps, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** The voiced message for each way a field can fail; `valueMissing` is always needed. */
export interface FieldMessages {
  readonly valueMissing: string;
  readonly typeMismatch?: string;
  readonly patternMismatch?: string;
}

type Control = HTMLInputElement | HTMLSelectElement;

function voice(validity: ValidityState, messages: FieldMessages): string {
  if (validity.valueMissing) return messages.valueMissing;
  if (validity.typeMismatch && messages.typeMismatch) return messages.typeMismatch;
  return messages.patternMismatch ?? messages.typeMismatch ?? messages.valueMissing;
}

/**
 * Native constraint validation with Millrace's voice (docs/build-guide.md §1).
 * The `invalid` event (fired by the form's checkValidity on submit) swaps the
 * browser bubble for the inline oxide message. Once shown, the message follows
 * the value as it is typed and goes when the field is valid.
 */
function useVoicedValidity(messages: FieldMessages) {
  const id = useId();
  const [error, setError] = useState<string>();

  function onInvalid(event: FormEvent<Control>) {
    event.preventDefault();
    const control = event.currentTarget;
    const message = voice(control.validity, messages);
    control.setCustomValidity(message);
    setError(message);
  }

  function recheck(control: Control) {
    control.setCustomValidity("");
    // checkValidity fires `invalid` again when it fails, which resets the message.
    if (control.checkValidity()) setError(undefined);
  }

  return {
    id,
    error,
    props: {
      id,
      onInvalid,
      onChange: (event: FormEvent<Control>) => {
        if (error) recheck(event.currentTarget);
        else event.currentTarget.setCustomValidity("");
      },
      // Leaving a field the Shopper has already touched (:user-invalid)
      // explains it there and then, not only on submit.
      onBlur: (event: FormEvent<Control>) => {
        if (event.currentTarget.matches(":user-invalid")) recheck(event.currentTarget);
      },
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    },
  };
}

function FieldShell({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-label">
        {label}
        {optional && <span className="text-muted-foreground"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="type-body-sm text-oxide">
          {error}
        </p>
      )}
    </div>
  );
}

// Controls scroll clear of the sticky header and, below lg, the summary bar.
const controlClass =
  "user-invalid:border-destructive scroll-mt-4 max-lg:scroll-mt-20";

export function Field({
  label,
  messages,
  className,
  ...props
}: Omit<ComponentProps<"input">, "id"> & {
  label: string;
  messages?: FieldMessages;
}) {
  const { id, error, props: validity } = useVoicedValidity(
    messages ?? { valueMissing: "" },
  );

  return (
    <FieldShell
      id={id}
      label={label}
      optional={!props.required}
      error={error}
      className={className}>
      <Input {...props} {...validity} className={controlClass} />
    </FieldShell>
  );
}

export function SelectField({
  label,
  messages,
  className,
  children,
  ...props
}: Omit<ComponentProps<"select">, "id"> & {
  label: string;
  messages: FieldMessages;
}) {
  const { id, error, props: validity } = useVoicedValidity(messages);

  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <select
        {...props}
        {...validity}
        className={cn(
          "type-body h-12 w-full border border-input bg-background px-4 text-foreground aria-invalid:border-destructive",
          controlClass,
        )}>
        {children}
      </select>
    </FieldShell>
  );
}
