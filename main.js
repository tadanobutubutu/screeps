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

// Simple logging utility for Node.js environment
function log(message, level = 'info') {
  const prefix = level === 'error' ? '[ERROR]' : level === 'warn' ? '[WARN]' : '[INFO]';
  console.log(`${prefix} ${message}`);
}

// Helper to get owner document safely
function getOwnerDocument(element) {
  return element?.ownerDocument || (typeof document !== 'undefined' ? document : null);
}

// Helper to create elements safely
function createElement(tagName, doc) {
  const d = doc || getOwnerDocument(document.body) || (typeof document !== 'undefined' ? document : { createElement: () => ({}) });
  return d.createElement ? d.createElement(tagName) : { setAttribute: () => {}, appendChild: () => {} };
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!container) {
    log('No container provided for accessibility fixes', 'warn');
    return fixes;
  }

  if (!report || !report.issues) {
    return fixes;
  }

  const doc = getOwnerDocument(container);

  // Add lang attribute to HTML element if missing
  const htmlEl = doc?.querySelector?.('[lang]') || (doc?.documentElement || null);
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  let mainElement = container.querySelector?.('main') || null;
  if (!mainElement) {
    const body = container.querySelector?.('body') || (doc?.body || null);
    if (body) {
      mainElement = createElement('main', doc);
      mainElement.setAttribute('id', 'main-content');
      if (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.insertBefore(mainElement, body.firstChild);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Render dependency graphs if function exists
  if (typeof renderDependencyGraphs === 'function') {
    renderDependencyGraphs(container);
  }

  // Fix button identifiers if function exists
  if (typeof fixButtonIdentifiers === 'function') {
    fixButtonIdentifiers(container);
  }

  // Add main landmark using exported function
  if (typeof addMainLandmark === 'function') {
    addMainLandmark(container);
  }

  // Validate landmarks
  if (typeof validateLandmark === 'function') {
    validateLandmark(container);
  } else if (typeof ensureUniqueLandmarks === 'function') {
    ensureUniqueLandmarks(container);
    fixes.landmarksFixed = 1;
  }

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll?.('svg') || [];
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName?.(svg) || svg.getAttribute?.('aria-label') || svg.getAttribute?.('title') || '';
    if (accessibleName) {
      const existingName = svg.getAttribute?.('aria-label');
      if (!existingName) {
        svg.setAttribute?.('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll?.('[role="link"]:not(a), [href]:not(a)') || [];
  fakeLinks.forEach((link) => {
    if (!link.getAttribute?.('role')) {
      link.setAttribute?.('role', 'link');
    }
    if (!link.getAttribute?.('tabindex') && link.getAttribute?.('tabindex') !== '0') {
      link.setAttribute?.('tabindex', '0');
    }
    link.setAttribute?.('data-interactive', 'true');
    fixes.fakeLinksFixed++;
  });

  // Validate accessibility report
  const accessibilityReport = report;
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.issues.length} issues`, 'warn');
  }

  // Implement focus trap for keyboard navigation
  if (typeof trapFocus === 'function') {
    const cleanup = trapFocus(container);
    if (cleanup && typeof cleanup === 'function') {
      // Store cleanup for later use if needed
      container._focusTrapCleanup = cleanup;
    }
  }

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibilityForReport?.(container) || [];
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.length}`, 'error');
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
}

// Accessibility-related function to be added
function checkAccessibilityForReport(content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content;
}

// Helper to get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute?.('aria-label') || 
         svg.getAttribute?.('title') || 
         svg.querySelector?.('title')?.textContent || 
         svg.getAttribute?.('data-label') || 
         '';
}

// Helper to validate landmarks
function validateLandmark(container) {
  if (!container) return;
  if (typeof ensureUniqueLandmarks === 'function') {
    ensureUniqueLandmarks(container);
  }
  if (typeof addLandmarkRegions === 'function') {
    addLandmarkRegions(container);
  }
}

// Helper to fix button identifiers
function fixButtonIdentifiers(container) {
  if (!container) return;
  const buttons = container.querySelectorAll?.('button:not([aria-label]):not([aria-labelledby])') || [];
  buttons.forEach((btn, index) => {
    const text = btn.textContent?.trim();
    if (text) {
      btn.setAttribute('aria-label', text);
    } else if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
}

// Helper to render dependency graphs
function renderDependencyGraphs(container) {
  if (!container) return;
  // Placeholder for graph rendering logic
  // This would integrate with dependencyGraphContent
  if (typeof dependencyGraphContent === 'object' && dependencyGraphContent) {
    // Graph rendering logic would go here
  }
}

// Helper to manage focus within a container
function trapFocus(container) {
  if (!container) return;
  
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll?.(focusableSelectors) || [];
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTab(e) {
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
  }

  container.addEventListener('keydown', handleTab);
  
  // Return cleanup function
  return () => container.removeEventListener('keydown', handleTab);
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
function addLangAttribute(element, lang = 'en') {
  const doc = getOwnerDocument(element);
  let htmlElement = element || doc?.documentElement;
  if (!htmlElement) {
    return null;
  }
  if (htmlElement.hasAttribute?.('lang')) {
    return htmlElement;
  }
  htmlElement.setAttribute?.('lang', lang);
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  const headers = tableElement.querySelectorAll?.('thead tr > th') || [];
  headers.forEach((th, index) => {
    th.setAttribute?.('scope', index === 0 ? 'row' : 'column');
  });
  
  const existingCaption = tableElement.querySelector?.('caption');
  if (!existingCaption) {
    const doc = getOwnerDocument(tableElement);
    const caption = createElement('caption', doc);
    caption.textContent = 'Data table';
    tableElement.appendChild?.(caption);
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector?.('main');
  if (!mainElement) {
    const doc = getOwnerDocument(container);
    mainElement = createElement('main', doc);
    mainElement.setAttribute?.('id', 'main-content');
    const body = doc?.body || container.querySelector?.('body');
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else if (container.appendChild) {
      container.appendChild(mainElement);
    }
  }
  
  return mainElement;
}

/**
 * REACT_017: Add landmark regions
 */
function addLandmarkRegions(container) {
  if (!container) return null;
  
  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
  ];
  
  landmarks.forEach(landmark => {
    let element = container.querySelector?.(landmark.selector);
    if (!element) {
      const doc = getOwnerDocument(container);
      element = createElement(landmark.selector, doc);
      element.setAttribute?.('role', landmark.role);
      container.appendChild?.(element);
    }
    
    if (!element.getAttribute?.('aria-label') && !element.getAttribute?.('role')) {
      element.setAttribute?.('aria-label', landmark.label);
    }
  });
  
  return container;
}

/**
 * REACT_025: Ensure unique landmarks
 */
function ensureUniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll?.(`[role="${role}"]`) || [];
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute?.('aria-label')) {
        const count = index + 1;
        el.setAttribute?.('aria-label', `${role} ${count}`);
      }
    });
  });
  
  return container;
}

/**
 * REACT_025: Unique landmarks helper
 */
function uniqueLandmarksHelper(container) {
  if (!container) return;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll?.(`[role="${role}"]`) || [];
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute?.('aria-label')) {
        const count = index + 1;
        el.setAttribute?.('aria-label', `${role} ${count}`);
      }
    });
  });
}

// Export all functions for CommonJS compatibility
module.exports = {
  greetingFunction,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  getSvgAccessibleName,
  validateLandmark,
  fixButtonIdentifiers,
  renderDependencyGraphs,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarksHelper,
  log
};