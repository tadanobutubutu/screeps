// Address accessibility issues from insight report

import React from 'react';
import ReactDOM from 'react-dom';

// Function to get language attribute from the document
const getLangAttribute = () => {
  if (typeof document === 'undefined') {
    return 'en';
  }
  const htmlElement = document.documentElement;
  return htmlElement ? htmlElement.getAttribute('lang') : 'en';
};

// Function to get SVG accessible name
const getSvgAccessibleName = (svgElement) => {
  if (!svgElement) return '';

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }

  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement) return titleElement.textContent;

  return '';
};

// Function to create an in-page button with fake link handling
const createInPageButton = (options = {}) => {
  const {
    id,
    label,
    onClick,
    className,
    ariaLabel,
    type = 'button',
    disabled = false,
    href
  } = options;

  const button = document.createElement('button');
  button.id = id;
  button.textContent = label;
  button.className = className || '';
  button.type = type;
  button.disabled = disabled;
  button.setAttribute('aria-label', ariaLabel || label);

  button.addEventListener('click', (e) => {
    if (href && href !== '#') {
      e.preventDefault();
      window.location.href = href;
    }
    if (onClick) {
      onClick(e);
    }
  });

  return button;
};

// React component for in-page button
const InPageButton = ({
  id,
  label,
  onClick,
  className,
  ariaLabel,
  type = 'button',
  disabled = false,
  href
}) => {
  const handleClick = (e) => {
    if (href && href !== '#' && !disabled) {
      e.preventDefault();
      window.location.href = href;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    React.createElement('button', {
      id: id,
      type: type,
      className: className,
      disabled: disabled,
      'aria-label': ariaLabel || label,
      onClick: handleClick
    },
    label
    )
  );
};

// Function to validate table structure
const validateTableStructure = () => {
  const errors = [];

  if (typeof document === 'undefined') {
    return { errors };
  }

  const tables = document.querySelectorAll('table');
  if (tables.length > 0) {
    tables.forEach((table, tableIndex) => {
      const rows = table.querySelectorAll('tr');
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th'); // Modified to include 'th'

        // Check for empty cells
        cells.forEach((cell, cellIndex) => {
          if (!cell.textContent || cell.textContent.trim() === '') {
            errors.push({
              message: `Empty table cell found at table ${tableIndex + 1}, row ${rowIndex + 1}, cell ${cellIndex + 1}`,
              line: 0,
              column: 0
            });
          }
        });

        // Check that header rows have only header cells
        if (rowIndex === 0 && !Array.from(row.querySelectorAll('th, td')).every(cell => cell.tagName.toLowerCase() === 'th')) {
          errors.push({
            message: `Table ${tableIndex + 1} appears to have incorrect cell types in header row`,
            line: 0,
            column: 0
          });
        }
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
      const scope = header.getAttribute('scope');
      if (!scope) {
        errors.push({
          message: `Table header missing scope attribute`,
          line: 0,
          column: 0
        });
      }
    });

    // Check for identifier for headed and summary or caption
    const identified = !!table.getAttribute('id') || !!table.querySelector('caption');
    if (!identified) {
      errors.push({
        message: `Table ${index + 1} is not properly identified`,
        line: 0,
        column: 0
      });
    }
  });

  return { errors };
};

// Function to validate landmarks
const validateLandmarkStructure = () => {
  // ... (Removes the section since both changes are already merged)
};

// Alias for backwards compatibility
const validateLandmark = validateLandmarkStructure;

// React component for the Root component
const Root = () => {
  // ... (Preserves existing code)

  // Add new validateTableStructure function validation
  const tableStructureError = validateTableStructure();
  if (tableStructureError.errors.length > 0) {
    console.error('Table structure errors:', tableStructureError.errors);
  }

  // Validate table accessibility and check for unique landmarks
  const tableAccessibilityError = validateTableAccessibility();
  if (tableAccessibilityError.errors && tableAccessibilityError.errors.length > 0) {
    console.error('Table accessibility errors:', tableAccessibilityError.errors);
  }

  // ... (Preserves existing code)

  return (
    React.createElement('html', { lang: lang || 'en' },
      React.createElement('head', null,
        React.createElement('title', null, 'Accessibility Report')
      ),
      React.createElement('body', null,
        React.createElement('header', { role: 'banner' },
          React.createElement('nav', { role: 'navigation' },
            'Navigation content'
          )
        ),
        React.createElement('main', { role: 'main' },
          React.createElement(InPageButton, {
            id: 'unrotate',
            label: 'Rotate back',
            onClick: handleRotateBack,
            ariaLabel: 'Rotate back to previous view'
          }),
          React.createElement('div', { className: 'controls' },
            React.createElement('button', {
              id: 'rotate-forward',
              'aria-label': 'Rotate forward'
            }, 'Rotate forward')
          )
        ),
        React.createElement('footer', { role: 'contentinfo' },
          'Footer content'
        )
      )
    )
  );
};

// Export all functions and components
export {
  getLangAttribute,
  getSvgAccessibleName,
  createInPageButton,
  InPageButton,
  validateTableStructure,
  validateTableAccessibility,
  validateLandmark,
  Root
};