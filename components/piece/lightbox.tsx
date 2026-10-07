"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  /** Accessible name for the zoom toggle, e.g. "Chore Coat in Loden, Detail". */
  label: string;
  children: ReactNode;
}

/**
 * The lightbox image (DESIGN.md §5): a click toggles a 2x zoom centred on the
 * click point, the pointer pans while zoomed, and a second click returns to
 * fit. Keyboard activation (Enter/Space) toggles the zoom at the image's
 * centre. Reduced motion makes the zoom instant (motion-reduce:transition-none).
 */
export function ZoomableImage({ label, children }: ZoomableImageProps) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frame = useRef<HTMLButtonElement>(null);

  function originFromPoint(clientX: number, clientY: number) {
    const rect = frame.current!.getBoundingClientRect();
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100),
    };
  }

  function onClick(event: PointerEvent<HTMLButtonElement>) {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    setOrigin(originFromPoint(event.clientX, event.clientY));
    setZoomed(true);
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!zoomed) return;
    setOrigin(originFromPoint(event.clientX, event.clientY));
  }

  return (
    <button
      ref={frame}
      type="button"
      aria-label={zoomed ? `Zoom out, ${label}` : `Zoom in, ${label}`}
      aria-pressed={zoomed}
      onClick={onClick}
      onPointerMove={onPointerMove}
      className={cn(
        "relative block size-full overflow-hidden",
        zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in",
      )}>
      <div
        style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
        className={cn(
          "size-full transition-transform duration-(--dur-base) ease-mech motion-reduce:transition-none",
          zoomed && "scale-[2]",
        )}>
        {children}
      </div>
    </button>
  );
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}
