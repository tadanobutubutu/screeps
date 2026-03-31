import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Screeps game status dashboard",
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
