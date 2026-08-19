// main.js
import React from 'react';

// Existing exports and functions should remain unchanged
// Add new accessibility-focused functions below

/**
 * Ensures all interactive elements have proper ARIA attributes
 * @param {React.ReactNode} children
 * @returns {React.ReactNode}
 */
export function AccessibleButton({ children, ...props }) {
  return (
    <button
      {...props}
      aria-label={props['aria-label'] || children}
    >
      {children}
    </button>
  );
}

/**
 * Creates a properly structured table with ARIA attributes
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.caption
 * @returns {React.ReactNode}
 */
export function AccessibleTable({ children, caption, ...props }) {
  return (
    <table {...props} aria-label={caption}>
      {caption && <caption>{caption}</caption>}
      {children}
    </table>
  );
}

/**
 * Wraps content in a landmark region for better screen reader navigation
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.role - ARIA role (e.g., 'main', 'navigation')
 * @returns {React.ReactNode}
 */
export function Landmark({ children, role, ...props }) {
  return (
    <div
      role={role}
      aria-label={props['aria-label']}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Creates an accessible SVG with proper labeling
 * @param {Object} props
 * @param {string} props.title - Accessible title for the SVG
 * @returns {React.ReactNode}
 */
export function AccessibleSVG({ title, children, ...props }) {
  return (
    <svg {...props} aria-labelledby={title ? `${props.id}-title` : undefined}>
      {title && <title id={`${props.id}-title`}>{title}</title>}
      {children}
    </svg>
  );
}

/**
 * Creates a unique landmark with proper ARIA attributes
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.role - ARIA role
 * @param {string} props.label - Accessible label
 * @returns {React.ReactNode}
 */
export function UniqueLandmark({ children, role, label, ...props }) {
  return (
    <div
      role={role}
      aria-label={label}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Creates an accessible link that doesn't look like a link
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export function FakeLink({ children, ...props }) {
  return (
    <span
      {...props}
      role="link"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (props.onClick) props.onClick(e);
        }
      }}
    >
      {children}
    </span>
  );
}

// Keep all existing exports and functions from the original file
// ... (rest of the original main.js content)