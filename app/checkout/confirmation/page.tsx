import type { Metadata } from "next";
import { ConfirmationView } from "@/components/checkout/confirmation-view";

export const metadata: Metadata = {
  title: "Simulação concluída",
  robots: { index: false },
};

// Prerendered as an empty shell; the order is read from sessionStorage on the
// client, so it survives a reload within the session.
export default function ConfirmationPage() {
  return <ConfirmationView />;
}
