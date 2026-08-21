// app/layout.tsx - This appears to be a Next.js layout file
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

// Favicon SVG - this is likely decorative, so I'll add aria-hidden="true"
const faviconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 9h6v6H9z"/></svg>';

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Game dashboard for Screeps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}