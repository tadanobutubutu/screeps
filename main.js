import React from 'react';
import ReactDOM from 'react-dom';

// Other imports...

// Function to get language attribute from the document
const getLangAttribute = () => {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    return htmlElement.getAttribute('lang');
  }
  return null;
};

// Function to get SVG accessible name
const getSvgAccessibleName = (svgElement) => {
  if (!svgElement || typeof document === 'undefined') {
    return null;
  }
  
  // Check for aria-labelledby attribute
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for title element inside the SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }
  
  // Check for desc element inside the SVG
  const descElement = svgElement.querySelector('desc');
  if (descElement && descElement.textContent) {
    return descElement.textContent;
  }
  
  return null;
};

// Function to validate landmark structure
const validateLandmarkStructure = () => {
  const results = {
    valid: true,
    errors: []
  };

  if (typeof document !== 'undefined') {
    // Check for main landmark (should have exactly one)
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing main landmark - page should have exactly one main element');
    } else if (mainElements.length > 1) {
      results.valid = false;
      results.errors.push(`Multiple main landmarks found - should have exactly one (found ${mainElements.length})`);
    }

    // Check for header landmark
    const headerElements = document.querySelectorAll('header');
    if (headerElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing header landmark - page should have at least one header element');
    }

    // Check for footer landmark
    const footerElements = document.querySelectorAll('footer');
    if (footerElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing footer landmark - page should have at least one footer element');
    }

    // Check for nav landmark
    const navElements = document.querySelectorAll('nav');
    if (navElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing nav landmark - page should have at least one nav element');
    }

    // Check for aside (complementary landmark)
    const asideElements = document.querySelectorAll('aside');
    if (asideElements.length > 1) {
      results.valid = false;
      results.errors.push('Multiple aside landmarks found - should have at most one');
    }

    // Check for form landmarks with labels
    const formElements = document.querySelectorAll('form');
    formElements.forEach((form, index) => {
      const hasLabel = form.querySelector('label') !== null;
      const hasAriaLabel = form.hasAttribute('aria-label') || form.hasAttribute('aria-labelledby');
      if (!hasLabel && !hasAriaLabel) {
        results.valid = false;
        results.errors.push(`Form ${index + 1}: Missing label or aria-label`);
      }
    });

    // Check for search landmark
    const searchElements = document.querySelectorAll('[role="search"]');
    if (searchElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing search landmark - consider adding a search form');
    }
  }

  return results;
};

// Function to validate landmark regions
const validateLandmark = () => {
  const results = {
    valid: true,
    errors: []
  };

  if (typeof document !== 'undefined') {
    // Check for main landmark (should have exactly one)
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing main landmark - page should have exactly one main element');
    } else if (mainElements.length > 1) {
      results.valid = false;
      results.errors.push(`Multiple main landmarks found - should have exactly one (found ${mainElements.length})`);
    }

    // Check for header landmark
    const headerElements = document.querySelectorAll('header');
    if (headerElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing header landmark - page should have at least one header element');
    }

    // Check for footer landmark
    const footerElements = document.querySelectorAll('footer');
    if (footerElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing footer landmark - page should have at least one footer element');
    }
  }

  return results;
};

// Function to validate table structure
const validateTableStructure = () => {
  const results = {
    valid: true,
    errors: []
  };

  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');

    tables.forEach((table, index) => {
      const ths = table.querySelectorAll('thead th');
      const tds = table.querySelectorAll('tbody td');

      // Check if number of ths and tds match
      if (ths.length !== tds.length) {
        results.valid = false;
        results.errors.push(`Table ${index + 1}: Number of th and td elements do not match`);
      }
    });
  }

  return results;
};

// Function to validate table accessibility
const validateTableAccessibility = () => {
  // ... Keep existing code here (except the part related to validateTableStructure)
};

// Function to create an in-page button
const createInPageButton = (options = {}) => {
  const {
    id,
    label,
    onClick,
    className = '',
    ariaLabel,
    type = 'button',
    disabled = false,
    title
  } = options;

  if (typeof document !== 'undefined') {
    const button = document.createElement('button');
    
    if (id) {
      button.id = id;
    }
    
    button.textContent = label || '';
    button.type = type;
    
    if (className) {
      button.className = className;
    }
    
    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    }
    
    if (disabled) {
      button.disabled = true;
    }
    
    if (title) {
      button.title = title;
    }
    
    if (onClick && typeof onClick === 'function') {
      button.addEventListener('click', onClick);
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
  disabled = false,
  title
}) => {
  return (
    <button
      id={id}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
    >
      {label}
    </button>
  );
};

const Root = () => {
  // Other component code...
  
  const handleRotateBack = () => {
    // Logic to rotate back
  };

  // New function for example purposes
  const newFunction = () => {
    // Logic for the new function
  };

  // Add new validateTableStructure function validation
  const tableStructureError = validateTableStructure();
  if (tableStructureError.errors.length > 0) {
    console.error(tableStructureError.errors);
  }

  // Add validateLandmark validation
  const landmarkError = validateLandmark();
  if (!landmarkError.valid) {
    console.error(landmarkError.errors);
  }

  return (
    <html lang="en">
      {/* Other JSX elements... */}
      <main>
        <button id="unrotate" aria-label="Rotate back button" type="button">
          rotate back
        </button>
        {/* Example usage of new function */}
        <button onClick={newFunction} type="button">
          New Function
        </button>
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
  InPageButton
};

ReactDOM.render(<Root />, document.getElementById('root'));