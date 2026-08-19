import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <a href="#main-content" className="sr-only-focusable">
          Skip to main content
        </a>
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            {/* Navigation items */}
          </nav>
        </header>
        <main id="main-content" role="main">
          <Main />
        </main>
        <footer role="contentinfo">
          {/* Footer content */}
        </footer>
        <NextScript />
      </body>
    </Html>
  );
}