// app/layout.tsx
import type { Metadata } from "next";
// ... other imports

export const metadata: Metadata = {
  title: "...",
  description: "...",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>🎮</text></svg>",
        type: "image/svg+xml",
      },
    ],
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>🎮</text></svg>",
  },
};

// ... rest of the file