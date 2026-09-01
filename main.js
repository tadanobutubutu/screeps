// TODO: This is the existing code that needs to be preserved
// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

const checkTableStructure = /* existing code */

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

// Implement function for addressing accessibility issues from insight report
// TODO: Implement a function to count dependencies
function countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

/**
 * Handle credential response from browser authentication
 * @param {Object} response - The credential response object
 * @returns {Object} Processed credential information
 */
async function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    if (typeof response.ok !== 'undefined') {
        try {
            if (response.ok) {
                console.log('Handling credential response:', response);
                const json = await response.json();
                if (json && typeof json === 'object' && 'credentials' in json) {
                    const credentials = json.credentials;
                    if (Array.isArray(credentials)) {
                        Object.entries(credentials).forEach(([key, value]) => {
                            if (value) {
                                document.cookie = `${key}=${value}; path=/`;
                            }
                        });
                    }
                }
                return { success: true, data: json };
            } else {
                console.warn('Credential response is not OK:', response.status);
                return { success: false, error: 'Response not OK', status: response.status };
            }
        } catch (error) {
            console.error('Error handling credential response:', error);
            return { success: false, error: error.message };
        }
    }

    const hasCredential = response.credential || response.token || response.id;
    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    if (response.credential) {
        try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

function init() {
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function setupKeyboardNavigation() {
  /* existing code */
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function trapFocus(event) {
  const modal = event.currentTarget || event.target.closest('[role="dialog"]');
  if (!modal) return;
  const focusable = Array.from(modal.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function enhanceSemanticMarkup() {
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  /* existing code */
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  /* existing code */
}

function calculateProduct(a, b) {
  /* existing code */
}

function isNumber(value) {
  /* existing code */
}

function clamp(value, min, max) {
  /* existing code */
}

function createInPageButton(buttonId, buttonText) {
  /* existing code */
}

function validateLinkAccessibility(options) {
  /* existing code */
}

function handleFakeLinks(issues) {
  /* existing code */
}

function handleKeyNavigation(event) {
  /* existing code */
}

function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return {};
}

function calculateAccessibilityScore(report) {
  return report ? 100 : 0;
}

function ensureUniqueLandmarksFromString(str) {
  return str || '';
}

function spawnSomeCommand(cmd) {
  console.log('Spawn:', cmd);
}

const hello = () => {
  return 'Hello from main.js';
};

const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    if (!insightReport) return;
    // Existing accessibility issue handling preserved
    if (insightReport.sections) {
      insightReport.sections.forEach(section => {
        if (!section.heading) {
          console.warn('Missing heading in report section');
        }
      });
    }
  }
};

function myFunction() {
  // Existing implementation
  return 'myFunction';
}

function getLangAttribute() {
  return 'en';
}

function personName() {
  return 'Unknown';
}

function validateTableAccessibility(element) {
  if (!element) return false;
  if (element.getAttribute('role') !== 'table') {
    const table = element.querySelector('table');
    if (table) return true;
  }
  return true;
}

function validateTableStructure(element) {
  if (!element) return false;
  const rows = element.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark(element) {
  if (!element) return false;
  return element.tagName === 'SVG';
}

function validateLandmarkStructure(element) {
  if (!element) return false;
  return !!(element.id || element.getAttribute('aria-label'));
}

function ensureUniqueLandmarksArray(landmarks) {
  if (!Array.isArray(landmarks)) return [];
  const seen = new Set();
  const result = [];
  for (const lm of landmarks) {
    const id = lm.id || 'unknown';
    if (seen.has(id)) {
      lm.id = `${id}-${Date.now()}`;
    }
    seen.add(lm.id || 'unknown');
    result.push(lm);
  }
  return result;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const title = svgElement.getAttribute('title');
  if (title) return title;
  return svgElement.tagName.toLowerCase();
}

function addAccessibleNamesToSvg(svgElement, names) {
  const targetNames = Array.isArray(names) ? names : [names];
  for (let i = 0; i < svgElement.children.length; i++) {
    const child = svgElement.children[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.getAttribute('role') === 'img' || child.type === 'image') {
        if (!child.getAttribute('aria-label') && targetNames.length > 0) {
          addAriaLabel(child, targetNames[0]);
        }
      }
    }
  }
}

function ensureElementHasId(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  if (!element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  element.setAttribute('aria-label', label);
  return element;
}

function renderDependencyGraph(data, container) {
  if (!data) {
    throw new Error('Dependency data is required');
  }
  if (!container) {
    throw new Error('Container element is required');
  }
  return container;
}

function generateAccessibilityReport(issues) {
  if (!Array.isArray(issues)) {
    throw new Error('Issues must be an array');
  }

  const report = {
    totalIssues: issues.length,
    severityCounts: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    },
    issuesByType: {},
    issues: []
  };

  issues.forEach(issue => {
    if (!issue || typeof issue !== 'object') {
      return;
    }

    const severity = issue.severity || 'minor';
    if (report.severityCounts[severity] !== undefined) {
      report.severityCounts[severity]++;
    } else {
      report.severityCounts.minor++;
    }

    const type = issue.type || 'other';
    if (!report.issuesByType[type]) {
      report.issuesByType[type] = 0;
    }
    report.issuesByType[type]++;

    report.issues.push({
      type: type,
      severity: severity,
      message: issue.message || '',
      element: issue.element || null
    });
  });

  report.summary = `Found ${report.totalIssues} accessibility issue(s): ` +
    `${report.severityCounts.critical} critical, ` +
    `${report.severityCounts.serious} serious, ` +
    `${report.severityCounts.moderate} moderate, ` +
    `${report.severityCounts.minor} minor.`;

  return report;
}

function fixTableStructureIssues(doc = document) {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead') && table.querySelector('tr')) {
      const firstRow = table.querySelector('tr');
      const ths = firstRow.querySelectorAll('th');
      if (ths.length > 0) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }

    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      const thead = table.querySelector('thead');
      if (thead) {
        table.insertBefore(tbody, thead.nextSibling);
      } else {
        table.insertBefore(tbody, table.firstChild);
      }
    }

    const caption = table.querySelector('caption');
    if (!caption) {
      const newCaption = document.createElement('caption');
      newCaption.textContent = 'Data table';
      newCaption.style.clip = 'rect(0 0 0 0)';
      newCaption.style.clipPath = 'inset(50%)';
      newCaption.style.height = '1px';
      newCaption.style.overflow = 'hidden';
      newCaption.style.whiteSpace = 'nowrap';
      newCaption.style.width = '1px';
      table.insertBefore(newCaption, table.firstChild);
    }

    const hasHeaderCells = table.querySelectorAll('th').length > 0;
    if (!hasHeaderCells) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.children.length > 0 && !firstRow.querySelector('th')) {
        const cells = firstRow.children;
        for (let i = 0; i < cells.length; i++) {
          const newTh = document.createElement('th');
          newTh.textContent = cells[i].textContent;
          newTh.setAttribute('scope', 'col');
          cells[i].replaceWith(newTh);
        }
        if (!table.querySelector('thead')) {
          const thead = document.createElement('thead');
          firstRow.parentNode.insertBefore(thead, firstRow);
          thead.appendChild(firstRow);
        }
      }
    }

    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentElement;
        if (parent && parent.tagName === 'TR') {
          const grandparent = parent.parentElement;
          if (grandparent && grandparent.tagName === 'THEAD') {
            th.setAttribute('scope', 'col');
          } else {
            th.setAttribute('scope', 'row');
          }
        }
      }
    });

    if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
      console.warn('Table missing accessible name (caption or aria-label).', table);
    }
  });
  return tables.length;
}

function fixTableStructure() {
  return fixTableStructureIssues();
}

function addMainLandmark(doc = document) {
  const mainElements = doc.querySelectorAll('main');
  if (mainElements.length === 0) {
    const body = doc.body;
    const main = doc.createElement('main');
    main.setAttribute('role', 'main');
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  } else if (mainElements.length === 1) {
    const main = mainElements[0];
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  }
  return doc.querySelectorAll('main').length;
}

function addSvgAccessibleNames(doc = document) {
  const svgs = doc.querySelectorAll('svg');
  let count = 0;
  svgs.forEach((svg, index) => {
    const existingLabel = svg.getAttribute('aria-label') ||
                          svg.querySelector('title') ||
                          svg.getAttribute('aria-labelledby');
    if (!existingLabel) {
      const title = doc.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `Icon ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      const titleId = `svg-title-${index + 1}`;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
      count++;
    }
  });
  return count;
}

function ensureUniqueLandmarks(doc = document) {
  const mains = doc.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      const main = mains[i];
      if (main.tagName === 'MAIN') {
        main.setAttribute('role', 'presentation');
      } else {
        main.removeAttribute('role');
        main.setAttribute('role', 'region');
      }
    }
  }
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="contentinfo"]');
  const seenIds = new Set();
  landmarks.forEach(landmark => {
    const id = landmark.id;
    if (id) {
      if (seenIds.has(id)) {
        landmark.id = `${id}-unique-${Math.random().toString(36).substr(2, 9)}`;
      }
      seenIds.add(landmark.id);
    }
  });
  return mains.length;
}

function fixFakeLinkIssue(doc = document) {
  const clickableElements = doc.querySelectorAll('[role="link"]:not(a), [onclick]');
  let count = 0;
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.hasAttribute('href');
    if (tagName !== 'a' && !hasHref) {
      const isInteractive = element.getAttribute('role') === 'link' ||
                            (element.hasAttribute('onclick') && element.onclick.toString().includes('window.location'));
      if (isInteractive && !element.hasAttribute('aria-label')) {
        const text = element.textContent.trim();
        if (text) {
          element.setAttribute('aria-label', text);
        }
      }
      count++;
    }
  });
  return count;
}

function checkLinkAndButtonAccessibility(doc = document) {
  const links = doc.querySelectorAll('a, button, [role="button"]');
  const issues = {
    linksWithoutText: [],
    buttonsWithoutText: [],
    linksWithoutAriaLabel: [],
    buttonsWithoutAriaLabel: []
  };

  links.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isLink = tagName === 'a';
    const isButton = tagName === 'button' || element.getAttribute('role') === 'button';

    if (isLink || isButton) {
      const hasTextContent = element.textContent.trim().length > 0;
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasTitle = element.hasAttribute('title');

      const accessibleName = hasTextContent || hasAriaLabel || hasTitle;

      if (!accessibleName) {
        if (isLink) {
          issues.linksWithoutText.push(element);
        } else {
          issues.buttonsWithoutText.push(element);
        }
      }

      if (!hasAriaLabel && !(hasTextContent || hasTitle)) {
        if (isLink) {
          issues.linksWithoutAriaLabel.push(element);
        } else {
          issues.buttonsWithoutAriaLabel.push(element);
        }
      }
    }
  });

  return issues;
}

function newFocusTrap(container) {
  if (!container) {
    return {
      activate: () => {},
      deactivate: () => {},
      toggle: () => {}
    };
  }

  let isActive = false;
  let previouslyFocusedElement = null;

  function getFocusableElements(element) {
    const selectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([contenteditable="false"])'
    ].join(', ');
    return Array.from(element.querySelectorAll(selectors))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
  }

  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    } else if (event.key === 'Escape') {
      deactivate();
    }
  }

  function activate() {
    if (isActive) return;
    previouslyFocusedElement = document.activeElement;
    container.setAttribute('data-focus-trap-active', 'true');
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    container.addEventListener('keydown', handleKeyDown);
    isActive = true;
  }

  function deactivate() {
    if (!isActive) return;
    container.removeAttribute('data-focus-trap-active');
    container.removeEventListener('keydown', handleKeyDown);
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    isActive = false;
  }

  function toggle() {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }

  return { activate, deactivate, toggle };
}

function addLangAttribute(doc = document, lang = 'en') {
  const htmlElement = doc.documentElement || doc;
  if (!htmlElement.hasAttribute || !htmlElement.hasAttribute('lang')) {
    if (htmlElement.setAttribute) htmlElement.setAttribute('lang', lang);
    return 1;
  }
  return 0;
}

function applyAccessibilityFixes(doc = document, options = {}) {
  const lang = options.lang || 'en';
  return {
    langAdded: addLangAttribute(doc, lang),
    tablesFixed: fixTableStructureIssues(doc),
    mainsAdded: addMainLandmark(doc),
    svgsFixed: addSvgAccessibleNames(doc),
    landmarksEnsured: ensureUniqueLandmarks(doc),
    linksFixed: fixFakeLinkIssue(doc)
  };
}

function loop() {
  // Main game loop
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function addressAccessibilityIssues() {
  // New function to address accessibility issues
}

function newFunction() {
  // New function implementation
}

function setSvgAttributes(svg) {
  // Helper for accessibility props
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addSvgAccessibilityProps,
    checkTableStructure,
    countDependencies,
    init,
    setupKeyboardNavigation,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    ensureUniqueLandmarksFromString,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    myFunction,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarksArray,
    getSvgAccessibleName,
    addAccessibleNamesToSvg,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    checkLinkAndButtonAccessibility,
    newFocusTrap,
    fixTableStructure,
    applyAccessibilityFixes,
    loop,
    add,
    subtract,
    multiply,
    divide,
    newFunction,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    sampleInsightReport,
    AddressabilityIssues
  };

  module.exports.MyComponent = function MyComponent() {
    const langAttr = getLangAttribute();
    return {
      type: 'div',
      props: { lang: langAttr },
      children: []
    };
  };
} else {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}