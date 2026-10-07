import { describe, expect, test } from "bun:test";
import { getCategory, getLook, getLookbook, getLooks, getPiece } from "./catalog";
import {
  addedLabel,
  currentFrame,
  describeQuickAdd,
  describePosition,
  formatCounter,
  lookAlt,
  lookIndexAt,
  lookPieces,
  quickAddLine,
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

describe("Look panel", () => {
  test("every Look lists its Pieces in the Colourway worn, in order", () => {
    for (const look of getLooks()) {
      const pieces = lookPieces(look);
      expect(pieces.map((piece) => [piece.id, piece.colourwayId])).toEqual(
        look.items.map((item) => [item.piece, item.colorway]),
      );
      for (const listed of pieces) {
        const piece = getPiece(listed.id)!;
        const colorway = piece.colorways.find((entry) => entry.id === listed.colourwayId)!;
        expect(listed.colourwayName).toBe(colorway.name);
        expect(listed.sizes.map((entry) => entry.size)).toEqual([...getCategory(piece.category)!.sizes]);
        expect(listed.sizes.filter((entry) => entry.soldOut).map((entry) => entry.size)).toEqual([
          ...colorway.soldOutSizes,
        ]);
      }
    }
  });

  test("Look 06 lists the Rider Jacket in Indigo first", () => {
    const [first] = lookPieces(getLook("06")!);
    expect(first).toMatchObject({ name: "Rider Jacket", colourwayName: "Indigo" });
  });

  test("quick add makes a line in the worn Colourway and refuses sold-out or unknown sizes", () => {
    const pieces = getLooks().flatMap(lookPieces);
    const soldOut = pieces.find((piece) => piece.sizes.some((entry) => entry.soldOut));
    expect(soldOut).toBeDefined();
    const struck = soldOut!.sizes.find((entry) => entry.soldOut)!.size;
    const open = soldOut!.sizes.find((entry) => !entry.soldOut)!.size;
    expect(quickAddLine(soldOut!, struck)).toBeUndefined();
    expect(quickAddLine(soldOut!, "XXXL")).toBeUndefined();
    expect(quickAddLine(soldOut!, open)).toEqual({
      pieceId: soldOut!.id,
      colourwayId: soldOut!.colourwayId,
      size: open,
    });
  });

  test("the button and the live region say what was added", () => {
    expect(addedLabel("M")).toBe("Added · M");
    expect(describeQuickAdd({ name: "Chore Jacket" }, "M")).toBe("Added: Chore Jacket, M");
  });
});
