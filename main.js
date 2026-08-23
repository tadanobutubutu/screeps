const dashboardComponents = require('./dashboard/components/Dashboard');

// Accessibility utilities for React applications
const accessibilityHelpers = {
  // Set document language attribute (REACT_015)
  setDocumentLanguage: (lang = 'en') => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  },
  
  // Validate table structure accessibility (REACT_027)
  validateTableStructure: (tableElement) => {
    if (!tableElement) return true;
    const hasCaption = tableElement.querySelector('caption');
    return !!hasCaption;
  },
  
  // Ensure SVG has accessible name (REACT_041)
  ensureSvgAccessibleName: (svgElement) => {
    if (!svgElement) return true;
    const hasAriaLabel = svgElement.hasAttribute('aria-label') || 
                         svgElement.hasAttribute('aria-labelledby') ||
                         svgElement.querySelector('title');
    return !!hasAriaLabel;
  },
  
  // Initialize accessibility features on app load
  initAccessibility: () => {
    // Set default language
    this.setDocumentLanguage();
    
    // Add global styles for better accessibility
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        /* Focus indicators for keyboard navigation */
        :focus-visible {
          outline: 2px solid #005fcc;
          outline-offset: 2px;
        }
        
        /* Hide content visually but keep for screen readers */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

// Preserving existing main.js structure and content
module.exports = {
  ...dashboardComponents,
  accessibilityHelpers
};