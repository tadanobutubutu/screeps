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
      return { valid: false, errors: ['Invalid table element'] };
    }

    const errors = [];
    const caption = table.querySelector('caption');
    if (!caption) {
      errors.push('Table missing caption');
    }

    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      errors.push('Table missing header cells');
    }

    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0 && index !== 0) {
        errors.push(`Row ${index + 1} has no cells`);
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  validateTableStructure: (table) => {
    if (!table || !(table instanceof HTMLElement) || table.tagName !== 'TABLE') {
      return { valid: false, errors: ['Invalid table element'] };
    }

    const errors = [];
    const rows = table.querySelectorAll('tr');

    // Check for proper table structure
    if (rows.length === 0) {
      errors.push('Table has no rows');
    }

    // Check for consistent column count
    let columnCount = -1;
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      if (columnCount === -1) {
        columnCount = cells.length;
      } else if (cells.length !== columnCount) {
        errors.push(`Row ${rowIndex + 1} has inconsistent column count (expected ${columnCount}, got ${cells.length})`);
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark: validateLandmark,
  validateLandmarkStructure: validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName: (svg) => {
    if (!svg || !(svg instanceof SVGElement)) {
      return null;
    }

    // Check for title element
    const title = svg.querySelector('title');
    if (title && title.textContent.trim().length > 0) {
      return title.textContent.trim();
    }

    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim().length > 0) {
      return ariaLabel.trim();
    }

    // Check for aria-labelledby
    const labelledById = svg.getAttribute('aria-labelledby');
    if (labelledById) {
      const labelledByElement = document.getElementById(labelledById);
      if (labelledByElement && labelledByElement.textContent.trim().length > 0) {
        return labelledByElement.textContent.trim();
      }
    }

    // Check for desc element
    const desc = svg.querySelector('desc');
    if (desc && desc.textContent.trim().length > 0) {
      return desc.textContent.trim();
    }

    return null;
  },

  // TODO: Add a language attribute to the HTML element
  getLangAttribute: (element) => {
    if (!element || !(element instanceof HTMLElement)) {
      return null;
    }

    const lang = element.getAttribute('lang');
    if (lang) {
      return lang;
    }

    const xmlLang = element.getAttribute('xml:lang');
    if (xmlLang) {
      return xmlLang;
    }

    return null;
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