// Address accessibility issues from insight report

import React from 'react';
import ReactDOM from 'react-dom';

// Function to get language attribute from the document
const getLangAttribute = () => {
  if (typeof document === 'undefined') {
    return 'en';
  }
  const htmlElement = document.querySelector('html');
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
    href = '#'
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
        const cells = row.querySelectorAll('td, th');
        const headerCells = row.querySelectorAll('th');
        
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
        if (rowIndex === 0 && headerCells.length === 0) {
          errors.push({
            message: `Table ${tableIndex + 1} appears to be missing a header row`,
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
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
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

// React component for the Root component
const Root = () => {
  const handleRotateBack = () => {
    // Logic to rotate back
    console.log('Rotate back clicked');
  };

  // New function for example purposes
  const newFunction = () => {
    // Logic for the new function
    console.log('New function clicked');
  };

  // Get the language attribute for the html element
  const lang = getLangAttribute();

  // Add new validateTableStructure function validation
  const tableStructureError = validateTableStructure();
  if (tableStructureError.errors.length > 0) {
    console.error('Table structure errors:', tableStructureError.errors);
  }

  // Validate table accessibility and check for unique landmarks
  const tableAccessibilityError = validateTableAccessibility();
  if (tableAccessibilityError.errors.length > 0) {
    console.error('Table accessibility errors:', tableAccessibilityError.errors);
  }

  const uniqueLandmarkError = validateLandmark();
  if (uniqueLandmarkError.errors.length > 0) {
    console.error('Landmark errors:', uniqueLandmarkError.errors);
  }

  // Add validateLandmark validation
  const landmarkError = validateLandmark();
  if (!landmarkError.valid) {
    console.error('Landmark validation errors:', landmarkError.errors);
  }

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
            ariaLabel: 'Rotate back to original view'
          }),
          React.createElement(InPageButton, {
            id: 'new-function',
            onClick: newFunction,
            label: 'New Function',
            ariaLabel: 'Execute new function'
          })
        ),
        React.createElement('footer', { role: 'contentinfo' },
          'Footer content'
        )
      )
    )
  );
};

export {
  Root,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  getSvgAccessibleName,
  createInPageButton,
  InPageButton,
  validateTableStructure
};

const rootElement = document.getElementById('root');
ReactDOM.render(React.createElement(Root, null), rootElement);