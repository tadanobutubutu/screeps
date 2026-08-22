// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "normalize.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps game",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title id='screeps-title-app'>Screeps Dashboard</title><text y='.9em' font-size='32'>🎮</text></svg>",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}