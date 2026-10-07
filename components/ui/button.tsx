import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// DESIGN.md §6 Buttons. Focus uses the global --ring outline.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border border-transparent whitespace-nowrap select-none transition-colors duration-(--dur-fast) ease-mech disabled:pointer-events-none aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: ink fill, paper text, fill shifts to indigo on hover.
        default:
          "type-label bg-primary text-primary-foreground hover:bg-indigo hover:text-paper disabled:bg-stone disabled:text-ink-muted",
        // Secondary: 1px ink outline, fills with ink on hover.
        secondary:
          "type-label border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background disabled:border-ink-muted disabled:text-ink-muted",
        // Icon-only controls (close, menu): no chrome, indigo on hover.
        ghost:
          "bg-transparent text-foreground hover:text-indigo disabled:text-ink-muted",
        // Text link: the underline (1px, 4px below) draws left to right on
        // hover. The 44px target is kept; the underline hugs the text.
        link: "relative font-sans text-foreground after:absolute after:inset-x-0 after:top-[calc(50%+0.5lh+4px-1px)] after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-(--dur-fast) after:ease-mech hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none disabled:text-ink-muted",
      },
      size: {
        default: "h-12 px-6",
        dense: "h-11 px-6",
        icon: "size-12",
        "icon-dense": "size-11",
      },
    },
    compoundVariants: [
      // The link "default" size is its own inline target, not a 48px block.
      { variant: "link", size: "default", className: "h-11 px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
