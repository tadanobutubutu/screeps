// main.js
import React from 'react';

// Existing code (preserved as-is)
export function ExistingComponent({ children }) {
  return <div>{children}</div>;
}

// New accessibility improvements
export function AccessibleTable({ data, caption }) {
  return (
    <table aria-label={caption}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
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

export function AccessibleForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} lang="en">
      <label htmlFor="username">Username:</label>
      <input id="username" type="text" required aria-required="true" />

      <label htmlFor="password">Password:</label>
      <input id="password" type="password" required aria-required="true" />

      <button type="submit">Submit</button>
    </form>
  );
}

export function AccessibleSVG({ title, description }) {
  return (
    <svg role="img" aria-label={`${title}: ${description}`}>
      <title>{title}</title>
      <desc>{description}</desc>
      {/* SVG content here */}
    </svg>
  );
}

export function AccessibleLandmark({ type, children }) {
  const landmarkRoles = {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    complementary: 'complementary',
    contentinfo: 'contentinfo'
  };

  return (
    <div role={landmarkRoles[type] || 'region'} aria-label={type}>
      {children}
    </div>
  );
}

// Preserve any existing exports
export const existingExport = 'value';