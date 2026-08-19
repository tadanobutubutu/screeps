import React from "react";
import ReactDOM from "react-dom/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>",
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

// For app/layout.tsx
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.StrictMode>
      <main lang="en" role="main">
        {children}
      </main>
    </React.StrictMode>
  );
};

// For dashboard/app/layout.tsx
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.StrictMode>
      <main lang="en" role="main">
        {children}
      </main>
    </React.StrictMode>
  );
};

// New function to handle the rotation action
export const handleRotation = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  // Add your rotation logic here
  console.log("Rotation triggered");
};

// Replace the fake link with a proper button
export const RotationButton = () => (
  <button
    id="unrotate"
    onClick={handleRotation}
    aria-label="Rotate back"
    style={{
      background: "none",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      color: "inherit",
      textDecoration: "underline",
    }}
  >
    rotate back
  </button>
);