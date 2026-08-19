// main.js
import React from 'react';

// Preserve all existing imports and exports
// ... (keep all existing code)

// Add new accessibility-focused functions

/**
 * Ensures proper language attribute is set for screen readers
 * Fixes REACT_015 issue
 */
export const ensureLanguageAttribute = (lang = 'en') => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

/**
 * Creates accessible tables with proper structure
 * Fixes REACT_027 issue
 */
export const createAccessibleTable = ({ headers, data, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={`header-${index}`} scope="col">{header}</th>
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
};

/**
 * Creates accessible landmarks with unique roles
 * Fixes REACT_017 and REACT_025 issues
 */
export const createLandmark = ({ role, children, ariaLabel }) => {
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];

  if (!validRoles.includes(role)) {
    console.warn(`Invalid landmark role: ${role}. Using 'region' instead.`);
    role = 'region';
  }

  return React.createElement(
    role === 'main' ? 'main' : 'section',
    {
      role: role === 'main' ? undefined : role,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabel ? undefined : `landmark-${role}`
    },
    children
  );
};

/**
 * Creates accessible SVG elements
 * Fixes REACT_041 issue
 */
export const createAccessibleSVG = ({ title, desc, children, ...props }) => {
  return (
    <svg {...props} role="img" aria-labelledby={`svg-title-${props.id}`}>
      {title && <title id={`svg-title-${props.id}`}>{title}</title>}
      {desc && <desc id={`svg-desc-${props.id}`}>{desc}</desc>}
      {children}
    </svg>
  );
};

/**
 * Creates accessible links that aren't just styled text
 * Fixes REACT_036 issue
 */
export const createAccessibleLink = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

// Initialize accessibility features when component mounts
export const useAccessibilityInit = () => {
  React.useEffect(() => {
    ensureLanguageAttribute();
    // Add any other initialization here
  }, []);
};

// Preserve all existing exports and functions
// ... (keep all existing code)