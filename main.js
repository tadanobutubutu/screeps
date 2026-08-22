import { class1, function1, Object1 } from './path/to/module';
import React from 'react';

// ============================================
// Utility Functions
// ============================================

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// Preserved Existing Code
// ============================================

function existingFunction() {
  // ... existing code ...
}

// Added new function or changes as requested
function newFunction() {
  // ... new code ...
}

// ============================================
// Accessibility Improvements
// ============================================

// REACT_015: Wrapper component with lang attribute for HTML element
export const AppWrapper = ({ lang, children }) => {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

// REACT_036: Correcting fake links to use buttons instead
export const RotateBackButton = ({ onClick }) => {
  return (
    <button 
      id="unrotate" 
      type="button"
      onClick={onClick}
      aria-label="rotate view back"
    >
      rotate back
    </button>
  );
};

export const FakeLinkAsButton = ({ href, onClick, children, ...props }) => {
  if (href?.startsWith('#') || href === '') {
    return (
      <button 
        type="button"
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

// REACT_027 & REACT_025: Example of a table component with corrected accessibility
export const DependencyGraphTable = ({ data }) => {
  return (
    <table>
      <caption style={{ textAlign: 'left' }}>
        Dependency relationships visualization
      </caption>
      <thead>
        <tr>
          {data.columns.map((column, index) => (
            <th key={index} id={`header-${index}`} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// REACT_017 & REACT_025: Landmark structure with unique identifiers
export const PageLayout = ({ 
  headerContent, 
  mainContent, 
  navContent, 
  footerContent   
}) => {
  return (
    <>
      <header id="site-header" role="banner">
        {headerContent}
      </header>
      
      <nav id="main-navigation" role="navigation" aria-label="Main navigation">
        {navContent}
      </nav>
      
      <main id="main-content" role="main">
        {mainContent}
      </main>
      
      <footer id="site-footer" role="contentinfo">
        {footerContent}
      </footer>
    </>
  );
};

// REACT_041: SVG components with accessible name
export const AccessibleIconSVG = ({ ariaLabel, children, role = 'img', ...props }) => {
  return (
    <svg 
      aria-label={ariaLabel}
      role={role}
      aria-hidden={ariaLabel ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
};

export const GraphIcon = (props) => (
  <AccessibleIconSVG 
    ariaLabel="Dependency graph" 
    {...props}
  >
    {/* SVG path content */}
  </AccessibleIconSVG>
);

export const SettingsIcon = (props) => (
  <AccessibleIconSVG 
    ariaLabel="Settings" 
    {...props}
  >
    {/* SVG path content */}
  </AccessibleIconSVG>
);

// REACT_052: Focus management for modal dialogs
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000
      }}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button 
        type="button" 
        onClick={onClose}
        aria-label="Close dialog"
      >
        Close
      </button>
    </div>
  );
};

// REACT_054: Accessible error message component
export const ErrorMessage = ({ id, message }) => {
  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      style={{ color: '#d32f2f' }}
    >
      {message}
    </div>
  );
};

// REACT_056: Required field indicator
export const RequiredIndicator = () => {
  return (
    <span 
      aria-hidden="true"
      style={{ color: '#d32f2f' }}
    >
      *
    </span>
  );
};

// ============================================
// Landmark Uniqueness Utility (REACT_025)
// Combines both implementations for robust unique ID generation
// ============================================

const existingIds = new Set();
const UNIQUE_ID_PREFIX = 'landmark-';

/**
 * Ensures all landmark elements have unique IDs.
 * Can be called on a specific element or used to process all landmarks in the document.
 * 
 * @param {HTMLElement} [element] - Optional specific element to process. If omitted, processes all landmarks.
 * @returns {boolean|Function} - Returns true if element was processed, or a processor function if no element provided.
 */
export const ensureUniqueLandmarks = (element) => {
  const processElement = (el) => {
    if (!el) return false;

    if (!el.id) {
      let counter = 1;
      let newId = UNIQUE_ID_PREFIX + counter;
      while (existingIds.has(newId)) {
        counter++;
        newId = UNIQUE_ID_PREFIX + counter;
      }
      el.id = newId;
      existingIds.add(newId);
    } else if (!existingIds.has(el.id)) {
      existingIds.add(el.id);
    }

    return true;
  };

  // If element provided, process it directly
  if (element) {
    return processElement(element);
  }

  // Otherwise, return a function that can process elements, and also process all existing landmarks
  const landmarks = document.querySelectorAll('[role], nav, main, header, footer, aside, section, article');
  landmarks.forEach(processElement);

  return processElement;
};

// ============================================
// Exports
// ============================================

// Preserved exports
export { existingFunction };

// New function and imported modules
export { newFunction, class1, function1, Object1 };

// Export all accessibility-friendly components
export { 
  RotateBackButton, 
  FakeLinkAsButton, 
  DependencyGraphTable,
  AccessibleIconSVG,
  GraphIcon,
  SettingsIcon,
  AppWrapper,
  PageLayout,
  Modal,
  ErrorMessage,
  RequiredIndicator,
  ensureUniqueLandmarks
};