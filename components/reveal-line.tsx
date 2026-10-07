"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

/** An editorial line that wipes in once when it comes into view. */
export function RevealLine({
  as: Tag = "p",
  className,
  children,
}: {
  as?: "h1" | "h2" | "p";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLElement>();

  return (
    <Tag ref={ref} className={cn("reveal", className)}>
      <span className="block">{children}</span>
    </Tag>
  );
}
