// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue

import React from 'react';

// Common accessibility patterns for these issues:

// 1. For SVGs - add aria-label or role="img" with aria-labelledby
const AccessibleIcon = ({ label, children }) => (
  <svg role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

// 2. For landmarks - ensure unique accessible names when multiple of same type
const Header = () => (
  <header role="banner" aria-label="Main header">
    {/* Header content */}
  </header>
);

const Navigation = () => (
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation content */}
  </nav>
);

const Footer = () => (
  <footer role="contentinfo">
    {/* Footer content */}
  </footer>
);

// 3. For links - use semantic <a> tags with proper href
const AccessibleLink = ({ href, children }) => (
  <a href={href} className="link">
    {children}
  </a>
);

// Main component
const App = () => (
  <div lang="en">
    <Header />
    <main role="main" id="main-content">
      {/* Main content */}
    </main>
    <Navigation />
    <Footer />
  </div>
);

export default App;