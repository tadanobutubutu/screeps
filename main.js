// main.js - Accessibility fixes applied

// REACT_015: Add lang attribute to HTML element
// REACT_017: Add landmark roles and fix landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues)
// REACT_036: Fix 1 fake link issue
// REACT_027: Add scope="col" or scope="row" to <th> elements

import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application</title>
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header role="banner" className="site-header">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>

        <main id="main-content" role="main">
          <section role="region" aria-labelledby="section-heading">
            <h1 id="section-heading">Main Content</h1>
            
            {/* SVG with accessible name - REACT_041 */}
            <svg 
              aria-label="Decorative icon" 
              role="img" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            
            {/* Second SVG with accessible name - REACT_041 */}
            <svg 
              aria-label="Close button" 
              role="img" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20"
            >
              <rect x="2" y="2" width="16" height="16" />
            </svg>

            {/* Fixed fake link - REACT_036 */}
            <button type="button" onClick={() => navigateTo('/page')}>
              Go to Page
            </button>

            {/* Table with scope attributes - REACT_027 */}
            <table>
              <thead>
                <tr>
                  <th scope="col">Header 1</th>
                  <th scope="col">Header 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">Data 1</td>
                  <td>Data 2</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>

        <footer role="contentinfo" className="site-footer">
          <nav role="navigation" aria-label="Footer navigation">
            <p>Footer Content</p>
          </nav>
        </footer>
      </body>
    </html>
  );
}

function navigateTo(path) {
  window.location.href = path;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;