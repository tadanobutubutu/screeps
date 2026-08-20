// main.js
import React from 'react';
import Head from 'next/head';

// Add language attribute to the HTML element
export const HtmlLang = ({ children }) => (
  <html lang="en">
    {children}
  </html>
);

// Ensure proper table structure with caption and scope attributes
export const AccessibleTable = ({ caption, headers, data }) => (
  <table>
    <caption>{caption}</caption>
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

// Add proper landmark elements
export const MainLayout = ({ children }) => (
  <div>
    <header role="banner">
      <h1>Site Header</h1>
    </header>
    <main role="main">
      {children}
    </main>
    <footer role="contentinfo">
      <p>Footer content</p>
    </footer>
  </div>
);

// Ensure SVGs have accessible names
export const AccessibleSVG = ({ title, description, children }) => (
  <svg role="img" aria-labelledby={`svg-title-${title}`}>
    <title id={`svg-title-${title}`}>{title}</title>
    <desc id={`svg-desc-${title}`}>{description}</desc>
    {children}
  </svg>
);

// Ensure unique landmarks
export const UniqueLandmarks = () => (
  <div>
    <nav aria-label="Primary navigation">
      {/* Navigation content */}
    </nav>
    <nav aria-label="Secondary navigation">
      {/* Secondary navigation content */}
    </nav>
  </div>
);

// Replace fake links with proper anchor tags
export const ProperLink = ({ href, children }) => (
  <a href={href}>{children}</a>
);

// Main component (preserve existing functionality)
export default function Main({ children }) {
  return (
    <>
      <Head>
        <title>Accessible Application</title>
        <meta name="description" content="An accessible Next.js application" />
      </Head>
      <HtmlLang>
        <body>
          <MainLayout>
            {children}
          </MainLayout>
        </body>
      </HtmlLang>
    </>
  );
}