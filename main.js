const fs = require('fs');
const main = require('./utilities');

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId: ensureElementIdOrigin,
  renderDependencyGraph,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  initSkipLink,
  trapFocus,
  ensureElementHasId,
  newFocusTrap
} = main;

function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  button.setAttribute('type', 'button');
  return button;
}

function function3(insightReport) {
  const results = {
    compliant: [],
    nonCompliant: [],
    warnings: [],
    summary: {
      total: 0,
      compliantCount: 0,
      nonCompliantCount: 0,
      warningCount: 0
    }
  };

  if (!insightReport || !insightReport.issues) {
    return results;
  }

  const issues = insightReport.issues;
  results.summary.total = issues.length;

  issues.forEach(issue => {
    if (issue.severity === 'error') {
      results.nonCompliant.push(issue);
      results.summary.nonCompliantCount++;
    } else if (issue.severity === 'warning') {
      results.warnings.push(issue);
      results.summary.warningCount++;
    } else if (issue.severity === 'info') {
      results.compliant.push(issue);
      results.summary.compliantCount++;
    }
  });

  // Log summary for debugging
  console.log('Accessibility Compliance Report:', results.summary);

  // Perform automated fixes for common issues
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const langAttr = getFullLangAttribute();
    if (langAttr) {
      htmlElement.setAttribute('lang', langAttr);
      console.log('Fixed: Added lang attribute to HTML element');
    }
  }

  // Check and fix table accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  return results;
}

const accessibilityUtils = {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  handleKeyboardNav,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  initSkipLink,
  trapFocus,
  newFocusTrap,
  announceToScreenReader: originalAnnounceToScreenReader,
  ensureElementId: ensureElementIdOrigin,
  ensureElementHasId,
  renderDependencyGraph: main.renderDependencyGraph || (() => {}),
  renderIndex: main.renderIndex || (() => {}),
  addAccessibleName,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  harvest,
  harvestSync
};

const ensureElementIdFn = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
  }

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  validateLandmarkHelpers();
  validateLandmarkStructHelpers();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, { 'aria-label': accessibleName });
    }
  });

  handleFakeLinks();

  return { success: true };
};

function updateFunction() {
  return main.updateFunction();
}

function accessibleFunction() {
  return main.accessibleFunction();
}

function newFunction1() {
  return main.newFunction1();
}

function newFunction2() {
  return main.newFunction2();
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function ensureDependencyGraphARIA() {
  const elements = [];
  elements.forEach(el => {
    el.setAttribute('role', 'graph');
    el.setAttribute('aria-label', 'Dependency graph visualization');
  });
}

function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  const htmlEl =
    container.querySelector('html') ||
    (container.ownerDocument && container.ownerDocument.querySelector('html'));
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : document.body;
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.appendChild(newMain);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Find the primary content container (commonly #content, .content, #main, .main, article, [role="main"])
  const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
  let primaryContent = null;

  validateLandmark(container);
  validateLandmarkStructure(container);
  fixes.landmarksFixed++;

  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', accessibleName);
      fixes.svgNamesAdded++;
    }
  });

  const fakeLinks = container.querySelectorAll('a:not([href]), [role="link"]:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
    }
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    fixes.fakeLinksFixed++;
  });

  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`);
  }

  trapFocus(container);

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element');
  }

  if (fixes.mainLandmarkAdded) {
    console.log('Main landmark added');
  }

  const newAccessibilityIssues = checkAccessibilityForReport(container);
  if (newAccessibilityIssues.length > 0) {
    console.log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`);
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    console.log(`Fixed ${landmarkFixesCount} unique landmarks`);
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    console.log(`Fixed accessible names for ${svgFixes} SVGs`);
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    console.log(`Fixed fake link issues for ${fakeLinkFixes} elements`);
  }

  return fixes;
}

function navigate(destination) {
  if (typeof destination === 'string') {
    window.location.href = destination;
  } else if (destination && typeof destination.click === 'function') {
    destination.click();
  }
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      });
    }
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  ensureElementId: (element) => {
    if (element && !element.id) {
      element.id = `elem-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element;
  },

  addAriaLabel: (element) => {
    // Add ARIA label to improve accessibility
    element.setAttribute('aria-label', 'Accessible element');
  },

  addressAccessibilityIssues: () => {
    // Address accessibility issues based on the harvested data (Imaginary implementation)
    const issues = [
      {
        element: document.querySelector('#issue-1'),
        solution: () => {
          element.setAttribute('aria-label', 'Fixed Issue 1');
        },
      },
      {
        element: document.querySelector('#issue-2'),
        solution: () => {
          element.classList.add('focusable');
        },
      },
    ];

    issues.forEach((issue) => {
      if (issue.element) {
        issue.solution();
      }
    });
  },

  ensureElementIdOrigin: (element) => {
    if (!element) return;
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
    return id;
  },

  renderDependencyGraphs: () => {
    // Render dependency graphs in the UI
  },

  fixButtonIdentifiers: () => {
    // Fix button identifier issues
  },

  fixDependencyGraphAria: () => {
    // Fix ARIA issues in dependency graphs
  },

  addSvgAccessibleName: (svgElement) => {
    // Add accessible name to SVG elements
  }
} = main;

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const ensureElementHasId = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
};

// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap,
  announceToScreenReader,
  ensureElementId,
  addAriaLabel,
  addressAccessibilityIssues,
  ensureElementIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName,
  ensureElementIdOrigin,
  renderAdditionalContent,
  // New feature access
  newFeatureFunction,
};

module.exports = {
    ...main,
    ...accessibilityUtils,
    navigate,
    validateTableStructure,
    validateTableAccessibility,
    implementAccessibilityFixesFromReport,
    checkAccessibilityForReport,
    renderGraphIndex,
    trapFocus,
    addLangAttribute,
    fixTableStructure,
    addAriaLabel,
    addAccessibleName,
    createInPageButton,
    ensureLangAttribute,
    ensureLandmarks,
    ensureUniqueLandmarks,
    fixTableStructures,
    fixFakeLinks,
    initGoogleSignIn,
    fixButtonIds,
    ensureSvgAccessibleNames,
    ensureDependencyGraphAriaRole,
    initAccessibility,
    function3,
    addressAccessibilityIssues,
    updateFunction,
    accessibleFunction,
    newFunction1,
    newFunction2,
    newFunction,
    anotherNewFunction,
    getLangAttribute,
    ensureDependencyGraphARIA,
    isLinkAccessible,
    validateSession,
    handleCredentialResponse,
    generateUniqueId,
    renderDependencyGraph,
    renderDependencyGraph: main.renderDependencyGraph || (() => {}),
    renderIndex: main.renderIndex || (() => {}),
    harvest,
    upgrade,
    ensureElementId: ensureElementIdFn,
    ensureElementHasId: ensureElementHasIdFn,
    newFocusTrap,
    handleCredentialResponse: main.handleCredentialResponse,
    initAccessibility: main.initAccessibility,
    groupByCategory: main.groupByCategory,
    log: main.log,
    sanitizeFilename: main.sanitizeFilename,
    readFileSafe: main.readFileSafe,
    processData: main.processData,
    filterValidItems: main.filterValidItems,
    exportUtilities: main.exportUtilities,
    harvestSync: main.harvestSync
};