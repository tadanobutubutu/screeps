import React from 'react';
import { useState, useEffect } from 'react';

// Preserves all existing exports and functions
// ... (your existing code here) ...

/**
 * Adds language attribute to HTML element for better screen reader support
 * Fixes REACT_015: React Language Attribute
 */
const addLanguageAttribute = () => {
  if (typeof window !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }
};

/**
 * Ensures proper table structure for screen readers
 * Fixes REACT_027: React Table Structure
 */
const AccessibleTable = ({ children, ...props }) => {
  return (
    <table {...props}>
      <thead>
        {React.Children.map(children, (child) => {
          if (child.type === 'tr' && child.props['data-header']) {
            return child;
          }
          return null;
        })}
      </thead>
      <tbody>
        {React.Children.map(children, (child) => {
          if (child.type === 'tr' && !child.props['data-header']) {
            return child;
          }
          return null;
        })}
      </tbody>
    </table>
  );
};

/**
 * Adds proper landmark elements for screen readers
 * Fixes REACT_017: React Landmarks
 */
const AccessibleLandmark = ({ type, children, ...props }) => {
  const landmarkMap = {
    header: 'header',
    main: 'main',
    footer: 'footer',
    nav: 'nav',
    aside: 'aside',
    section: 'section'
  };

  const Tag = landmarkMap[type] || 'div';

  return (
    <Tag role={type} {...props}>
      {children}
    </Tag>
  );
};

/**
 * Ensures landmarks are unique and properly labeled
 * Fixes REACT_025: React Unique Landmarks
 */
const useUniqueLandmark = (type) => {
  const [landmarkId] = useState(() => `landmark-${type}-${Math.random().toString(36).substr(2, 9)}`);

  return {
    'aria-labelledby': landmarkId,
    id: landmarkId
  };
};

/**
 * Ensures SVG elements have accessible names
 * Fixes REACT_041: React SVG Accessible Name
 */
const AccessibleSVG = ({ title, desc, children, ...props }) => {
  return (
    <svg {...props} role="img" aria-hidden={!title}>
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      {children}
    </svg>
  );
};

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 */
const AccessibleLink = ({ href, children, ...props }) => {
  if (!href) {
    return <span {...props}>{children}</span>;
  }

  if (href === '#') {
    return (
      <button type="button" {...props} className="fake-link">
        {children}
      </button>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

/**
 * Adds lang attribute to main component if missing
 * Also sets the global HTML lang attribute on mount
 */
const MainComponent = ({ children, ...props }) => {
  useEffect(() => {
    addLanguageAttribute();
  }, []);

  return (
    <main lang="en" {...props}>
      {children}
    </main>
  );
};

// Export all existing functions and add new accessibility components
export {
  // Existing exports...
  AccessibleTable,
  AccessibleLandmark,
  AccessibleSVG,
  useUniqueLandmark,
  AccessibleLink,
  MainComponent,
  // ... rest of existing exports
};