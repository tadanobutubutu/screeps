// main.js
import React from 'react';

// Preserve all existing exports and functions
// ... (your existing code here)

// Add new accessibility-focused functions

/**
 * Ensures proper language attribute for screen readers
 * @param {string} lang - Language code (e.g., 'en', 'es')
 * @returns {string} HTML lang attribute
 */
export function getLanguageAttribute(lang = 'en') {
  return `lang="${lang}"`;
}

/**
 * Creates accessible table structure with proper headers
 * @param {Object} props - Table props
 * @param {React.ReactNode} props.children - Table content
 * @returns {JSX.Element} Accessible table
 */
export function AccessibleTable({ children, ...props }) {
  return (
    <table {...props} role="table">
      {children}
    </table>
  );
}

/**
 * Creates accessible landmark regions
 * @param {Object} props - Landmark props
 * @param {'main'|'navigation'|'search'|'contentinfo'} props.type - Landmark type
 * @param {React.ReactNode} props.children - Content
 * @returns {JSX.Element} Accessible landmark
 */
export function Landmark({ type, children, ...props }) {
  const landmarkRoles = {
    main: 'main',
    navigation: 'navigation',
    search: 'search',
    contentinfo: 'contentinfo'
  };

  return (
    <section
      {...props}
      role={landmarkRoles[type]}
      aria-label={type}
    >
      {children}
    </section>
  );
}

/**
 * Creates accessible SVG with proper naming
 * @param {Object} props - SVG props
 * @param {string} props.title - Accessible name
 * @param {React.ReactNode} props.children - SVG content
 * @returns {JSX.Element} Accessible SVG
 */
export function AccessibleSVG({ title, children, ...props }) {
  return (
    <svg {...props} aria-labelledby={title}>
      <title id={title}>{title}</title>
      {children}
    </svg>
  );
}

/**
 * Creates accessible link that isn't just a span with click handler
 * @param {Object} props - Link props
 * @param {string} props.href - URL
 * @param {React.ReactNode} props.children - Content
 * @returns {JSX.Element} Accessible link
 */
export function AccessibleLink({ href, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

// Example of how to use these in your components:
// function MyComponent() {
//   return (
//     <div {...getLanguageAttribute('en')}>
//       <Landmark type="main">
//         <AccessibleTable>
//           {/* table content */}
//         </AccessibleTable>
//       </Landmark>
//       <AccessibleSVG title="example-icon">
//         {/* SVG content */}
//       </AccessibleSVG>
//       <AccessibleLink href="/example">Example Link</AccessibleLink>
//     </div>
//   );
// }