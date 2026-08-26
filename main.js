// Address accessibility issues from insight report

import React from 'react';
import ReactDOM from 'react-dom';

// Other imports...

// Function to get language attribute from the document
const getLangAttribute = () => {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    return htmlElement.lang || ''; // Add lang attribute if it exists
  }
  return null;
};

// Function to get SVG accessible name
const getSvgAccessibleName = (svgElement) => {
  if (!svgElement || typeof document === 'undefined') {
    return null;
  }

  // Check for aria-label or aria-labelledby
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    return referencedElement ? referencedElement.textContent : null;
  }

  // Check for title element within SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }

  // Check for descendant with role="img" and aria-label
  const imgWithLabel = svgElement.querySelector('[role="img"][aria-label]');
  if (imgWithLabel) {
    return imgWithLabel.getAttribute('aria-label');
  }

  return null;
};

// Function to create an in-page button with fake link handling
const createInPageButton = (options = {}) => {
  const {
    id,
    label,
    onClick,
    className = '',
    ariaLabel,
    type = 'button',
    disabled = false
  } = options;

  if (typeof document !== 'undefined') {
    // Use semantic <button> element instead of <a> for better accessibility
    const button = document.createElement('button');

    if (id) {
      button.id = id;
    }

    button.textContent = label || '';
    button.type = type;
    button.disabled = disabled;

    if (className) {
      button.className = className;
    }

    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    }

    if (!disabled && onClick && typeof onClick === 'function') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    }

    // Add keyboard support - buttons are naturally keyboard accessible
    if (!disabled) {
      button.setAttribute('tabindex', '0');
    }

    return button;
  }

  return null;
};

// React component for in-page button
const InPageButton = ({
  id,
  label,
  onClick,
  className,
  ariaLabel,
  type = 'button',
  disabled = false
}) => {
  // Use semantic <button> element for better accessibility
  // Instead of <a role="button"> which is an anti-pattern
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'gray' : ''
      }}
    >
      {label}
    </button>
  );
};

// New function — validateTableStructure (for example purposes)
const validateTableStructure = () => {
  // Custom table structure validation logic goes here
  const errors = [];

  // Example structure check
  const tables = typeof document !== 'undefined' ? document.querySelectorAll('table') : [];
  if (tables.length > 0) {
    tables.forEach((table) => {
      const rows = table.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td, th');
        cells.forEach((cell) => {
          if (!cell.textContent || cell.textContent.trim() === '') {
            errors.push({ message: 'Empty table cell found', line: 0, column: 0 });
          }
        });
      });
    });
  }

  return { errors };
};

// Function to validate table accessibility
const validateTableAccessibility = () => {
  const errors = [];
  
  if (typeof document === 'undefined') {
    return { errors };
  }

  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    // Check if table has proper headers
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;
    
    if (!hasHeaders) {
      errors.push({
        message: `Table ${index + 1} is missing header cells (th elements)`,
        line: 0,
        column: 0
      });
    }

    // Check for scope attribute on headers
    headers.forEach((header) => {
      if (!header.hasAttribute('scope')) {
        errors.push({
          message: `Table header missing scope attribute`,
          line: 0,
          column: 0
        });
      }
    });

    // Check for caption or summary
    const caption = table.querySelector('caption');
    const summary = table.getAttribute('summary');
    if (!caption && !summary) {
      errors.push({
        message: `Table ${index + 1} is missing a caption or summary`,
        line: 0,
        column: 0
      });
    }
  });

  return { errors };
};

// Function to validate landmarks
const validateLandmarkStructure = () => {
  const errors = [];
  
  if (typeof document === 'undefined') {
    return { valid: true, errors };
  }

  // Check for main landmark (should have exactly one)
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    errors.push({
      message: 'Page is missing a main landmark',
      line: 0,
      column: 0
    });
  } else if (mainElements.length > 1) {
    errors.push({
      message: `Page has ${mainElements.length} main landmarks. Should have exactly one.`,
      line: 0,
      column: 0
    });
  }

  // Check for header/nav landmarks
  const navElements = document.querySelectorAll('nav');
  const headerElements = document.querySelectorAll('header, [role="banner"]');
  
  if (headerElements.length > 1) {
    errors.push({
      message: `Page has ${headerElements.length} header landmarks. Should have at most one.`,
      line: 0,
      column: 0
    });
  }

  // Check for footer landmark
  const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
  if (footerElements.length > 1) {
    errors.push({
      message: `Page has ${footerElements.length} footer landmarks. Should have at most one.`,
      line: 0,
      column: 0
    });
  }

  return { valid: errors.length === 0, errors };
};

// Alias for backwards compatibility
const validateLandmark = validateLandmarkStructure;

// ... Keep existing code here

const Root = () => {
  // Other component code...

  const handleRotateBack = () => {
    // Logic to rotate back
  };

  // New function for example purposes
  const newFunction = () => {
    // Logic for the new function
  };

  // Get the language attribute for the html element
  const lang = getLangAttribute();

  // Add new validateTableStructure function validation
  const tableStructureError = validateTableStructure();
  if (tableStructureError.errors.length > 0) {
    console.error(tableStructureError.errors);
  }

  // Validate table accessibility and check for unique landmarks (2 issues)
  const tableAccessibilityError = validateTableAccessibility();
  if (tableAccessibilityError.errors.length > 0) {
    console.error(tableAccessibilityError.errors);
  }

  const uniqueLandmarkError = validateLandmarkStructure();
  if (uniqueLandmarkError.errors.length > 0) {
    console.error(uniqueLandmarkError.errors);
  }

  // Add validateLandmark validation
  const landmarkError = validateLandmark();
  if (!landmarkError.valid) {
    console.error(landmarkError.errors);
  }

  return (
    <html lang={lang || 'en'}>
      {/* Other JSX elements... */}
      <main>
        <InPageButton
          id="unrotate"
          label="Rotate back"
          onClick={handleRotateBack}
        />
        {/* Example usage of new function */}
        <InPageButton onClick={newFunction} label="New Function" />
      </main>
    </html>
  );
};

export {
  Root,
  handleRotateBack,
  newFunction,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  getSvgAccessibleName,
  createInPageButton,
  InPageButton,
  validateTableStructure // Export the new validateTableStructure function
};

ReactDOM.render(<Root />, document.getElementById('root'));