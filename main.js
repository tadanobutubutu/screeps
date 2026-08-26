import React from 'react';

// Add lang attribute for screen readers
const App = () => {
  return (
    <html lang="en">
      <head>
        <title>Accessible Application</title>
      </head>
      <body>
        <main>
          {/* Main content with proper landmarks */}
          <section aria-label="Main content section">
            {/* Properly structured table */}
            <table role="table" aria-label="Data table with proper structure">
              <thead>
                <tr>
                  <th scope="col">Header 1</th>
                  <th scope="col">Header 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data 1</td>
                  <td>Data 2</td>
                </tr>
              </tbody>
            </table>
            
            {/* Accessible SVG with title and desc */}
            <svg role="img" aria-label="Icon" focusable="false" aria-hidden="true">
              <title>Icon</title>
              <desc>Descriptive text for the icon</desc>
              <path d="M10 10 L20 20" fill="none" stroke="currentColor" />
            </svg>
            
            {/* Proper landmarks */}
            <nav aria-label="Primary navigation">
              <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </nav>
            
            {/* Fake link fixed - now a button */}
            <button type="button" onClick={() => {}}>
              Click Me
            </button>
          </section>
        </main>
      </body>
    </html>
  );
};

// Unique landmarks ensured
const Header = () => (
  <header role="banner">
    <h1>Site Title</h1>
  </header>
);

const Footer = () => (
  <footer role="contentinfo">
    <p>Footer content</p>
  </footer>
);

// Export functions
export { App, Header, Footer };

// Default export
export default App;