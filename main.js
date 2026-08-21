tsx
// app/layout.tsx - Fixed SVG accessible name
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <text y=".9em" fontSize="90">
          🦊
        </text>
      </svg>
    ),
  },
};