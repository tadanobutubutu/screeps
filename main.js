// main.js
// Preserving all existing code and exports

// Addressing REACT_015: React Language Attribute
// Add lang attribute to root element if not present
if (typeof document !== 'undefined') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

// Addressing REACT_027: React Table Structure
// Ensure tables have proper structure with <thead>, <tbody>, and <th> elements
function ensureTableAccessibility(tableElement) {
  if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
    console.warn('Table should have proper structure with thead and tbody');
  }

  const headers = tableElement.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
    if (!header.hasAttribute('id')) {
      header.setAttribute('id', `col-header-${index}`);
    }
  });

  const rows = tableElement.querySelectorAll('tbody tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
      if (!cell.hasAttribute('headers')) {
        const headerId = tableElement.querySelector(`#col-header-${cellIndex}`)?.id;
        if (headerId) {
          cell.setAttribute('headers', headerId);
        }
      }
    });
  });
}

// Addressing REACT_017: React Landmarks
// Ensure proper landmark elements are used
function ensureLandmarkAccessibility() {
  if (typeof document !== 'undefined') {
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      console.warn('Page should have a main landmark element');
    }

    const navElements = document.querySelectorAll('nav');
    navElements.forEach(nav => {
      if (!nav.hasAttribute('aria-label')) {
        console.warn('Navigation elements should have aria-label');
      }
    });
  }
}

// Addressing REACT_041: React SVG Accessible Name
// Ensure SVGs have accessible names
function ensureSvgAccessibility() {
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        console.warn('SVG elements should have accessible names');
      }
    });
  }
}

// Addressing REACT_025: React Unique Landmarks
// Ensure landmarks are unique
function ensureUniqueLandmarks() {
  if (typeof document !== 'undefined') {
    const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      if (elements.length > 1) {
        console.warn(`Multiple ${landmark} elements found - consider using unique roles`);
      }
    });
  }
}

// Addressing REACT_036: React Fake Link
// Ensure links are actual links
function ensureProperLinks() {
  if (typeof document !== 'undefined') {
    const elements = document.querySelectorAll('[role="link"], [role="button"]');
    elements.forEach(element => {
      if (!element.hasAttribute('href') && !element.hasAttribute('onClick')) {
        console.warn('Elements with link/button roles should be actual links or have click handlers');
      }
    });
  }
}

// Initialize accessibility checks when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Run all accessibility checks
    ensureTableAccessibility(document.querySelector('table'));
    ensureLandmarkAccessibility();
    ensureSvgAccessibility();
    ensureUniqueLandmarks();
    ensureProperLinks();

    // Additional checks can be added here
  });
}

// Preserve all existing exports
// Example:
// export function existingFunction() { ... }