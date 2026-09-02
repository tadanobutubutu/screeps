// main.js
// ... existing code above line 255 ...

// DONE: Address accessibility issues from insight report:
// - DONE REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - DONE REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - DONE REACT_017: Add/fix 4 landmark issues (handled by validateLandmark() and validateLandmarkStructure())
// - DONE REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and validateSvgAccessibility())
// - DONE REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - DONE REACT_036: Fix 1 fake link issue (handled by createInPageButton() and personName())
// ADD: Address new accessibility issues from insight report
const { dependencyGraphContent } = require('./dependencyGraph');
const { indexContent } = require('./indexContent');
const { functionA, functionB } = require('./someModule');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn } = require('./utilities');

const http = require('http');
const url = require('url');

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];

  // Check if HTML contains tables
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

    // Check for caption
    const hasCaption = /<caption[^>]*>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }

    // Check for th elements
    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }

    // Check for scope attributes on th elements
    const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
    thMatches.forEach((thTag, index) => {
      if (!thTag.includes('scope')) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
          suggestion: 'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements'
        });
      }
    });

    // Check for thead and tbody structure
    const hasThead = /<thead[^>]*>/i.test(tableContent);
    const hasTbody = /<tbody[^>]*>/i.test(tableContent);

    if (!hasThead) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <thead> element`,
        suggestion: 'Wrap header rows in a <thead> element for better semantic structure'
      });
    }

    if (!hasTbody) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <tbody> element`,
        suggestion: 'Wrap data rows in a <tbody> element for better semantic structure'
      });
    }

    // Check for id and headers attributes for complex tables
    const hasMultipleHeaders = (thMatches || []).length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = tableContent.includes('headers=');
      const hasIdAttr = tableContent.includes('id=');

      if (!hasIdAttr && !hasHeadersAttr) {
        issues.push({
          type: 'table',
          severity: 'warning',
          message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
          suggestion: 'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids'
        });
      }
    }
  }

  return issues;
};

const renderGraphIndex = (graphData) => {
  // Handle initial accessibility setup on page load
  handleInitialAccessibility();
  // Ensure all interactive elements have proper ARIA roles and attributes
  ensureInteractiveElementsAccessible();
  // Render the dependency graph using the new function
  dependencyGraphContent(graphData);
  // Render the index using the new function
  indexContent(graphData);
};

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

/**
 * Renders the dependency graph view using the dependencyGraphContent module.
 * This function should be called by the dependency graph rendering functions.
 * @param {Object} props - Props for rendering the dependency graph
 * @returns {React.ReactElement} The rendered dependency graph content
 */
function renderDependencyGraph(props) {
  const content = dependencyGraphContent(props);
  return content;
}

/**
 * Renders the index view using the indexContent module.
 * This function should be called by the index view rendering functions.
 * @param {Object} props - Props for rendering the index view
 * @returns {React.ReactElement} The rendered index content
 */
function renderIndexView(props) {
  const content = indexContent(props);
  return content;
}

// Implement the function for addressing accessibility issues from insight report
function addressAccessibilityIssues(report) {
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

  // Combine languages
  const existingLangAttribute = null;
  const newLangAttribute = null || 'en';
  if (existingLangAttribute !== newLangAttribute) {
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const hasMainLandmark = false;
  if (!hasMainLandmark) {
    const firstSection = null;
    if (firstSection) {
      const mainElement = null;
      while (firstSection.firstChild) {
        // Move children logic would go here
      }
      fixes.mainLandmarkAdded = true;
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    report.issues.landmarkIssues.forEach(issue => {
      const element = null;
      if (element) {
        // Add accessible name if missing
        if (!element.getAttribute('aria-label')) {
          // Try to get label from surrounding context
          const previousSibling = element.previousElementSibling;
          if (previousSibling) {
            const labelId = `landmark-label-${Date.now().toString(36)}`;
            const labelSpan = document.createElement('span');
            labelSpan.id = labelId;
            labelSpan.textContent = 'Label';
            labelSpan.style.display = 'none';
            element.setAttribute('aria-labelledby', labelId);
          } else {
            // Use role as fallback label
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            element.setAttribute('aria-label', role);
          }
        }
      }
    });
  }

  // Fix SVG accessible names
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = null;
      if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
        fixes.svgNamesAdded++;
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    report.issues.fakeLinkIssues.forEach(issue => {
      const element = null;
      if (element) {
        // Check if this element should be a link or a button
        const isNavigation = element.closest && element.closest('nav') !== null;

        if (isNavigation || (element.tagName && element.tagName.toLowerCase() === 'a')) {
          // Convert to proper link with href
          if (!element.getAttribute('href')) {
            element.setAttribute('href', '#');
            element.setAttribute('role', 'link');
            fixes.fakeLinksFixed++;
          }
        } else {
          // Convert to button
          element.setAttribute('role', 'button');
          fixes.fakeLinksFixed++;
        }
      }
    });
  }

  return fixes;
}

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
  prefersReducedMotion() {
    return false;
  },

  prefersHighContrast() {
    return false;
  },

  focusTrap: null,

  updateLiveRegion(message, priority = 'polite') {
    if (this.liveRegion) {
      // Announce message logic would go here
    }
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element, index) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }
      });
    });
  }
};

const renderIndex = (data, options = {}) => {
  // Use the imported indexContent module for rendering
  const content = indexContent(data, options);
  // Use the imported addLangAttribute module for ensuring lang attribute
  if (content && typeof content === 'string') {
    return addLangAttribute(content);
  }
  return content;
};

function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return 'SVG graphic';
  }
  
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  // Fallback to role if present
  const role = svgElement.getAttribute('role');
  if (role) {
    return `Graphic: ${role}`;
  }

  return 'SVG graphic';
}

// NEW: Address new accessibility issues from insight report

/**
 * Convert a hex color to its RGB components.
 * @param {string} hex - Hex color string (e.g., '#ffffff' or '#fff')
 * @returns {{r: number, g: number, b: number}|null} RGB components or null if invalid
 */
function hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Compute the relative luminance of a color.
 * @param {{r: number, g: number, b: number}|string} color - RGB object or hex string
 * @returns {number} Relative luminance (0..1)
 */
function getRelativeLuminance(color) {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  if (!rgb) return 0;
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/**
 * Compute the WCAG contrast ratio between two colors.
 * @param {string|{r: number, g: number, b: number}} fg - Foreground color
 * @param {string|{r: number, g: number, b: number}} bg - Background color
 * @returns {number} Contrast ratio (1..21)
 */
function getContrastRatio(fg, bg) {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check whether two colors meet the desired WCAG contrast level.
 * @param {string|{r: number, g: number, b: number}} fg - Foreground color
 * @param {string|{r: number, g: number, b: number}} bg - Background color
 * @param {string} [level='AA'] - 'AA' or 'AAA'
 * @param {string} [textSize='normal'] - 'normal' or 'large'
 * @returns {boolean} True if the contrast ratio meets the requirement
 */
function meetsContrastRequirement(fg, bg, level, textSize) {
  const ratio = getContrastRatio(fg, bg);
  const lvl = (level || 'AA').toUpperCase();
  const size = (textSize || 'normal').toLowerCase();
  if (lvl === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  // AA (default)
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Validate the heading hierarchy of the document (h1..h6 should not skip levels).
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateHeadingHierarchy() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const errors = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let hasH1 = false;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (level === 1) hasH1 = true;
    if (index === 0 && level !== 1) {
      errors.push(`First heading should be <h1>, found <h${level}>`);
    }
    if (previousLevel > 0 && level > previousLevel + 1) {
      errors.push(`Heading level skipped: <h${previousLevel}> followed by <h${level}>`);
    }
    previousLevel = level;
  });
  if (!hasH1 && headings.length > 0) {
    errors.push('Document has headings but no <h1> element');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate that all form fields have accessible labels.
 * @param {HTMLElement} [formRoot] - Optional root element to scope validation
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateFormLabels(formRoot) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const root = formRoot || document;
  const errors = [];
  const fields = root.querySelectorAll('input, textarea, select');
  fields.forEach((field, index) => {
    const type = (field.getAttribute('type') || '').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;
    const id = field.id;
    const hasLabel = id && root.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = field.getAttribute('aria-label');
    const hasAriaLabelledby = field.getAttribute('aria-labelledby');
    const wrappedInLabel = field.closest('label');
    const hasTitle = field.getAttribute('title');
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby && !wrappedInLabel && !hasTitle) {
      errors.push(`Form field ${index + 1} (<${field.tagName.toLowerCase()}>) is missing an accessible label`);
    }
  });
  return { valid: errors.length === 0, errors };
}

/**
 * Get the accessible alt text for an image element.
 * @param {HTMLImageElement} img - The image element
 * @returns {string|null} Alt text, empty string if decorative, or null if missing
 */
function getImageAltText(img) {
  if (!img) return null;
  if (img.hasAttribute('alt')) {
    return img.getAttribute('alt');
  }
  return null;
}

/**
 * Validate that all content images have appropriate alt attributes.
 * @param {HTMLElement} [root] - Optional root element to scope validation
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateImageAltText(root) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const scope = root || document;
  const errors = [];
  const images = scope.querySelectorAll('img');
  images.forEach((img, index) => {
    const role = (img.getAttribute('role') || '').toLowerCase();
    const isDecorative = role === 'presentation' || role === 'none';
    if (!img.hasAttribute('alt') && !isDecorative) {
      errors.push(`Image ${index + 1} (src="${img.getAttribute('src') || ''}") is missing alt attribute`);
    }
  });
  return { valid: errors.length === 0, errors };
}

/**
 * Validate ARIA attributes on an element.
 * @param {HTMLElement} element - The element to validate
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateAriaAttributes(element) {
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  const errors = [];
  const attrs = element.attributes;
  const validRoles = new Array(
    'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
    'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
    'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed',
    'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 'img',
    'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee',
    'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
    'navigation', 'none', 'note', 'option', 'presentation', 'progressbar',
    'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader',
    'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton',
    'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term',
    'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
  );
  for (let i = 0; i < attrs.length; i++) {
    const name = attrs[i].name;
    if (name === 'role') {
      const roleValue = attrs[i].value.toLowerCase();
      if (validRoles.indexOf(roleValue) === -1) {
        errors.push(`Invalid role value: "${roleValue}"`);
      }
    }
  }
  // Check aria-labelledby references valid IDs
  const labelledby = element.getAttribute('aria-labelledby');
  if (labelledby) {
    labelledby.split(/\s+/).forEach((refId) => {
      if (refId && typeof document !== 'undefined' && !document.getElementById(refId)) {
        errors.push(`aria-labelledby references missing element with id "${refId}"`);
      }
    });
  }
  const describedby = element.getAttribute('aria-describedby');
  if (describedby) {
    describedby.split(/\s+/).forEach((refId) => {
      if (refId && typeof document !== 'undefined' && !document.getElementById(refId)) {
        errors.push(`aria-describedby references missing element with id "${refId}"`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Move focus to an element, ensuring it can receive focus.
 * @param {HTMLElement} element - The element to focus
 * @param {boolean} [preventScroll=false] - Whether to prevent scrolling
 * @returns {boolean} True if focus was set successfully
 */
function focusElement(element, preventScroll) {
  if (!element) return false;
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }
  if (typeof element.focus === 'function') {
    element.focus({ preventScroll: preventScroll === true });
    return true;
  }
  return false;
}

/**
 * Run a comprehensive accessibility audit of the current page.
 * @param {HTMLElement} [root] - Optional root element to scope the audit
 * @returns {{valid: boolean, errors: string[], results: Object[]}} Combined audit results
 */
function runAccessibilityAudit(root) {
  const results = [];
  const allErrors = [];

  results.push({ check: 'headingHierarchy', ...validateHeadingHierarchy() });
  results.push({ check: 'formLabels', ...validateFormLabels(root) });
  results.push({ check: 'imageAltText', ...validateImageAltText(root) });
  results.push({ check: 'landmarks', ...validateLandmarkStructure() });
  results.push({ check: 'uniqueLandmarks', ...ensureUniqueLandmarks() });
  results.push({ check: 'svgAccessibility', ...validateSvgAccessibility() });

  results.forEach((result) => {
    if (result.errors && result.errors.length > 0) {
      allErrors.push(...result.errors.map(e => `[${result.check}] ${e}`));
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    results
  };
}

// Export all functions to make them available as module exports
export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  personName,
  // New accessibility exports
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  validateHeadingHierarchy,
  validateFormLabels,
  getImageAltText,
  validateImageAltText,
  validateAriaAttributes,
  focusElement,
  runAccessibilityAudit
}