// _document.jsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <header role="banner">
          {/* Header content */}
        </header>
        <nav aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
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

// Example table component with proper accessibility
export function AccessibleTable({ headers, rows, caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
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

// Example accessible SVG component
export function AccessibleIcon({ children, label, ...props }) {
  return (
    <svg {...props} aria-label={label} role="img">
      {children}
    </svg>
  );
}

// Example accessible link component (replaces fake links)
export function AccessibleLink({ href, children, onClick, ...props }) {
  // If href is provided, use real anchor tag
  // If onClick is provided (no href), still use anchor with role="button"
  const isButton = !href && onClick;
  const Component = isButton ? 'a' : 'a';
  
  return (
    <Component
      href={href}
      onClick={onClick}
      {...(isButton && { role: 'button', tabIndex: 0 })}
      {...props}
    >
      {children}
    </Component>
  );
}

// Ensure unique landmarks - only one main landmark per page
// Using role="main" with id="main-content" for screen readers
export function UniqueMainContent({ children }) {
  return (
    <main id="main-content" role="main" aria-label="Main content">
      {children}
    </main>
  );
}