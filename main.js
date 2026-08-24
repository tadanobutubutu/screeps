import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps game",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2218%22 x=%2250%25%22 text-anchor=%22middle%22>SD</text></svg>",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}