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
      </body>
    </Html>
  );
}

// Add ARIA landmark roles for better screen reader navigation
export function AppLayout({ children }) {
  return (
    <div role="main">
      <header role="banner">
        <h1>Application Title</h1>
      </header>
      <main role="main">
        {children}
      </main>
      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </div>
  );
}

// Add function to ensure proper table structure
export function AccessibleTable({ data, headers }) {
  return (
    <table role="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Add function to ensure proper SVG accessibility
export function AccessibleSVG({ title, description, children }) {
  return (
    <svg role="img" aria-label={title}>
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
}