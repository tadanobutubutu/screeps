// main.js
import React from 'react';

// Preserve all existing exports and functions
// ... (existing code remains unchanged)

// Add new accessibility-focused functions

/**
 * Ensures proper language attribute is set for screen readers
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
export function setLanguageAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

/**
 * Creates an accessible table with proper structure
 * @param {Object} props - Table props
 * @param {string} props.caption - Table caption for screen readers
 * @param {Array} props.headers - Array of header objects {key, label}
 * @param {Array} props.data - Array of row data objects
 */
export function AccessibleTable({ caption, headers, data }) {
  return (
    <table aria-label={caption}>
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key} scope="col">
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td key={`${rowIndex}-${header.key}`}>{row[header.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Creates accessible landmarks for navigation
 * @param {Object} props - Landmark props
 * @param {string} props.type - Landmark type (main, nav, etc.)
 * @param {ReactNode} props.children - Content
 */
export function AccessibleLandmark({ type, children }) {
  const landmarkProps = {
    main: { role: 'main' },
    nav: { role: 'navigation' },
    header: { role: 'banner' },
    footer: { role: 'contentinfo' },
  }[type] || {};

  return React.createElement(type, landmarkProps, children);
}

/**
 * Creates accessible SVG with proper labeling
 * @param {Object} props - SVG props
 * @param {string} props.title - Accessible title
 * @param {string} props.desc - Accessible description
 * @param {ReactNode} props.children - SVG content
 */
export function AccessibleSVG({ title, desc, children }) {
  return (
    <svg aria-hidden="true" focusable="false">
      <title>{title}</title>
      <desc>{desc}</desc>
      {children}
    </svg>
  );
}

/**
 * Creates unique landmarks with proper ARIA labels
 * @param {Object} props - Landmark props
 * @param {string} props.type - Landmark type
 * @param {string} props.label - ARIA label
 * @param {ReactNode} props.children - Content
 */
export function UniqueLandmark({ type, label, children }) {
  return (
    <div role={type} aria-label={label}>
      {children}
    </div>
  );
}

/**
 * Creates accessible fake link that behaves like a button
 * @param {Object} props - Link props
 * @param {string} props.href - URL
 * @param {ReactNode} props.children - Content
 */
export function AccessibleFakeLink({ href, children }) {
  return (
    <a
      href={href}
      role="button"
      tabIndex="0"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = href;
        }
      }}
    >
      {children}
    </a>
  );
}

// Initialize accessibility features if needed
if (typeof window !== 'undefined') {
  // Set language attribute on page load
  setLanguageAttribute();

  // Add keyboard navigation support for fake links
  document.addEventListener('DOMContentLoaded', () => {
    const fakeLinks = document.querySelectorAll('[role="button"]');
    fakeLinks.forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = link.getAttribute('href');
        }
      });
    });
  });
}