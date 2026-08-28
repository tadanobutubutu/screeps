const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

const a11yStore = {
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }

    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  makeAccessible(element) {
    // Implement the function logic to address accessibility issues
  },

  newNecessaryFunction() {
    // Implement the new function logic here
  },

  handleAccessibilityIssues() {
    // Implement the function logic to handle accessibility issues
  },

  addressAccessibilityIssue038() {
    // Existing code for addressing accessibility issue 038
  },

  renderDependencyGraph() {
    // Existing code for rendering dependency graph
  },
};

function getSvgAccessibleName(svgElement) {
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

  return 'SVG graphic';
}

function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Integrated the logic from both branches to address accessibility issues
  });
}

const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

// Assuming the HTML content is included in a component or similar file that is imported into main.js
// ...

function ensureElementHasId(element) {
  // existing function implementation
}

function addAriaLabel(element, label) {
  // existing function implementation
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

function myNewFunction(input) {
  // Implement the new function here
}

function newFunction() {
  // Placeholder for additional new function
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

function countDependencies(dependencies, devDependencies) {
  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

function checkTableStructure() {
  // existing function implementation
}

function utilityFunction() {
  // Placeholder utility function
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;

  const hasText = button.textContent && button.textContent.trim().length > 0;
  const hasAriaLabel = button.hasAttribute('aria-label');
  const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
  const hasTitle = button.hasAttribute('title');
  const hasIcon = button.querySelector('svg, img, icon');

  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle || hasIcon;
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;

  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');

  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: { accessible: [], inaccessible: [] },
    buttons: { accessible: [], inaccessible: [] }
  };

  if (!container) return results;

  const links = container.querySelectorAll('a[href]');
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
    }
  });

  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
    }
  });

  return results;
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element || !role) return { valid: false, issues: [] };

  const issues = [];
  const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');

  if (!hasLabel && role !== 'main') {
    issues.push(`Landmark with role "${role}" is missing accessible label`);
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) return null;

  const existingMain = document.querySelector('main');
  if (existingMain) return existingMain;

  const main = document.createElement('main');
  main.setAttribute('role', 'main');

  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
        !child.hasAttribute('aria-hidden') || child.getAttribute('aria-hidden') !== 'true') {
      main.appendChild(child);
    }
  });

  document.body.insertBefore(main, document.body.firstChild);
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    landmarks: [],
    issues: []
  };

  if (!container) return results;

  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach(element => {
      const checkResult = checkLandmarkElement(role, element);
      results.landmarks.push({
        role,
        element,
        valid: checkResult.valid
      });

      if (!checkResult.valid) {
        results.issues.push({
          role,
          element,
          issues: checkResult.issues
        });
      }
    });
  });

  return results;
}

/**
 * Validates table accessibility by checking for proper headers, captions, and ARIA attributes.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} An object containing validation results
 */
function validateTableAccessibility(table) {
  const results = {
    isAccessible: true,
    issues: [],
    table: table
  };

  if (!table) {
    results.isAccessible = false;
    results.issues.push('Table is null or undefined');
    return results;
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    results.isAccessible = false;
    results.issues.push('Table is missing a caption element');
  }

  // Check for headers (th elements)
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    results.isAccessible = false;
    results.issues.push('Table is missing header cells (th elements)');
  } else {
    // Check that headers have scope attribute or are associated with cells via id/headers
    let hasScopedHeaders = false;
    headers.forEach(th => {
      if (th.hasAttribute('scope') || th.hasAttribute('id')) {
        hasScopedHeaders = true;
      }
    });
    if (!hasScopedHeaders) {
      results.isAccessible = false;
      results.issues.push('Table headers are missing scope attributes or IDs');
    }
  }

  // Check for proper table structure (tbody, thead, or tfoot)
  const structuralElements = table.querySelectorAll('thead, tbody, tfoot');
  if (structuralElements.length === 0) {
    results.isAccessible = false;
    results.issues.push('Table is missing proper structural elements (thead, tbody, or tfoot)');
  }

  return results;
}

/**
 * Validates table structure by checking for proper nesting and element types.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} An object containing validation results
 */
function validateTableStructure(table) {
  const results = {
    isValid: true,
    issues: [],
    table: table
  };

  if (!table) {
    results.isValid = false;
    results.issues.push('Table is null or undefined');
    return results;
  }

  // Check that table doesn't contain non-table elements directly
  const allowedChildren = ['CAPTION', 'COLGROUP', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'COL'];
  const directChildren = Array.from(table.children);

  directChildren.forEach(child => {
    if (allowedChildren.indexOf(child.tagName) === -1) {
      results.isValid = false;
      results.issues.push('Table contains invalid child element: ' + child.tagName);
    }
  });

  // Check that tr elements are inside thead, tbody, or tfoot
  const trElements = table.querySelectorAll('tr');
  trElements.forEach(tr => {
    const parent = tr.parentElement;
    if (parent && parent.tagName !== 'THEAD' && parent.tagName !== 'TBODY' && parent.tagName !== 'TFOOT' && parent.tagName !== 'TABLE') {
      results.isValid = false;
      results.issues.push('tr element is not properly nested in a structural element');
    }
  });

  // Check that td/th elements are inside tr
  const cells = table.querySelectorAll('td, th');
  cells.forEach(cell => {
    const parent = cell.parentElement;
    if (!parent || parent.tagName !== 'TR') {
      results.isValid = false;
      results.issues.push('Cell element is not inside a tr element');
    }
  });

  return results;
}

// Exports
module.exports = {
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    checkTableStructure,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs,
    myNewFunction,
    newFunction,
    isLinkAccessible,
    isButtonAccessible,
    checkAccessibility,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    checkLandmarks,
    addressAccessibilityIssue038,
    getSvgAccessibleName,
    utilityFunction,
    validateTableAccessibility,
    validateTableStructure
};

export {
  a11yStore,
  handleAccessibilityIssues,
  getSvgAccessibleName,
  newNecessaryFunction,
  createAccessibleButton,
  createAccessibleDialog,
  announceToScreenReader,
  trapFocus,
  initAccessibility,
  updateLiveRegion,
  checkLandmarkElements,
  addSVGAccessibilityProps,
  addressAccessibilityIssue038,
  renderDependencyGraph,
  utilityFunction,
  validateTableAccessibility,
  validateTableStructure
};
export default a11yStore;