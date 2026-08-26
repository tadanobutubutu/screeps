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

// Function to set language attribute on the document
const setLangAttribute = (lang) => {
  if (typeof document !== 'undefined' && lang) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
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
      const hasAriaLabel = form.getAttribute('aria-label') || form.getAttribute('aria-labelledby');
      if (!hasLabel && !hasAriaLabel) {
        results.valid = false;
        results.errors.push(`Form ${index + 1}: Missing label or aria-label`);
      }
    });

    // Check for search landmark
    const searchElements = document.querySelectorAll('[role="search"], search');
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

    // Check for nav landmark
    const navElements = document.querySelectorAll('nav');
    if (navElements.length === 0) {
      results.valid = false;
      results.errors.push('Missing nav landmark - page should have at least one nav element');
    }

    // Check for lang attribute on html element
    const htmlElement = document.documentElement;
    const langAttribute = htmlElement.getAttribute('lang');
    if (!langAttribute) {
      results.valid = false;
      results.errors.push('Missing lang attribute on html element - should have lang attribute for accessibility');
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
  const results = {
    valid: true,
    errors: []
  };

  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');

    tables.forEach((table, index) => {
      // Check for caption
      const caption = table.querySelector('caption');
      if (!caption) {
        results.valid = false;
        results.errors.push(`Table ${index + 1}: Missing caption element for accessibility`);
      }

      // Check for thead
      const thead = table.querySelector('thead');
      if (!thead) {
        results.valid = false;
        results.errors.push(`Table ${index + 1}: Missing thead element - tables should have header rows`);
      }

      // Check that th elements have scope attribute
      const ths = table.querySelectorAll('th');
      ths.forEach((th, thIndex) => {
        const scope = th.getAttribute('scope');
        if (!scope) {
          results.valid = false;
          results.errors.push(`Table ${index + 1}: TH element ${thIndex + 1} missing scope attribute`);
        }
      });
    });
  }

  return results;
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
  if (tableStructureError.errors && tableStructureError.errors.length > 0) {
    console.error(tableStructureError.errors);
  }

  // Add validateLandmark validation
  const landmarkError = validateLandmark();
  if (!landmarkError.valid) {
    console.error(landmarkError.errors);
  }

  // Validate table accessibility
  const tableAccessibilityError = validateTableAccessibility();
  if (!tableAccessibilityError.valid) {
    console.error(tableAccessibilityError.errors);
  }

  return (
    <html lang="en">
      {/* Other JSX elements... */}
      <header role="banner">
        {/* Header content */}
      </header>
      <nav role="navigation" aria-label="Main navigation">
        {/* Navigation content */}
      </nav>
      <main role="main">
        <button id="unrotate" aria-label="Rotate back button" type="button">
          rotate back
        </button>
        {/* Example usage of new function */}
        <button onClick={newFunction} type="button">
          New Function
        </button>
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </html>
  );
};

export { 
  Root, 
  handleRotateBack, 
  newFunction, 
  getLangAttribute, 
  setLangAttribute,
  validateLandmark, 
  validateLandmarkStructure, 
  validateTableAccessibility, 
  validateTableStructure,
  getSvgAccessibleName,
  createInPageButton,
  InPageButton
};

ReactDOM.render(<Root />, document.getElementById('root'));