// main.js
import React from 'react';

// Preserve all existing exports and functions
// ... (existing code remains unchanged)

// New accessibility improvements
const AccessibleTable = ({ data, headers }) => {
  return (
    <table role="grid" aria-label="Data table">
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
};

const AccessibleSVG = ({ title, description, ...props }) => {
  return (
    <svg {...props} role="img" aria-label={`${title} - ${description}`}>
      <title>{title}</title>
      <desc>{description}</desc>
      {props.children}
    </svg>
  );
};

const AccessibleLink = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

// Example of adding lang attribute to the root component
const App = ({ children }) => {
  return (
    <div lang="en">
      <header role="banner">
        <h1>Website Title</h1>
      </header>
      <main role="main">
        {children}
      </main>
      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </div>
  );
};

// Preserve all existing exports
export {
  // ... existing exports
  AccessibleTable,
  AccessibleSVG,
  AccessibleLink,
  App
};