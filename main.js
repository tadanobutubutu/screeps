const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

module.exports = {
  ...main,

  // TODO: Address accessibility issues from insight report
  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const htmlElement = document.documentElement;
    const langAttr = getLangAttribute(htmlElement);
    if (!langAttr) {
      htmlElement.lang = 'en';
      fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      const body = document.body;
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.insertBefore(newMain, body.firstChild);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix landmark issues
    const landmarkFixes = validateLandmark(container);
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length;
    }
    const landmarkStructureFixes = validateLandmarkStructure(container);
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length;
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]');
    fakeLinks.forEach(link => {
      const style = window.getComputedStyle(link);
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        fixes.fakeLinksFixed++;
      }
    });

    // Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info');
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
  },

  // TODO: Implement a new function to handle focus trap for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    let activeElementIndex = focusableElements.length - 1;

    function setActiveElement(index) {
      if (index < 0) {
        index = focusableElements.length - 1;
      } else if (index >= focusableElements.length) {
        index = 0;
      }

      if (focusableElements[index]) {
        focusableElements[index].focus();
      } else {
        focusableElements[0].focus();
      }
      activeElementIndex = index;
    }

    function nextFocusableElement() {
      setActiveElement(activeElementIndex + 1);
    }

    function prevFocusableElement() {
      setActiveElement(activeElementIndex - 1);
    }

    function moveFocusToFirst() {
      setActiveElement(0);
    }

    function moveFocusToLast() {
      setActiveElement(focusableElements.length - 1);
    }

    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            prevFocusableElement();
          } else {
            nextFocusableElement();
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          prevFocusableElement();
          e.preventDefault();
          break;
        case 'ArrowRight':
          nextFocusableElement();
          e.preventDefault();
          break;
        case 'Home':
          moveFocusToFirst();
          e.preventDefault();
          break;
        case 'End':
          moveFocusToLast();
          e.preventDefault();
          break;
      }
    });
  },

  // TODO: Import the new function to create a button with correct accessibility properties for in-page linking
  createInPageButton: createInPageButton,

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton: createWebResourceButton,

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility: (table) => {
    if (!table || !(table instanceof HTMLElement) || table.tagName !== 'TABLE') {
      throw new Error('Invalid table element provided');
    }

    const issues = [];

    // Check for missing caption
    if (!table.querySelector('caption')) {
      issues.push('Table is missing a caption element');
    }

    // Check for proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push('Table is missing header cells (th elements)');
    }

    // Check for scope attributes on headers
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        issues.push('Header cell is missing scope attribute');
      }
    });

    // Check for proper data cell associations
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0 && !row.querySelector('th')) {
        issues.push('Data row is missing a header cell');
      }
    });

    return issues.length > 0 ? issues : null;
  },

  validateTableStructure: (table) => {
    if (!table || !(table instanceof HTMLElement) || table.tagName !== 'TABLE') {
      throw new Error('Invalid table element provided');
    }

    const issues = [];

    // Check for proper table structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');

    if (!thead) {
      issues.push('Table is missing thead element');
    }

    if (!tbody) {
      issues.push('Table is missing tbody element');
    }

    // Check for proper nesting
    const directChildren = Array.from(table.children);
    directChildren.forEach(child => {
      if (!['THEAD', 'TBODY', 'TFOOT', 'CAPTION'].includes(child.tagName)) {
        issues.push(`Table contains invalid direct child element: ${child.tagName}`);
      }
    });

    return issues.length > 0 ? issues : null;
  },

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark: validateLandmark,
  validateLandmarkStructure: validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName: (svg) => {
    if (!svg || !(svg instanceof HTMLElement) || svg.tagName !== 'SVG') {
      throw new Error('Invalid SVG element provided');
    }

    // Check for aria-label
    if (svg.hasAttribute('aria-label')) {
      return svg.getAttribute('aria-label');
    }

    // Check for aria-labelledby
    if (svg.hasAttribute('aria-labelledby')) {
      const id = svg.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(id);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }

    // Check for title element
    const title = svg.querySelector('title');
    if (title) {
      return title.textContent.trim();
    }

    // Check for desc element
    const desc = svg.querySelector('desc');
    if (desc) {
      return desc.textContent.trim();
    }

    // Check for figcaption if SVG is in figure
    const figure = svg.closest('figure');
    if (figure) {
      const caption = figure.querySelector('figcaption');
      if (caption) {
        return caption.textContent.trim();
      }
    }

    return null;
  },

  // TODO: Add a language attribute to the HTML element
  getLangAttribute: (element) => {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('Invalid HTML element provided');
    }

    return element.getAttribute('lang') || element.getAttribute('xml:lang');
  },

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport: validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  async handleCredentialResponse(response) {
    if (!response) {
      throw new Error('No response received');
    }

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.token) {
      return {
        success: true,
        token: response.token,
        expiresIn: response.expiresIn || 3600
      };
    }

    throw new Error('Invalid credential response');
  },

  // Existing utility functions
  log: (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  },

  // Export functionality with accessibility support
  exportUtils,

  // New focus trap functionality for keyboard navigation
  focusTrap
};