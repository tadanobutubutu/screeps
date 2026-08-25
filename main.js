// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue
//

import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div lang="en" className="app">
      <header>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-label="Logo">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        </svg>
        <span>My App</span>
      </header>
      <nav aria-label="Main navigation">
        <a href="/home">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
      <main>
        <section aria-label="Featured content">
          <h1>Welcome to My App</h1>
          <p>This is the main content area.</p>
          <a href="/details">View Details</a>
        </section>
        <aside aria-label="Related information">
          <h2>Related Information</h2>
          <p>Additional content here.</p>
        </aside>
      </main>
      <footer>
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;