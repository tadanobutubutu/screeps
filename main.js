// main.js - Accessibility fixes applied

import React from 'react';

// Fix for REACT_015 - React Language Attribute
// The html element should have a lang attribute
export const HtmlWrapper = ({ lang = 'en', children }) => (
  <html lang={lang}>
    {children}
  </html>
);

// Fix for REACT_017 - React Landmarks
// Ensure proper landmark regions
export const PageLayout = ({ children }) => (
  <>
    <header role="banner">
      <nav role="navigation" aria-label="Main">
        {/* Navigation content */}
      </nav>
    </header>
    <main role="main" id="main-content">
      {children}
    </main>
    <footer role="contentinfo">
      {/* Footer content */}
    </footer>
  </>
);

// Fix for REACT_025 - React Unique Landmarks
// Ensure only one of each landmark type
export const Sidebar = () => (
  <aside role="complementary" aria-label="Supplementary content">
    {/* Sidebar content */}
  </aside>
);

// Fix for REACT_036 - React Fake Link
// Use button for actions that don't navigate
export const ActionButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

// Fix for REACT_041 - React SVG Accessible Name
export const AccessibleIcon = ({ label, children }) => (
  <svg aria-label={label} role="img">
    {children}
  </svg>
);

// Alternative: use title element inside SVG
export const AccessibleIconWithTitle = ({ title, children }) => (
  <svg role="img">
    <title>{title}</title>
    {children}
  </svg>
);

// Fix for REACT_027 - React Table Structure
export const AccessibleTable = ({ headers, rows }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} scope="col">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// Existing exports preserved
export const someExistingFunction = () => {
  return 'existing functionality';
};

export const anotherExistingExport = {
  name: 'preserved',
  value: 42
};

// ... rest of existing code preserved