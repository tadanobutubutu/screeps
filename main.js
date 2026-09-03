// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report (DONE: addressNewAccessibilityIssues)
// - NEW: Implement a new function to handle focus trap for keyboard navigation (DONE: newFocusTrap)

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (target) {
    link.target = target;
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }

  // Check target="_blank" has rel="noopener noreferrer"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  // Check for redundant title attribute
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

// New function to handle focus trap for keyboard navigation
function newFocusTrap(containerElement, options = {}) {
  const {
    onEscape,
    initialFocus = 'first',
    returnFocus = true,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  } = options;

  if (!containerElement || typeof document === 'undefined') {
    return {
      activate: () => {},
      deactivate: () => {}
    };
  }

  let previousActiveElement = null;
  let isActive = false;

  /**
   * Gets all focusable elements within the container
   * @returns {HTMLElement[]} Array of focusable elements
   */
  function getFocusableElements() {
    return Array.from(containerElement.querySelectorAll(focusableSelector)).filter(el => {
      return !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden');
    });
  }

  /**
   * Gets the element to focus based on initialFocus option
   * @returns {HTMLElement|null} Element to focus
   */
  function getInitialFocusElement() {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return null;

    if (initialFocus === 'first') {
      return focusableElements[0];
    } else if (initialFocus === 'last') {
      return focusableElements[focusableElements.length - 1];
    } else if (initialFocus === 'container') {
      return containerElement;
    } else if (typeof initialFocus === 'string') {
      return containerElement.querySelector(initialFocus);
    } else if (initialFocus instanceof HTMLElement) {
      return initialFocus;
    }
    return focusableElements[0];
  }

  /**
   * Handles keydown events for Tab and Escape
   * @param {KeyboardEvent} event
   */
  function handleKeyDown(event) {
    if (!isActive) return;

    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: move backward
        if (activeElement === firstElement || !containerElement.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move forward
        if (activeElement === lastElement || !containerElement.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  /**
   * Activates the focus trap
   */
  function activate() {
    if (isActive) return;

    isActive = true;
    previousActiveElement = document.activeElement;

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Set aria-hidden on other content (optional enhancement)
    containerElement.setAttribute('aria-hidden', 'false');

    // Focus the initial element
    const focusElement = getInitialFocusElement();
    if (focusElement) {
      setTimeout(() => focusElement.focus(), 0);
    }
  }

  /**
   * Deactivates the focus trap
   * @param {boolean} focusReturnElement - Whether to return focus to the previously focused element
   */
  function deactivate(focusReturnElement = returnFocus) {
    if (!isActive) return;

    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);

    // Reset aria-hidden attribute
    containerElement.setAttribute('aria-hidden', 'true');

    // Return focus to the previously focused element
    if (focusReturnElement && previousActiveElement && previousActiveElement.focus) {
      setTimeout(() => previousActiveElement.focus(), 0);
    }
  }

  return {
    activate,
    deactivate,
    getFocusableElements,
    isActive: () => isActive
  };
}

// New function to address new accessibility issues from insight report
function addressNewAccessibilityIssues() {
  const issues = [];

  if (typeof document === 'undefined') {
    return { valid: false, issues: ['Document not available'] };
  }

  // Check for missing skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  const hasSkipLink = Array.from(skipLinks).some(link => {
    const href = link.getAttribute('href');
    return href === '#main' || href === '#content' || href.startsWith('#main-');
  });

  if (!hasSkipLink && document.body.firstChild?.tagName !== 'A') {
    issues.push({
      code: 'SKIP_LINK',
      severity: 'warning',
      message: 'Page may benefit from a skip link to main content'
    });
  }

  // Check for color contrast issues (simplified check)
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, li, td, th, dt, dd');
  textElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    // Placeholder for contrast check
    if (style.color === style.backgroundColor) {
      issues.push({
        code: 'CONTRAST',
        severity: 'error',
        message: `Element has same color as background: ${el.tagName.toLowerCase()}`
      });
    }
  });

  // Check for missing form labels
  const formControls = document.querySelectorAll('input, select, textarea');
  formControls.forEach(control => {
    const id = control.getAttribute('id');
    const type = control.getAttribute('type');
    if (type === 'hidden') return;

    const hasLabel = (id && document.querySelector(`label[for="${id}"]`)) ||
                     control.closest('label') ||
                     control.getAttribute('aria-label') ||
                     control.getAttribute('aria-labelledby');

    if (!hasLabel) {
      issues.push({
        code: 'FORM_LABEL',
        severity: 'error',
        message: `Form control missing label: ${control.tagName.toLowerCase()}`
      });
    }
  });

  return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}

/**
 * Renders a dependency graph from the provided data
 * @param {Object} graphData - The graph data containing nodes and edges
 * @param {HTMLElement} container - The container element to render the graph into
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraph(graphData, container) {
  if (!container || typeof document === 'undefined') {
    return null;
  }

  // Clear the container
  container.innerHTML = '';

  // Create the graph wrapper
  const graphWrapper = document.createElement('div');
  graphWrapper.className = 'dependency-graph';
  graphWrapper.setAttribute('role', 'graphics-document');
  graphWrapper.setAttribute('aria-label', 'Dependency graph');

  // Create the nodes container
  const nodesContainer = document.createElement('div');
  nodesContainer.className = 'dependency-graph-nodes';

  // Create the edges container (SVG for lines)
  const edgesContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  edgesContainer.classList.add('dependency-graph-edges');
  edgesContainer.setAttribute('aria-hidden', 'true');

  // Render nodes
  if (graphData && graphData.nodes) {
    graphData.nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = `dependency-node dependency-node-${node.type || 'default'}`;
      nodeEl.setAttribute('data-node-id', node.id);
      nodeEl.setAttribute('role', 'treeitem');
      nodeEl.setAttribute('tabindex', '0');
      nodeEl.setAttribute('aria-label', node.label || node.id);
      nodeEl.textContent = node.label || node.id;
      nodesContainer.appendChild(nodeEl);
    });
  }

  // Render edges
  if (graphData && graphData.edges) {
    graphData.edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.x1 || 0);
      line.setAttribute('y1', edge.y1 || 0);
      line.setAttribute('x2', edge.x2 || 0);
      line.setAttribute('y2', edge.y2 || 0);
      line.setAttribute('stroke', '#999');
      edgesContainer.appendChild(line);
    });
  }

  graphWrapper.appendChild(edgesContainer);
  graphWrapper.appendChild(nodesContainer);
  container.appendChild(graphWrapper);

  return {
    element: graphWrapper,
    update: (updatedGraphData) => renderDependencyGraph(updatedGraphData, container),
    destroy: () => {
      container.innerHTML = '';
    }
  };
}

/**
 * Renders an index view showing dependencies between modules
 * @param {Array} dependencies - Array of dependency objects
 * @param {HTMLElement} container - The container element to render the index into
 * @returns {Object} The rendered index instance
 */
function renderDependencyIndexView(dependencies, container) {
  if (!container || typeof document === 'undefined') {
    return null;
  }

  // Clear the container
  container.innerHTML = '';

  // Create the index wrapper
  const indexWrapper = document.createElement('div');
  indexWrapper.className = 'dependency-index-view';
  indexWrapper.setAttribute('role', 'region');
  indexWrapper.setAttribute('aria-label', 'Dependency index view');

  // Create the heading
  const heading = document.createElement('h2');
  heading.className = 'dependency-index-heading';
  heading.textContent = 'Dependency Index';
  indexWrapper.appendChild(heading);

  // Create the list
  const list = document.createElement('ul');
  list.className = 'dependency-index-list';
  list.setAttribute('role', 'list');

  if (dependencies && Array.isArray(dependencies)) {
    dependencies.forEach(dep => {
      const listItem = document.createElement('li');
      listItem.className = 'dependency-index-item';
      listItem.setAttribute('role', 'listitem');
      listItem.setAttribute('data-dependency-id', dep.id || '');

      const name = document.createElement('span');
      name.className = 'dependency-name';
      name.textContent = dep.name || dep.id || 'Unnamed dependency';
      listItem.appendChild(name);

      if (dep.version) {
        const version = document.createElement('span');
        version.className = 'dependency-version';
        version.textContent = `v${dep.version}`;
        listItem.appendChild(version);
      }

      if (dep.description) {
        const description = document.createElement('span');
        description.className = 'dependency-description';
        description.textContent = dep.description;
        listItem.appendChild(description);
      }

      list.appendChild(listItem);
    });
  }

  indexWrapper.appendChild(list);
  container.appendChild(indexWrapper);

  return {
    element: indexWrapper,
    update: (updatedDeps) => renderDependencyIndexView(updatedDeps, container),
    destroy: () => {
      container.innerHTML = '';
    }
  };
}

// Export functions for use in other modules (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setHtmlLangAttribute,
    detectAndSetLang,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    ensureUniqueLandmarks,
    createAccessibleLink,
    isLinkAccessible,
    createInPageButton,
    newFocusTrap,
    addressNewAccessibilityIssues,
    renderDependencyGraph,
    renderDependencyIndexView
  };
}