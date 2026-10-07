"use client";

import { useCallback } from "react";

/**
 * Editorial reveal (DESIGN.md §5): give an element the `reveal` class and this
 * ref. When it first comes into view it gains `is-revealed`, once, and the
 * observer lets go. The CSS wipes the element's children, so wrap bare text in
 * a span. The text is in the DOM from the start; the CSS only clips it, and
 * never under reduced motion or without scripting.
 */
export function useReveal<T extends Element>() {
  return useCallback((element: T | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("is-revealed");
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
}
