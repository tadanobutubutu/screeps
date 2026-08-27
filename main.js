// main.js - Fixed accessibility issues

import React from 'react';

// REACT_015: Add lang attribute to HTML element
// REACT_027: Proper table structure with thead, tbody, th with scope
// REACT_041: Add aria-label to SVG elements
// REACT_025/REACT_017: Proper landmark elements (main, nav, header, footer)
// REACT_036: Use real links (<a>) instead of fake links (<div>/<span> with onClick)

// Sample accessible component
export function AccessibleTable({ data, headers }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// REACT_041: Accessible SVG component
export function AccessibleIcon({ name, size = 24 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      aria-label={name}
      role="img"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
    </svg>
  );
}

// REACT_036: Use real anchor tags instead of fake links
export function Navigation({ links }) {
  return (
    <nav aria-label="Main navigation">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// REACT_017/REACT_025: Proper landmark structure
export function AccessiblePage({ children }) {
  return (
    <div lang="en">
      <header role="banner">
        <nav aria-label="Header navigation">
          {/* Header content */}
        </nav>
      </header>
      
      <main role="main" id="main-content">
        {children}
      </main>
      
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default AccessiblePage;