import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <nav aria-label="Main navigation">
          {/* Navigation items */}
        </nav>
        <Main id="main-content" />
        <footer>
          <nav aria-label="Footer navigation">
            {/* Footer navigation */}
          </nav>
        </footer>
        <NextScript />
      </body>
    </Html>
  );
}