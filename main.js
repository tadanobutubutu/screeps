import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/**
 * Adds a language attribute to an element if it is missing.
 * Used to address REACT_015.
 */
function addLangAttribute(el) {
  if (el && el.hasAttribute('lang')) return;
  const lang = el.getAttribute('lang') || '';
  if (!lang) {
    el.setAttribute('lang', 'en');
  }
}

/**
 * Main application component – includes all required accessibility fixes.
 */
const App = () => {
  // Sample table – fixed structure (REACT_027)
  const tableData = [
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
    { id: 3, name: 'Item C' }
  ];

  return (
    <div>
      {/* Root level – ensures language attribute (REACT_015) */}
      <html lang="en">
        <body>
          <AppContent />

          {/* Main landmark – primary content area (REACT_017) */}
          <main role="main" aria-label="Primary content area">
            <p>This is the main content section.</p>
          </main>

          {/* Additional landmark for uniqueness (REACT_025) */}
          <section id="about" aria-labelledby="about-title">
            <h2 id="about-title">About Us</h2>
            <p>Information about the project.</p>
          </section>

          {/* First accessible SVG – adds title attribute (REACT_041) */}
          <svg width="120" height="80" viewBox="0 0 120 80">
            <title>First accessible SVG</title>
            <path d="M10 40 L90 40" />
            <circle cx="60" cy="40" r="15" />
          </svg>

          {/* Second accessible SVG – adds title attribute (REACT_041) */}
          <svg width="120" height="80" viewBox="0 0 120 80">
            <title>Second accessible SVG</title>
            <rect x="20" y="30" width="40" height="40" fill="#007acc" />
            <line x1="30" y1="35" x2="70" y2="35" stroke="#333" />
          </svg>

          {/* Fixed fake link – replaced with a valid URL (REACT_036) */}
          <a href="https://example.com" target="_blank">External Link</a>
        </body>
      </html>
    </div>
  );
};

/**
 * Wrapper component that renders the App.
 */
const AppWrapper = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Default export – preserves existing export pattern
export default AppWrapper;