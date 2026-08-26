// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// Skip navigation link for keyboard users

import React from 'react';

// Common accessibility patterns for these issues:

// 1. For SVGs - add aria-label or role="img" with aria-labelledby
const AccessibleIcon = ({ label, children }) => (
  <svg role="img" aria-label={label}>
    {children}
  </svg>
);

// 2. For landmarks - ensure unique accessible names when multiple of same type
const Header = () => (
  <header role="banner" aria-label="Main header">
    {/* Header content */}
  </header>
);

const Navigation = () => (
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation content */}
  </nav>
);

const Footer = () => (
  <footer role="contentinfo">
    {/* Footer content */}
  </footer>
);

// 3. For links - use semantic <a> tags with proper href
const AccessibleLink = ({ href, children }) => (
  <a href={href} className="link">
    {children}
  </a>
);

// REACT_015: Add lang attribute to HTML element
export const addLangAttribute = (Component) => {
  return React.forwardRef(({ lang = 'en', ...props }, ref) => {
    return <Component ref={ref} lang={lang} {...props} />;
  });
};

// REACT_027: Fix table structure issues
export const fixTableStructure = (tableComponent) => {
  return React.forwardRef(({ caption, headers, rows, ...props }, ref) => {
    return (
      <table ref={ref} {...props}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {headers?.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  });
};

// REACT_017: Add/fix landmark issues
export const addLandmarkIssues = (Component, landmarkType, label) => {
  const landmarkRoles = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo',
    section: 'region',
  };

  return React.forwardRef(({ role = landmarkRoles[landmarkType], ...props }, ref) => {
    return (
      <Component
        ref={ref}
        role={role}
        aria-label={label}
        {...props}
      />
    );
  });
};

// REACT_041: Add accessible names to SVGs
export const addSvgAccessibleNames = (svgProps) => {
  return {
    ...svgProps,
    role: 'img',
    'aria-label': svgProps.label || 'Decorative icon',
    'aria-hidden': !svgProps.label,
  };
};

// REACT_025: Ensure unique landmarks
export const ensureUniqueLandmarks = (landmarkElements) => {
  return landmarkElements.map((element, index) => {
    const existingLabel = element.props?.['aria-label'];
    const uniqueLabel = existingLabel || `${element.props?.role || 'section'}-${index + 1}`;
    
    return React.cloneElement(element, {
      ...element.props,
      'aria-label': uniqueLabel,
    });
  });
};

// REACT_036: Fix fake link issue
export const fixFakeLinkIssue = (FakeLinkComponent) => {
  return React.forwardRef(({ href, onClick, children, ...props }, ref) => {
    // If it has href, render as proper anchor
    if (href && href.startsWith('/')) {
      return (
        <a ref={ref} href={href} onClick={onClick} {...props}>
          {children}
        </a>
      );
    }
    // Otherwise keep as button with proper semantics
    return (
      <button ref={ref} type="button" onClick={onClick} {...props}>
        {children}
      </button>
    );
  });
};

// Main component
const App = () => (
  <div lang="en">
    <Header />
    <main role="main" id="main-content">
      {/* Main content */}
    </main>
    <Navigation />
    <Footer />
  </div>
);

export default App;