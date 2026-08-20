import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <header>
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a ...
            </ul>
          </nav>
        </header>

        <Main />

        <footer>
          <p>© 2024</p>
        </footer>

        <NextScript />
      </body>
    </Html>
  );
}