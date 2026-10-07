"use client";

import { Suspense, useEffectEvent, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { announce } from "@/components/live-region";
import { Button } from "@/components/ui/button";
import {
  currentFrame,
  describePosition,
  formatCounter,
  stepTarget,
} from "@/lib/lookbook";

/** A Look settles when about this much of it is inside the strip. */
const settled = 0.6;

interface LookbookFlowProps {
  label: string;
  lookCount: number;
  /** The frames, server-rendered. Each carries `data-frame` and `data-look-index`. */
  children: ReactNode;
}

/**
 * Follows ?look= when it changes on a mounted Lookbook; the first landing is
 * handled on mount. Reads the URL, so it sits inside Suspense to keep the
 * route prerendered.
 */
function LookParam({ onChange }: { onChange: (number: string | null) => void }) {
  const look = useSearchParams().get("look");
  const landed = useRef(look);
  useLayoutEffect(() => {
    if (look === landed.current) return;
    landed.current = look;
    onChange(look);
  }, [look, onChange]);
  return null;
}

function frameElements(strip: HTMLElement) {
  return [...strip.querySelectorAll<HTMLElement>("[data-frame]")];
}

/** Where each frame snaps, clamped to the scroll range. */
function snapTargets(strip: HTMLElement, frames: readonly HTMLElement[]) {
  const padding = parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0;
  const max = strip.scrollWidth - strip.clientWidth;
  return frames.map((frame) =>
    Math.min(Math.max(frame.offsetLeft - padding, 0), max),
  );
}

function lookIndexOf(frame: HTMLElement) {
  return Number(frame.dataset.lookIndex);
}

/**
 * The horizontal Lookbook (DESIGN.md §5, docs/build-guide.md §1): a native
 * scroll-snap strip with prev and next, arrow keys, an instant counter that
 * skips Interstitials, and caption reveals as each Look settles.
 */
export function LookbookFlow({ label, lookCount, children }: LookbookFlowProps) {
  const stripRef = useRef<HTMLElement>(null);
  const pending = useRef<number | null>(null);
  const [lookIndex, setLookIndex] = useState(1);
  const [ends, setEnds] = useState({ start: true, end: false });

  function sync() {
    const strip = stripRef.current;
    if (!strip) return;
    const frames = frameElements(strip);
    const targets = snapTargets(strip, frames);
    // Arrival, for browsers without scrollend.
    if (Math.abs(strip.scrollLeft - (pending.current ?? NaN)) < 2) pending.current = null;
    setLookIndex(lookIndexOf(frames[currentFrame(targets, strip.scrollLeft)]));
    setEnds({
      start: stepTarget(targets, strip.scrollLeft, -1) === undefined,
      end: stepTarget(targets, strip.scrollLeft, 1) === undefined,
    });
  }

  function step(direction: 1 | -1) {
    const strip = stripRef.current;
    if (!strip) return;
    const frames = frameElements(strip);
    // Mid smooth scroll, step on from where it is heading, so two quick
    // presses move two snaps.
    const from = pending.current ?? strip.scrollLeft;
    const target = stepTarget(snapTargets(strip, frames), from, direction);
    if (!target) return;
    pending.current = target.left;
    strip.scrollBy({
      left: target.left - strip.scrollLeft,
      behavior: matchMedia("(prefers-reduced-motion: no-preference)").matches
        ? "smooth"
        : "instant",
    });
    announce(describePosition(lookIndexOf(frames[target.frame]), lookCount));
  }

  /** Lands on a Look by its number, without animating. */
  function jumpTo(number: string | null) {
    const strip = stripRef.current;
    if (!strip || !number) return;
    const frames = frameElements(strip);
    const index = frames.findIndex((frame) => frame.dataset.look === number);
    if (index === -1) return;
    pending.current = null;
    strip.scrollTo({ left: snapTargets(strip, frames)[index], behavior: "instant" });
    sync();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  }

  // A deep link (?look=03) lands on its Look before any caption can settle,
  // so only that Look's reveal plays. LookParam follows later changes.
  const land = useEffectEvent(() => {
    jumpTo(new URLSearchParams(window.location.search).get("look"));
    sync();
  });

  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const frames = frameElements(strip);
    land();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < settled - 0.01) continue;
          entry.target.querySelector(".reveal")?.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { root: strip, threshold: settled },
    );
    for (const frame of frames) {
      if (frame.dataset.frame === "look") observer.observe(frame);
    }

    let frame = 0;
    const onChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    const onScrollEnd = () => {
      pending.current = null;
    };
    strip.addEventListener("scroll", onChange, { passive: true });
    strip.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onChange);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      strip.removeEventListener("scroll", onChange);
      strip.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return (
    <div onKeyDown={onKeyDown} className="flex flex-col gap-6">
      <section
        ref={stripRef}
        aria-label={label}
        tabIndex={0}
        className="lookbook-strip relative overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-px-4 outline-offset-[-2px] md:scroll-px-8 lg:scroll-px-12">
        {children}
        <Suspense fallback={null}>
          <LookParam onChange={jumpTo} />
        </Suspense>
      </section>

      <div className="mx-auto flex w-full max-w-[1536px] items-center justify-between gap-6 border-t px-4 pt-4 md:px-8 lg:px-12">
        <p className="type-caption tabular-nums">
          <span aria-hidden="true">{formatCounter(lookIndex, lookCount)}</span>
          <span className="sr-only">{describePosition(lookIndex, lookCount)}</span>
        </p>
        <div className="hidden gap-2 can-hover:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous Look"
            aria-disabled={ends.start}
            onClick={() => step(-1)}
            className="aria-disabled:text-ink-muted aria-disabled:hover:text-ink-muted">
            <ArrowLeftIcon aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next Look"
            aria-disabled={ends.end}
            onClick={() => step(1)}
            className="aria-disabled:text-ink-muted aria-disabled:hover:text-ink-muted">
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
