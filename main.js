// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fixed REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

function Root() {
  return (
    <>
      {/* Fixed REACT_017: Added proper header landmark */}
      <header role="banner">
        <div className="logo">
          {/* Fixed REACT_041: Added accessible name to first SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40" aria-label="Company logo">
            <circle cx="20" cy="20" r="18" fill="#3498db" />
          </svg>
          <span>My App</span>
        </div>
        {/* Fixed REACT_017 & REACT_025: Added unique label to main nav */}
        <nav role="navigation" aria-label="Main">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Fixed REACT_017: Added main landmark */}
      {/* Fixed REACT_025: Added id for skip link target */}
      <main role="main" id="main-content" tabIndex="-1">
        <App />
      </main>

      {/* Fixed REACT_017: Added proper footer landmark */}
      <footer role="contentinfo">
        <p>© 2024 My App. All rights reserved.</p>
        {/* Fixed REACT_017 & REACT_025: Added unique label to footer nav */}
        <nav role="navigation" aria-label="Footer">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </nav>
        
        {/* Fixed REACT_041: Added accessible name to second SVG */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-label="Scroll to top icon"
          className="scroll-top-icon"
        >
          <path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor" />
        </svg>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);