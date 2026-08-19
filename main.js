// main.js
import React from 'react';

// Existing exports and functions should remain unchanged
// [Your existing code here]

// New accessibility-focused functions to address the issues

/**
 * Adds proper language attribute to HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
export const ensureLanguageAttribute = (htmlElement) => {
  if (!htmlElement.lang) {
    htmlElement.lang = 'en'; // Default to English
  }
};

/**
 * Ensures proper table structure with headers
 * Fixes REACT_027: React Table Structure
 */
export const createAccessibleTable = (headers, data) => {
  return (
    <table>
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
 * Adds proper landmark elements
 * Fixes REACT_017: React Landmarks
 */
export const createLandmark = (type, children, ariaLabel) => {
  const landmarkProps = {
    'aria-label': ariaLabel,
    role: type
  };

  switch(type) {
    case 'banner':
      return <header {...landmarkProps}>{children}</header>;
    case 'navigation':
      return <nav {...landmarkProps}>{children}</nav>;
    case 'main':
      return <main {...landmarkProps}>{children}</main>;
    case 'complementary':
      return <aside {...landmarkProps}>{children}</aside>;
    case 'contentinfo':
      return <footer {...landmarkProps}>{children}</footer>;
    default:
      return <section {...landmarkProps}>{children}</section>;
  }
};

/**
 * Ensures SVG elements have accessible names
 * Fixes REACT_041: React SVG Accessible Name
 */
export const createAccessibleSVG = (svgContent, title, description) => {
  return (
    <svg aria-labelledby={`svg-title-${title.replace(/\s+/g, '-')}`}>
      <title id={`svg-title-${title.replace(/\s+/g, '-')}`}>{title}</title>
      <desc>{description}</desc>
      {svgContent}
    </svg>
  );
};

/**
 * Ensures landmarks are unique
 * Fixes REACT_025: React Unique Landmarks
 */
export const getUniqueLandmarkId = (baseId) => {
  const elements = document.querySelectorAll(`[role="${baseId}"]`);
  return `${baseId}-${elements.length + 1}`;
};

/**
 * Creates accessible fake links
 * Fixes REACT_036: React Fake Link
 */
export const createAccessibleFakeLink = (content, onClick, ariaLabel) => {
  return (
    <span
      role="link"
      tabIndex="0"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={ariaLabel}
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
    >
      {content}
    </span>
  );
};

// Example of how to use these functions in your components
export const AccessibleComponentExample = () => {
  const tableHeaders = ['Name', 'Age', 'Occupation'];
  const tableData = [
    ['John Doe', '30', 'Developer'],
    ['Jane Smith', '25', 'Designer']
  ];

  return (
    <div>
      <header role="banner" aria-label="Site header">
        <h1>Accessible Website</h1>
      </header>

      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>

      <main role="main" aria-label="Main content">
        <h2>Data Table</h2>
        {createAccessibleTable(tableHeaders, tableData)}

        <div>
          <h2>SVG Example</h2>
          {createAccessibleSVG(
            <circle cx="50" cy="50" r="40" fill="red" />,
            "Example Circle",
            "This is a red circle SVG"
          )}
        </div>

        <div>
          {createAccessibleFakeLink(
            "Click here to learn more",
            () => console.log("Fake link clicked"),
            "Learn more about our services"
          )}
        </div>
      </main>

      <footer role="contentinfo" aria-label="Site footer">
        <p>© 2023 Accessible Company</p>
      </footer>
    </div>
  );
};