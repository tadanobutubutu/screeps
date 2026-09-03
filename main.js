// TODO: This is the modified and merged code
// (This comment remains as-is)

const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

const main = require('./utilities');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport (container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes
  }

  const doc = container.ownerDocument || document;

  // Add lang attribute to HTML element if missing (REACT_015)
  const htmlEl = doc.querySelector('html') || doc.documentElement;
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    addLangAttribute(htmlEl, 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing (REACT_017)
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = addMainLandmark(container);
    if (mainElement) {
      fixes.mainLandmarkAdded = true;
    }
  }

  // Add landmark regions (REACT_017)
  addLandmarkRegions(container);

  // Ensure unique landmarks (REACT_025)
  ensureUniqueLandmarks(container);

  // Fix table structures (REACT_027)
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    fixTableStructure(table);
  });

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      const existingName = svg.getAttribute('aria-label');
      if (!existingName) {
        svg.setAttribute('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    }
  });

  // Fix fake link issues (elements that look like links but are missing href or are not <a>)
  const fakeLinks = container.querySelectorAll('[role="link"]:not(a), button.link, .link:not(a):not(button)');
  fakeLinks.forEach((link) => {
    if (!link.hasAttribute('href') && link.tagName !== 'A') {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
      fixes.fakeLinksFixed++;
    }
  });

  // Validate accessibility report
  const accessibilityReport = report;
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.issues.length} issues`, 'warn');
  }

  // Implement focus trap for keyboard navigation
  const focusTrapHandler = trapFocus(container);
  if (focusTrapHandler) {
    container.addEventListener('keydown', focusTrapHandler);
    // Store handler for potential cleanup
    container._focusTrapHandler = focusTrapHandler;
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibilityForReport(container.innerHTML);
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.length}`, 'error');
  }

  // Count landmark fixes
  const landmarkElements = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  fixes.landmarksFixed = landmarkElements.length;

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  if (fixes.landmarksFixed > 0) {
    log(`Fixed ${fixes.landmarksFixed} unique landmarks`, 'info');
  }

  if (fixes.svgNamesAdded > 0) {
    log(`Fixed accessible names for ${fixes.svgNamesAdded} SVGs`, 'info');
  }

  if (fixes.fakeLinksFixed > 0) {
    log(`Fixed fake link issues for ${fixes.fakeLinksFixed} elements`, 'info');
  }

  return fixes
}

// Helper function to get accessible name for SVG
function getSvgAccessibleName(svg) {
  // Check for existing accessible name sources
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelEl = document.getElementById(ariaLabelledBy);
    if (labelEl) {
      return labelEl.textContent.trim();
    }
  }
  
  // Try to infer from context
  const parentLink = svg.closest('a, button');
  if (parentLink) {
    const text = parentLink.textContent.trim();
    if (text) return text;
  }
  
  return null;
}

// Accessibility-related function to be added
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length === 0) return null;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function(e) {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        if (lastElement) {
          lastElement.focus();
        }
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        if (firstElement) {
          firstElement.focus();
        }
      }
    }
  };
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement;
  if (!htmlElement) {
    return null;
  }
  if (htmlElement.hasAttribute('lang')) {
    return htmlElement;
  }
  htmlElement.setAttribute('lang', lang);
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  const headers = tableElement.querySelectorAll('thead tr > th');
  headers.forEach((th, index) => {
    th.setAttribute('scope', index === 0 ? 'row' : 'column');
  });
  
  const existingCaption = tableElement.querySelector('caption');
  if (!existingCaption) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    tableElement.appendChild(caption);
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    const body = document.body;
    if (body && body.firstChild) {
      body.firstChild.appendChild(mainElement);
    }
  }
  
  return mainElement;
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(container) {
  if (!container) return null;
  
  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
  ];
  
  landmarks.forEach(landmark => {
    let element = container.querySelector(landmark.selector);
    if (!element) {
      element = document.createElement(landmark.selector);
      element.setAttribute('role', landmark.role);
      container.appendChild(element);
    }
    
    if (!element.getAttribute('aria-label') && !element.getAttribute('role')) {
      element.setAttribute('aria-label', landmark.label);
    }
  });
  
  return container;
}

/**
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  });
  
  return container;
}

/**
 * REACT_025: Unique landmarks helper
 */
export function uniqueLandmarksHelper(container) {
  if (!container) return;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  });
}