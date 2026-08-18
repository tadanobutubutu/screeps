// main.js - Accessibility-improved version

import React from 'react';

// Fix for REACT_015: React Language Attribute
// The lang attribute should be set on the HTML element at the document level
// In Next.js, this is typically set in _document.js or _app.js

// Fix for REACT_017 & REACT_025: React Landmarks (unique landmarks)
// Ensure only one of each: <header>, <main>, <nav>, <footer>

// Fix for REACT_027: React Table Structure
// Tables should use proper semantic elements: <table>, <thead>, <tbody>, <th>

// Fix for REACT_041: React SVG Accessible Name
// SVGs should have aria-label, aria-labelledby, or <title> element

// Fix for REACT_036: React Fake Link
// Use <a> for navigation and <button> for actions

export const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main role="main" id="main-content">
        {children}
      </main>

      <footer role="contentinfo">
        <p>&copy; 2024 Accessible App</p>
      </footer>
    </div>
  );
};

// Accessible Table Component - Fix for REACT_027
export const AccessibleTable = ({ data, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
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

// Accessible SVG Component - Fix for REACT_041
export const AccessibleIcon = ({ children, label, className }) => {
  return (
    <svg
      className={className}
      aria-label={label}
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

// Alternative SVG with title element - Fix for REACT_041
export const AccessibleSVGWithTitle = ({ title, children, className }) => {
  return (
    <svg
      className={className}
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {children}
    </svg>
  );
};

// Button Component - Fix for REACT_036 (Fake Link)
// Use button for actions, not styled links
export const ActionButton = ({ onClick, children, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Link Component - For actual navigation
export const NavLink = ({ href, children }) => {
  return (
    <a href={href}>
      {children}
    </a>
  );
};

// Accessible Form
export const AccessibleForm = ({ onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export const AccessibleInput = ({
  id,
  label,
  type = 'text',
  error,
  required = false
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="error-message">
          {error}
        </span>
      )}
    </div>
  );
};

// Landmark-free component (no landmark regions)
export const ContentSection = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// New function to set the HTML lang attribute
// This should be called in your app's entry point (like _app.js in Next.js)
export const setHtmlLangAttribute = (lang = 'en') => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export default {
  MainLayout,
  AccessibleTable,
  AccessibleIcon,
  AccessibleSVGWithTitle,
  ActionButton,
  NavLink,
  AccessibleForm,
  AccessibleInput,
  ContentSection,
  setHtmlLangAttribute
};