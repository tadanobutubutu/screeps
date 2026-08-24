import React from 'react';

// Accessibility fixes for insight-code scan (main project)
// Rules addressed: REACT_015, REACT_027, REACT_041, REACT_025, REACT_017, REACT_036

export function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav aria-label="Primary">
            <a href="/">Home</a>
          </nav>
        </header>
        <main id="main-content">
          {children}
        </main>
        <footer>
          <p>Footer content</p>
        </footer>
      </body>
    </html>
  );
}

export default function MainPage() {
  return (
    <RootLayout>
      <h1>Accessibility Overview</h1>

      {/* REACT_027: React Table Structure */}
      <table>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Score</td>
            <td>87/100</td>
          </tr>
        </tbody>
      </table>

      {/* REACT_041: React SVG Accessible Name */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-labelledby="svg-title-id"
        role="img"
      >
        <title id="svg-title-id">Status icon</title>
        <circle cx="12" cy="12" r="10" />
      </svg>

      {/* REACT_036: React Fake Link - use real anchor */}
      <a href="/details" className="btn-link">
        View details
      </a>
    </RootLayout>
  );
}