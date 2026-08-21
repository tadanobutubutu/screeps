// Example of how you might update Jest-related code for v30
const { jest } = require('@jest/globals');

// Example of React 19 compatibility changes
import React from 'react';
import { createRoot } from 'react-dom/client';

// Preserve all existing functions and exports
// Add any new functionality needed for the updates

// Add functions to handle conditional main landmark rendering (new)
export function createUniqueMainLandmark({ children, id }) {
  return (
    <main id={id} aria-label="Main content">
      {children}
    </main>
  );
}

// New function to create accessible fake link (fix for REACT_036) (new)
export function createAccessibleFakeLink({ children, onClick, ariaLabel }) {
  return (
    <button
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={ariaLabel}
      style={{
        cursor: 'pointer',
        textDecoration: 'underline',
      }}
    >
      {children}
    </button>
  );
}

// New function to create accessible table header with proper scope (new)
export function createTableHeader({ text, scope = 'col' }) {
  return (
    <th scope={scope}>
      <div>{text}</div>
    </th>
  );
}

// New function to create accessible table row (new)
export function createTableRow({ cells, rowIndex }) {
  return (
    <tr key={`row-${rowIndex}`}>
      {cells.map((cell, cellIndex) => (
        <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
      ))}
    </tr>
  );
}

// New function to create accessible table with proper structure (new)
export function createAccessibleTableWithScope({ headers, data, caption, headerScope = 'col' }) {
  return (
    <table aria-label={caption}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={`header-${index}`} scope={headerScope}>
              <div>{header}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Preserve existing ESLint configuration
// (Here you can see the existing configuration is already included in the file)

module.exports = {
  // ... rest of your existing configuration
};