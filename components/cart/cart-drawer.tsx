import { MillraceImage } from "@/components/millrace-image";
import { getCollection } from "@/lib/catalog";
import { CartDrawerView } from "./cart-drawer-view";
import { CartHydrator } from "./cart-hydrator";

// Mounted once in the root layout. Thumbnails render here, on the server, so
// image metadata never ships as JavaScript; the client picks the ones its
// lines need, by Piece and Colourway.
export function CartDrawer() {
  const thumbnails = Object.fromEntries(
    getCollection().flatMap((piece) =>
      piece.colorways.map((colorway) => [
        `${piece.id}/${colorway.id}`,
        <MillraceImage
          key={colorway.id}
          imageKey={colorway.images.still}
          slot="cart-thumbnail"
          alt=""
        />,
      ]),
    ),
  );

  return (
    <>
      <CartHydrator />
      <CartDrawerView thumbnails={thumbnails} />
    </>
  );
}
