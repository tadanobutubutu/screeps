import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps game client',
  lang: 'en',
};

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-screeps-dark text-screeps-light antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-screeps-accent text-screeps-dark font-medium rounded-md"
        >
          Skip to main content
        </a>
        <div id="app-root" className="h-full flex flex-col">
          <header role="banner" className="flex-shrink-0">
            <nav role="navigation" aria-label="Main navigation" className="p-4 border-b border-screeps-border">
              <ul className="flex gap-6" role="menubar">
                <li role="none">
                  <a href="/" role="menuitem" className="text-screeps-accent hover:text-screeps-accent-hover font-medium">
                    Home
                  </a>
                </li>
                <li role="none">
                  <a href="/console" role="menuitem" className="text-screeps-light hover:text-screeps-accent font-medium">
                    Console
                  </a>
                </li>
                <li role="none">
                  <a href="/memory" role="menuitem" className="text-screeps-light hover:text-screeps-accent font-medium">
                    Memory
                  </a>
                </li>
                <li role="none">
                  <a href="/settings" role="menuitem" className="text-screeps-light hover:text-screeps-accent font-medium">
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </header>
          <main
            id="main-content"
            role="main"
            className="flex-1 overflow-auto p-6"
            tabIndex={-1}
          >
            {children}
          </main>
          <footer role="contentinfo" className="flex-shrink-0 p-4 border-t border-screeps-border bg-screeps-darker">
            <p className="text-screeps-dim text-sm text-center">
              Screeps &copy; {new Date().getFullYear()} - Accessible Game Client
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}