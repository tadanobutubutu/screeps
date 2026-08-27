import { Html } from 'next/document';
import React from 'react';

// Example component with accessibility issues fixed

// Fix for REACT_015: Add lang attribute to html element
export function Document() {
  return (
    <Html lang="en">
      <head />
      <body />
    </Html>
  );
}

// Fix for REACT_017 & REACT_025: Ensure proper landmarks
export function Layout({ children }) {
  return (
    <div className="app-container">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* navigation items */}
        </nav>
      </header>
      
      <main role="main" id="main-content">
        {children}
      </main>
      
      <footer role="contentinfo">
        {/* footer content */}
      </footer>
    </div>
  );
}

// Fix for REACT_027: Proper table structure
export function DataTable({ data }) {
  return (
    <table>
      <caption>Data Results</caption>
      <thead>
        <tr>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.header}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Fix for REACT_041: SVG accessible name
export function Icon({ name, size = 24 }) {
  const icons = {
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-labelledby="search-icon">
        <title id="search-icon">Search</title>
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    close: (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-labelledby="close-icon">
        <title id="close-icon">Close</title>
        <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  };
  
  return icons[name] || null;
}

// Fix for REACT_036: Use button for actions, not anchor
export function ActionButton({ onClick, children, variant = 'primary' }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// Link component for actual navigation
export function Link({ href, children }) {
  return (
    <a href={href} className="nav-link">
      {children}
    </a>
  );
}

export default {
  Document,
  Layout,
  DataTable,
  Icon,
  ActionButton,
  Link,
};