import type { Metadata } from "next";
import { LookbookFlow } from "@/components/lookbook/lookbook-flow";
import { MillraceImage } from "@/components/millrace-image";
import { RevealLine } from "@/components/reveal-line";
import { getLookbook, getLooks, type Interstitial, type Look } from "@/lib/catalog";
import { lookAlt, lookIndexAt } from "@/lib/lookbook";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "FW26 at Hollins Weir: eight Looks in heavy cloth, from the first leaves to frost on the weir.",
};

const frameWidth = {
  "4:5": "lookbook-frame-portrait",
  "3:2": "lookbook-frame-landscape",
  "1:1": "lookbook-frame-portrait",
} as const;

function imageSlot(frame: Look | Interstitial) {
  return frame.aspect === "3:2" ? "look-landscape" : "look-portrait";
}

// The signature flow (DESIGN.md §5): the cover, 8 Looks and 2 Interstitials
// in catalog order. Everything is prerendered here, images included; the flow
// only adds scrolling, the counter and the reveals.
export default function LookbookPage() {
  const lookbook = getLookbook();
  const lookCount = getLooks().length;

  return (
    <div className="flex flex-1 flex-col pt-6 pb-16 md:pt-8 md:pb-24">
      <LookbookFlow label={`Lookbook, ${lookbook.seasonLabel}`} lookCount={lookCount}>
        <div className="flex w-max items-start gap-4 px-4 md:gap-6 md:px-8 lg:gap-8 lg:px-12">
          {lookbook.frames
            .filter((frame) => frame.kind === "cover")
            .map((cover) => (
              <div
                key="cover"
                data-frame="cover"
                data-look-index={1}
                className="flex min-h-(--look-h) w-[min(82vw,40rem)] shrink-0 snap-start flex-col justify-end gap-6 pr-4">
                <p className="type-label text-muted-foreground">
                  Lookbook · {lookbook.season}
                </p>
                <RevealLine as="h1" className="type-display">
                  {cover.title}
                </RevealLine>
                <p className="type-lede max-w-[36ch]">{lookbook.intro}</p>
              </div>
            ))}

          <ul className="flex items-start gap-4 md:gap-6 lg:gap-8">
            {lookbook.frames.map((frame, index) => {
              if (frame.kind === "cover") return null;
              const lookIndex = lookIndexAt(lookbook.frames, index);

              if (frame.kind === "interstitial") {
                // A breath of the place between Looks: no people, no motion,
                // and not one of the 8 Looks, so screen readers skip it.
                return (
                  <li
                    key={frame.id}
                    aria-hidden="true"
                    data-frame="interstitial"
                    data-look-index={lookIndex}
                    className={cn(frameWidth[frame.aspect], "flex shrink-0 snap-start flex-col gap-4")}>
                    <MillraceImage imageKey={frame.image} slot={imageSlot(frame)} alt="" />
                    <p className="type-caption text-muted-foreground">{frame.caption}</p>
                  </li>
                );
              }

              return (
                <li
                  key={frame.id}
                  id={frame.id}
                  aria-posinset={lookIndex}
                  aria-setsize={lookCount}
                  data-frame="look"
                  data-look={frame.number}
                  data-look-index={lookIndex}
                  className={cn(frameWidth[frame.aspect], "flex shrink-0 snap-start flex-col gap-4")}>
                  <MillraceImage imageKey={frame.image} slot={imageSlot(frame)} alt={lookAlt(frame)} />
                  {/* Wipes in once when the Look settles (lookbook-flow.tsx). */}
                  <div className="reveal flex flex-col gap-2">
                    <h2 className="type-caption text-muted-foreground">
                      Look {frame.number}
                      <span className="sr-only">, Hollins Weir</span>
                    </h2>
                    <p className="type-lede max-w-[36ch]">{frame.caption}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </LookbookFlow>
    </div>
  );
}
