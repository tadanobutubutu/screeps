// app/layout.tsx
export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  icons: {
    icon: ... ... viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 ...
    apple: ... ... viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 ...
  },
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