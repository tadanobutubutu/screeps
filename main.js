// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Address accessibility: REACT_015 - lang attribute on HTML element
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Example React component demonstrating accessibility fixes
const AccessiblePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header - unique landmark */}
      <header role="banner">
        {/* Navigation - with accessible name (REACT_017) */}
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>

      {/* Main content - unique landmark (REACT_025) */}
      <main role="main" id="main-content">
        <h1>Welcome</h1>
        
        {/* SVG 1 - with accessible name (REACT_041) */}
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          aria-labelledby="icon-title-1"
          role="img"
        >
          <title id="icon-title-1">Close menu</title>
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>

        {/* SVG 2 - with accessible name (REACT_041) */}
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          aria-label="Open menu"
          role="img"
        >
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>

        {/* Fix fake link - use button instead (REACT_036) */}
        <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
          Toggle Menu
        </button>
        
        <button type="button" onClick={() => alert('Action triggered')}>
          Perform Action
        </button>
      </main>

      {/* Footer - unique landmark */}
      <footer role="contentinfo">
        <p>&copy; 2024 Company</p>
      </footer>
    </>
  );
};

export default AccessiblePage;