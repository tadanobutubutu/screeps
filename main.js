// main.js - Accessibility fixes for GitHub issue

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  // Return the language attribute from the document
  const lang = document.documentElement.lang || 
               document.querySelector('meta[http-equiv="content-language"]')?.getAttribute('content') ||
               'en';
  return lang;
}

// REACT_017: Add/fix landmark issues
function validateLandmark() {
  const landmarks = {
    header: document.querySelector('header:not([role="banner"])'),
    main: document.querySelector('main:not([role="main"])'),
    footer: document.querySelector('footer:not([role="contentinfo"])')
  };
  
  // Fix missing landmark roles
  if (landmarks.header && !landmarks.header.hasAttribute('role')) {
    landmarks.header.setAttribute('role', 'banner');
  }
  if (landmarks.main && !landmarks.main.hasAttribute('role')) {
    landmarks.main.setAttribute('role', 'main');
  }
  if (landmarks.footer && !landmarks.footer.hasAttribute('role')) {
    landmarks.footer.setAttribute('role', 'contentinfo');
  }
  
  return landmarks;
}

function validateLandmarkStructure() {
  const issues = [];
  const headers = document.querySelectorAll('header');
  const mains = document.querySelectorAll('main');
  
  // REACT_025: Ensure unique landmarks
  if (headers.length > 1) {
    issues.push({ type: 'REACT_025', message: 'Multiple header landmarks found. Only one banner landmark should exist.' });
    headers.forEach((header, index) => {
      if (index > 0) {
        header.removeAttribute('role');
        header.setAttribute('role', 'complementary');
      }
    });
  }
  
  if (mains.length > 1) {
    issues.push({ type: 'REACT_025', message: 'Multiple main landmarks found. Only one main landmark should exist.' });
    mains.forEach((main, index) => {
      if (index > 0) {
        main.removeAttribute('role');
        main.setAttribute('role', 'article');
      }
    });
  }
  
  return issues;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const headers = table.querySelectorAll('th');
    const hasCaption = table.querySelector('caption') !== null;
    
    if (headers.length === 0) {
      issues.push({ 
        type: 'REACT_027', 
        tableIndex: index,
        message: `Table ${index + 1} lacks proper table headers. Add <th> elements or ensure proper header associations.` 
      });
    }
    
    if (!hasCaption) {
      issues.push({ 
        type: 'REACT_027', 
        tableIndex: index,
        message: `Table ${index + 1} missing caption for accessibility.` 
      });
    }
  });
  
  return issues;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    const hasProperHeaders = table.querySelector('th[scope]') !== null || 
                              table.querySelector('th[headers]') !== null;
    
    if (!hasProperHeaders && rows.length > 0) {
      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('th, td');
      
      cells.forEach((cell, cellIndex) => {
        if (cell.tagName === 'TD') {
          // Convert to th if it's semantically a header
          const newTh = document.createElement('th');
          newTh.innerHTML = cell.innerHTML;
          newTh.setAttribute('scope', 'col');
          cell.parentNode.replaceChild(newTh, cell);
        }
      });
      
      issues.push({ type: 'REACT_027', tableIndex: index, fixed: true });
    }
  });
  
  return issues;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  // Check for aria-labelledby first
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }
  
  // Generate a name based on parent context
  const parent = svg.parentElement;
  if (parent) {
    const existingLabel = parent.getAttribute('aria-label') || 
                          parent.getAttribute('alt') ||
                          parent.textContent?.trim();
    if (existingLabel) {
      return existingLabel;
    }
  }
  
  return 'Decorative image';
}

function setSvgAttributes() {
  const svgs = document.querySelectorAll('svg');
  const issues = [];
  
  svgs.forEach((svg, index) => {
    const hasAriaLabel = svg.hasAttribute('aria-label') || 
                         svg.hasAttribute('aria-labelledby') ||
                         svg.querySelector('title');
    
    if (!hasAriaLabel) {
      const accessibleName = getSvgAccessibleName(svg);
      
      // Add title as fallback
      if (!svg.querySelector('title')) {
        const title = document.createElement('title');
        title.textContent = accessibleName;
        title.setAttribute('id', `svg-title-${index}`);
        svg.insertBefore(title, svg.firstChild);
      }
      
      svg.setAttribute('aria-label', accessibleName);
      issues.push({ type: 'REACT_041', svgIndex: index, fixed: true });
    }
  });
  
  return issues;
}

// REACT_036: Fix fake link issues
function validateLinkAccessibility() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a), [href]:not(a)');
  const issues = [];
  
  fakeLinks.forEach((element) => {
    if (element.tagName !== 'A') {
      const hasAccessibleName = element.getAttribute('aria-label') || 
                                  element.getAttribute('aria-labelledby') ||
                                  element.textContent?.trim();
      
      if (!hasAccessibleName) {
        issues.push({ 
          type: 'REACT_036', 
          element: element.tagName,
          message: 'Fake link missing accessible name.' 
        });
      }
    }
  });
  
  return issues;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  
  fakeLinks.forEach((link) => {
    // Convert to proper button if it's not an anchor
    if (!link.hasAttribute('href')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      
      // Add keyboard support
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
}

// Helper function for creating accessible in-page buttons
function createInPageButton(button, options = {}) {
  const lang = getLangAttribute();
  
  // Add language attribute if not present
  if (!document.documentElement.lang) {
    document.documentElement.lang = lang;
  }
  
  // Ensure button has accessible name
  if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
    if (options.label) {
      button.setAttribute('aria-label', options.label);
    }
  }
  
  // Ensure proper semantic
  if (button.getAttribute('role') === 'link') {
    button.setAttribute('role', 'button');
  }
  
  // Add tabindex if not focusable
  if (!button.hasAttribute('tabindex') && button.tagName !== 'BUTTON') {
    button.setAttribute('tabindex', '0');
  }
  
  return button;
}

// Initialize accessibility fixes
function initAccessibility() {
  const issues = [];
  
  // Validate landmarks
  const landmarkIssues = validateLandmark();
  const landmarkStructureIssues = validateLandmarkStructure();
  issues.push(...landmarkStructureIssues);
  
  // Validate tables
  const tableIssues = validateTableAccessibility();
  const tableStructureIssues = validateTableStructure();
  issues.push(...tableIssues, ...tableStructureIssues);
  
  // Set SVG attributes
  const svgIssues = setSvgAttributes();
  issues.push(...svgIssues);
  
  // Validate links
  const linkIssues = validateLinkAccessibility();
  handleFakeLinks();
  issues.push(...linkIssues);
  
  // Ensure HTML lang attribute
  const lang = getLangAttribute();
  if (!document.documentElement.lang) {
    document.documentElement.lang = lang;
  }
  
  return issues;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    validateLandmark,
    validateLandmarkStructure,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    createInPageButton,
    initAccessibility
  };
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAccessibility());
  } else {
    initAccessibility();
  }
}