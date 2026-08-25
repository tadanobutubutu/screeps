// main.js - Fixed accessibility issues

import React from 'react';

// Helper function to get language attribute
const getLangAttribute = () => 'en';

// REACT_015: React Language Attribute - Add lang attribute to html element
// This should be set at the document level, but here's the pattern:
export const LanguageProvider = ({ children, language = 'en' }) => (
  <div lang={language}>
    {children}
  </div>
);

// REACT_017: React Landmarks - Use semantic landmark elements
// REACT_025: React Unique Landmarks - Each landmark should be unique
export const AccessibleLayout = ({ header, main, footer }) => (
  <div className="app-container">
    <header role="banner">
      {header}
    </header>
    <main role="main" id="main-content">
      {main}
    </main>
    <footer role="contentinfo">
      {footer}
    </footer>
  </div>
);

// REACT_027: React Table Structure - Use proper table markup
export const AccessibleTable = ({ data, columns }) => (
  <table>
    <caption>Data Table Description</caption>
    <thead>
      <tr>
        {columns.map((col, i) => (
          <th key={i} scope="col">{col.header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col, colIndex) => (
            <td key={colIndex}>{row[col.accessor]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// REACT_036: React Fake Link - Use real <a> for navigable links
// Use <button> for actions, <a> for navigation
export const AccessibleLink = ({ href, onClick, children, isNavigation }) => {
  if (isNavigation || href) {
    return <a href={href}>{children}</a>;
  }
  return <button onClick={onClick} type="button">{children}</button>;
};

// REACT_041: React SVG Accessible Name - Add title and desc to SVGs
export const AccessibleIcon = ({ name, className }) => (
  <svg className={className} aria-hidden="true" focusable="false">
    <title>{name}</title>
    {/* SVG content */}
  </svg>
);

// Better approach with hidden text for screen readers:
export const AccessibleSVG = ({ label, children }) => (
  <svg aria-labelledby="svg-title" role="img">
    <title id="svg-title">{label}</title>
    {children}
  </svg>
);

// Example component that fixes multiple issues
export const AccessibleCard = ({ title, description, linkHref, iconName }) => (
  <article aria-labelledby={`card-${title}-title`}>
    <AccessibleIcon name={iconName} />
    <h2 id={`card-${title}-title`}>{title}</h2>
    <p>{description}</p>
    <AccessibleLink href={linkHref} isNavigation={true}>
      Read more about {title}
    </AccessibleLink>
  </article>
);

export default {
  LanguageProvider,
  AccessibleLayout,
  AccessibleTable,
  AccessibleLink,
  AccessibleIcon,
  AccessibleSVG,
  AccessibleCard,
  getLangAttribute,
};