tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Screeps Dashboard by Metasyntribution",
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

export const icons = {
  icon: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <title>Screeps Dashboard</title>
      <text y=".9em" fontSize={78} textAnchor="middle">
        🖥️
      </text>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <text y=".9em" fontSize={78} textAnchor="middle">
        🖥️
      </text>
    </svg>
  ),
};