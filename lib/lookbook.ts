import { getPiece, type Look, type Lookbook } from "@/lib/catalog";

type Frame = Lookbook["frames"][number];

/** The Look a frame counts as: Interstitials keep the Look before them and the cover counts as the first. */
export function lookIndexAt(frames: readonly Frame[], frameIndex: number): number {
  let index = 0;
  for (const frame of frames.slice(0, frameIndex + 1)) {
    if (frame.kind === "look") index++;
  }
  return Math.max(index, 1);
}

/** The counter, zero-padded: `03 / 08`. */
export function formatCounter(index: number, total: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(index)} / ${pad(total)}`;
}

/** What the live region says after prev or next: "Look 3 of 8". */
export function describePosition(index: number, total: number): string {
  return `Look ${index} of ${total}`;
}

/** Alt text from what the Look is wearing, in the Colourways worn. */
export function lookAlt(look: Look): string {
  const worn = look.items.map(({ piece: pieceId, colorway: colorwayId }) => {
    const piece = getPiece(pieceId)!;
    const colorway = piece.colorways.find((entry) => entry.id === colorwayId)!;
    return `${piece.name} in ${colorway.name}`;
  });
  const list =
    worn.length > 1
      ? `${worn.slice(0, -1).join(", ")} and ${worn.at(-1)}`
      : worn.join("");
  return `Look ${look.number} at Hollins Weir: ${list}.`;
}

// Snap maths for the strip. `targets` are the scroll positions at which each
// frame snaps, already clamped to the strip's scroll range, so frames near the
// end can share a target. Steps move between distinct targets: one snap.

const tolerance = 2;

/** The last frame whose snap position has been reached. */
export function currentFrame(targets: readonly number[], scrollLeft: number): number {
  let current = 0;
  targets.forEach((target, index) => {
    if (target <= scrollLeft + tolerance) current = index;
  });
  return current;
}

/** The scroll position one snap away, or undefined at either end. */
export function stepTarget(
  targets: readonly number[],
  scrollLeft: number,
  direction: 1 | -1,
): { frame: number; left: number } | undefined {
  const left =
    direction === 1
      ? targets.find((target) => target > scrollLeft + tolerance)
      : targets.findLast((target) => target < scrollLeft - tolerance);
  // Frames sharing a target count as the last of them, as currentFrame does.
  return left === undefined ? undefined : { frame: targets.lastIndexOf(left), left };
}
