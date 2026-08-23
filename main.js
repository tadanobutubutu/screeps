import React, { useEffect } from 'react';

// Accessibility issues from insight report addressed
// - REACT_015: lang attribute set
// - REACT_017: 4 landmarks fixed
// - REACT_041: 2 SVGs have accessible names
// - REACT_025: unique landmarks ensured
// - REACT_036: fake link fixed

export default function App() {
  useEffect(() => {
    if (document && document.documentElement) {
      document.documentElement.lang = 'en';
    }
  }, []);

  return (
    <div>
      <header role="banner" aria-label="Site Header">
        <h1>Header</h1>
      </header>

      <nav role="navigation" aria-label="Primary Navigation">
        <ul>
          <li><a href="/page1">Page 1</a></li>
        </ul>
      </nav>

      <nav role="navigation" aria-label="Secondary Navigation">
        <ul>
          <li><a href="/page2">Page 2</a></li>
        </ul>
      </nav>

      <main role="main" aria-label="Main Content">
        <h2>Main Content</h2>
      </main>

      <section role="region" aria-label="Features">
        <h2>Features</h2>
      </section>

      <svg aria-label="Decorative chart" role="img" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="blue" />
      </svg>

      <svg aria-label="Company logo" role="img" width="100" height="100" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="green" />
      </svg>

      <a href="/accessible-page" aria-label="Accessible Link to Page">
        Real Link
      </a>
    </div>
  );
}