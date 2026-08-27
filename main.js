tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Visualize your Screeps AI bot performance",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}