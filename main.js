tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctitle%3EScreeps Dashboard%3C/title%3E%3Ctext y='.9em' font-size='18' x='50%25' text-anchor='middle' fill='%23ffa600'%3ESD%3C/text%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctitle%3EScreeps Dashboard%3C/title%3E%3Ctext y='.9em' font-size='18' x='50%25' text-anchor='middle' fill='%23ffa600'%3ESD%3C/text%3E%3C/svg%3E",
      sizes: "180x180",
      type: "image/svg+xml",
    },
  },
};

// dashboard/app/layout.tsx
import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Dashboard",
  icons: {
    icon: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctitle%3EScreeps Dashboard%3C/title%3E%3Ctext y='.9em' font-size='18' x='50%25' text-anchor='middle' fill='%23ffa600'%3ESD%3C/text%3E%3C/svg%3E",
      type: "image/svg+xml",
    },
  },
};