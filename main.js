// main.js
import React from 'react';

// Preserve all existing imports and functions
// ... (keep all existing code)

// Add new accessibility-focused functions

/**
 * Ensures all interactive elements have proper ARIA attributes
 * @param {React.ReactNode} children
 */
export const AccessibleButton = ({ children, ...props }) => {
  return (
    <button
      aria-label={props['aria-label'] || children}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Creates a properly structured table with ARIA attributes
 * @param {Object} props
 */
export const AccessibleTable = ({ headers, data, ...props }) => {
  return (
    <table aria-label={props['aria-label'] || 'Data table'} {...props}>
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

/**
 * Adds proper landmark roles to page sections
 * @param {Object} props
 */
export const SectionWithLandmark = ({ role, title, children, ...props }) => {
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const sectionRole = validRoles.includes(role) ? role : 'region';

  return (
    <section
      role={sectionRole}
      aria-label={title}
      {...props}
    >
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
};

/**
 * Creates accessible SVG with proper title/description
 * @param {Object} props
 */
export const AccessibleSVG = ({ title, description, children, ...props }) => {
  return (
    <svg {...props}>
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
};

// Preserve all existing exports
// ... (keep all existing exports)