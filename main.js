// Example of a React component rendering a table with proper <th> scope attributes
import React from 'react';

// Existing component - enhanced with proper table accessibility
const MyTableComponent = ({ headers, rows, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
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

// Accessible navigation landmark with unique name (REACT_017, REACT_025)
const PrimaryNavigation = ({ items }) => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Secondary navigation landmark with unique name (REACT_017, REACT_025)
const SecondaryNavigation = ({ items }) => {
  return (
    <nav aria-label="Secondary navigation">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Main landmark (REACT_017)
const MainContent = ({ children }) => {
  return (
    <main aria-label="Main content">
      {children}
    </main>
  );
};

// Accessible SVG with proper name (REACT_041)
const IconLogo = () => {
  return (
    <svg
      role="img"
      aria-label="Company logo"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Company logo</title>
      <circle cx="24" cy="24" r="20" fill="currentColor" />
    </svg>
  );
};

const IconSearch = () => {
  return (
    <svg
      role="img"
      aria-label="Search icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Search</title>
      <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

// Language attribute helper component (REACT_015)
const LanguageWrapper = ({ lang, children }) => {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

// Accessible link component - using real <a> tag, not fake (REACT_036)
const AccessibleLink = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default MyTableComponent;