import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

// DESIGN.md §6 Forms: 48 high, 1px ink-muted border, oxide when invalid.
// The label sits above in label style; never use the placeholder as a label.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "type-body h-12 w-full min-w-0 border border-input bg-transparent px-4 text-foreground transition-colors duration-(--dur-fast) ease-mech file:inline-flex file:h-8 file:border-0 file:bg-transparent file:type-label file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-stone disabled:text-ink-muted aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
