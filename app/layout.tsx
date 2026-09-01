import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledger — Run your practice, not just your calendar",
  description: "Proposals, invoices, and bookings for independent consultants and coaches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
