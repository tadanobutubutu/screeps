import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📁</text></svg>",
        type: "image/svg+xml",
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
          aria-hidden="true"
          style={{ display: "none" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* decorative elements */}
        </svg>
        {children}
      </body>
    </html>
  );
}