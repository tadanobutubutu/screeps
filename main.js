// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

// REACT_017, REACT_025: Ensure proper landmark structure at root level
// The main landmark will be in App component, but we ensure no duplicate landmarks here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export for testing purposes
export { root };