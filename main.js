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
        <header role="banner" aria-label="Site header">
          {/* Header content would go here */}
        </header>
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation content would go here */}
        </nav>
        <main role="main" aria-label="Main content">
          {children}
        </main>
        <footer role="contentinfo" aria-label="Site footer">
          {/* Footer content would go here */}
        </footer>
        <svg
          aria-hidden="true"
          style={{ display: "none" }}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Decorative elements"
        >
          {/* decorative elements */}
        </svg>
      </body>
    </html>
  );
}

// New function to handle dependency updates
export function getUpdatedDependencies() {
  return {
    jest: "^30.0.0",
    react: "^19.0.0",
    eslint: "^10.0.0",
    typescript: "^7.0.0",
    babelJest: "^30.0.0"
  };
}

// New function to get accessibility attributes for main content
export function getAccessibilityAttributes() {
  return {
    role: "main",
    "aria-label": "Main content"
  };
}