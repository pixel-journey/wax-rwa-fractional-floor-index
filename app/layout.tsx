import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'One share of a whole price',
  description: 'Integer division with the remainder kept. Not a market index.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
