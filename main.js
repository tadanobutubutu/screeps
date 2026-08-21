// main.js - Application entry point

// ... (existing code)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <RootLayoutChildren>{children}</RootLayoutChildren>
        </main>
      </body>
    </html>
  );
}

function RootLayoutChildren({ children }: React.ReactNode) {
  return children;
}

// ... (existing code)