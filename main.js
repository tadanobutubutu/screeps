// File: app/layout.tsx
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps game",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='18' x='50%' text-anchor='middle'>🎮</text></svg>",
      type: "image/svg+xml",
    },
  },
};