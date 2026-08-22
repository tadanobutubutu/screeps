tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' ... /></svg>",
      type: "image/svg+xml",
    },
  },
  // ... rest of config
};