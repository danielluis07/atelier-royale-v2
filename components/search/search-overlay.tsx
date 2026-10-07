import { MillraceImage } from "@/components/millrace-image";
import { getCollection } from "@/lib/catalog";
import { SearchOverlayView } from "./search-overlay-view";

// Mounted in the nav. Thumbnails render here, on the server, so image
// metadata never ships as JavaScript; the client picks the ones its results
// need, by Piece.
export function SearchOverlay() {
  const thumbnails = Object.fromEntries(
    getCollection().map((piece) => [
      piece.id,
      <MillraceImage
        key={piece.id}
        imageKey={piece.colorways[0].images.still}
        slot="search-thumbnail"
        alt=""
      />,
    ]),
  );

  return <SearchOverlayView thumbnails={thumbnails} />;
}
