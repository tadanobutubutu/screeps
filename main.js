import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>

        <Main />

        <footer role="contentinfo">
          <p>© 2024</p>
        </footer>

        <NextScript />

        {/* Script to update th tags with scope attribute */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateThTags() {
                const thElements = document.querySelectorAll('th');
                thElements.forEach(th => {
                  if (!th.hasAttribute('scope')) {
                    th.setAttribute('scope', 'col');
                  }
                });
              }
              document.addEventListener('DOMContentLoaded', updateThTags);
            `,
          }}
        />
      </body>
    </Html>
  );
}