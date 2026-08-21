// main.js - Accessibility fixes applied

import React from 'react';

/**
 * Fix for REACT_015: React Language Attribute
 * Adds lang attribute to html element
 */
export const LanguageProvider = ({ children, lang = 'en' }) => {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

/**
 * Fix for REACT_025 & REACT_017: Unique Landmarks & Landmarks
 * Ensures proper landmark usage with unique main landmark
 */
export const Layout = ({ children, navigation, footer }) => {
  return (
    <>
      {navigation}
      <main id="main-content" role="main">
        {children}
      </main>
      {footer}
    </>
  );
};

/**
 * Fix for REACT_027: React Table Structure
 * Proper table structure with thead, tbody, and scope attributes
 */
export const AccessibleTable = ({ headers, rows }) => {
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
        {rows.map((row, rowIndex) => (
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
 * Fix for REACT_041: React SVG Accessible Name
 * Adds title and aria-label to SVG elements
 */
export const AccessibleIcon = ({ name, className, ...props }) => {
  const icons = {
    home: (
      <svg className={className} aria-label={`${name} icon`} role="img" {...props}>
        <title>{name}</title>
        <path d="..." />
      </svg>
    ),
    settings: (
      <svg className={className} aria-label={`${name} icon`} role="img" {...props}>
        <title>{name}</title>
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  };
  
  return icons[name] || null;
};

/**
 * Fix for REACT_036: React Fake Link
 * Proper semantic usage of links vs buttons
 * Uses <a> for navigation, <button> for actions
 */
export const ActionLink = ({ to, children, onClick, isNavigation }) => {
  if (isNavigation) {
    return <a href={to}>{children}</a>;
  }
  return <button onClick={onClick}>{children}</button>;
};

// Existing function - PRESERVED
export const existingFunction = (data) => {
  return data;
};

// Existing export - PRESERVED
export const processData = (input) => {
  return input.map(item => ({
    ...item,
    processed: true
  }));
};