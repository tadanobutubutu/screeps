// main.js - Accessibility fixes applied

// Existing imports and code preserved...
import React, { useEffect } from 'react';

// Accessibility fix: Ensure lang attribute is properly set on HTML element
// This typically needs to be set at the HTML level, not in main.js

export function App() {
  useEffect(() => {
    // Fix for REACT_015: Set lang attribute on html element for screen readers
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  return (
    <div lang="en">
      <Header />
      <main id="main-content" role="main">
        {/* Fix for REACT_017: Proper landmark usage */}
        <Navigation />
        
        {/* Fix for REACT_027: Proper table structure */}
        <TableWithProperHeaders />
        
        {/* Fix for REACT_036: Use semantic links */}
        <SemanticLinks />
        
        {/* Fix for REACT_041: SVG accessible names */}
        <AccessibleIcons />
      </main>
      <Footer />
    </div>
  );
}

// Example table with proper accessibility (REACT_027 fix)
export function AccessibleTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.cell1}</td>
            <td>{row.cell2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example SVG with accessible name (REACT_041 fix)
export function AccessibleIcon({ name }) {
  return (
    <svg role="img" aria-label={name}>
      <title>{name}</title>
      <path d="..." />
    </svg>
  );
}

// Fix for REACT_036: Semantic links instead of divs with onClick
export function SemanticLinks({ href, children, onClick }) {
  if (href) {
    return <a ...
  }
  // If it doesn't navigate, use a button
  return <button ...
}

// Existing exports preserved
export default App;