// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Main</title>
      </head>
      <body>
        <header role="banner" id="header">
          <h1>Welcome</h1>
        </header>
        <nav role="navigation" id="nav">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        <main role="main" id="main">
          <p>Sample content.</p>
          <svg width="80" height="60" viewBox="0 0 80 60" aria-label="Circle">
            <circle cx="40" cy="30" r="20" stroke="black" stroke-width="2"/>
          </svg>
        </main>
        <footer role="contentinfo" id="footer">
          <p>&copy; 2024 My Company</p>
        </footer>
      </body>
    </html>
  );
}

export default App;