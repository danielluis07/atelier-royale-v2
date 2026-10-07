import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { MillraceImage } from "@/components/millrace-image";
import { getCollection } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description:
    "Contato, envio, entrega e pagamento em uma página. Uma loja de demonstração: nenhum pagamento é cobrado.",
};

// Prerendered; the cart is read on the client. Thumbnails render here, on the
// server, so image metadata never ships as JavaScript; the client picks the
// ones its lines need, by Piece and Colourway.
export default function CheckoutPage() {
  const thumbnails = Object.fromEntries(
    getCollection().flatMap((piece) =>
      piece.colorways.map((colorway) => [
        `${piece.id}/${colorway.id}`,
        <MillraceImage
          key={colorway.id}
          imageKey={colorway.images.still}
          slot="order-thumbnail"
          alt=""
        />,
      ]),
    ),
  );

  return <CheckoutView thumbnails={thumbnails} />;
}
