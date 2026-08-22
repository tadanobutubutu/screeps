tsx
import type { Metadata } from "next";
import "./globals.css";
import "tailwindcss/tailwind.css";

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "A dashboard for Screeps",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>⚙️</text></svg>",
      type: "image/svg+xml",
    },
    apple: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>",
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