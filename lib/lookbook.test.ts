import { describe, expect, test } from "bun:test";
import { getLook, getLookbook, getLooks } from "./catalog";
import {
  currentFrame,
  describePosition,
  formatCounter,
  lookAlt,
  lookIndexAt,
  stepTarget,
} from "./lookbook";
import { routes } from "./routes";

const { frames } = getLookbook();

describe("Lookbook counter", () => {
  test("frames run cover, then Looks in order with the two Interstitials", () => {
    expect(frames.map((frame) => (frame.kind === "look" ? frame.number : frame.kind))).toEqual([
      "cover", "01", "02", "03", "interstitial", "04", "05", "06", "interstitial", "07", "08",
    ]);
  });

  test("the counter skips Interstitials and the cover counts as Look 01", () => {
    const counters = frames.map((_, index) => formatCounter(lookIndexAt(frames, index), getLooks().length));
    expect(counters).toEqual([
      "01 / 08", "01 / 08", "02 / 08", "03 / 08", "03 / 08",
      "04 / 08", "05 / 08", "06 / 08", "06 / 08", "07 / 08", "08 / 08",
    ]);
    expect(describePosition(3, 8)).toBe("Look 3 of 8");
  });

  test("deep links resolve a zero-padded number", () => {
    expect(routes.look("03")).toBe("/lookbook?look=03");
    expect(getLook("03")?.id).toBe("look-03");
    expect(getLook("09")).toBeUndefined();
  });
});

describe("Lookbook snap steps", () => {
  // The last three frames all fit at the end of the scroll range.
  const targets = [0, 400, 800, 1000, 1000, 1000];

  test("the current frame is the last whose snap has been reached", () => {
    expect(currentFrame(targets, 0)).toBe(0);
    expect(currentFrame(targets, 401)).toBe(1);
    expect(currentFrame(targets, 600)).toBe(1);
    expect(currentFrame(targets, 1000)).toBe(5);
  });

  test("next and prev move exactly one distinct snap", () => {
    expect(stepTarget(targets, 0, 1)).toEqual({ frame: 1, left: 400 });
    expect(stepTarget(targets, 600, 1)).toEqual({ frame: 2, left: 800 });
    expect(stepTarget(targets, 800, 1)).toEqual({ frame: 5, left: 1000 });
    expect(stepTarget(targets, 1000, 1)).toBeUndefined();
    expect(stepTarget(targets, 1000, -1)).toEqual({ frame: 2, left: 800 });
    expect(stepTarget(targets, 600, -1)).toEqual({ frame: 1, left: 400 });
    expect(stepTarget(targets, 1, -1)).toBeUndefined();
  });
});

describe("Look alt text", () => {
  test("names each Piece in the Colourway worn", () => {
    expect(lookAlt(getLook("06")!)).toBe(
      "Look 06 at Hollins Weir: Rider Jacket in Indigo, Popover Shirt in Oat and Fatigue Trouser in Oat.",
    );
  });
});
