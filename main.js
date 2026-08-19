import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "none" }}
          aria-hidden="true"
        >
          {/* SVG content */}
        </svg>
        {children}
      </body>
    </html>
  );
}

// main.js - Dependency Dashboard Management
// This file manages dependency updates and schedules