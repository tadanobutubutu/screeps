// Add new functions to ensure the element has an id, add aria-label, render dependency graphs

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  let uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
}

// Set of used landmark IDs for ensuring uniqueness
const _usedLandmarkIds = new Set();

/**
 * Ensures a unique landmark ID based on the provided base name.
 * @param {string} baseName - The base name to use for the unique ID.
 * @returns {string} A unique landmark ID.
 */
function ensureUniqueLandmarkId(baseName) {
  let candidate = baseName;
  if (_usedLandmarkIds.has(candidate)) {
    // Collision handling: add random suffix
    const suffix = Math.random().toString(36).substring(2, 9);
    candidate = `${baseName}-${suffix}`;
  }
  _usedLandmarkIds.add(candidate);
  return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];
  for (const lm of landmarks) {
    if (!seen.has(lm.id)) {
      seen.add(lm.id);
      result.push(lm);
    }
  }
  return result;
}

// Function to spawn a new child process
function spawnChildProcess(command, args) {
  const cp = require('child_process');
  return new Promise((resolve, reject) => {
    const child = cp.spawn(command, args);

    let stdout = '';
    child.stdout.on('data', (data) => {
      stdout += data;
    });

    child.stderr.on('data', (data) => {
      console.error(` spawn error: ${data}`);
      reject(new Error(` spawn error: ${data}`));
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(` spawn exited with code ${code}`);
        reject(new Error(` spawn exited with code ${code}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// Ensure an element has an id attribute
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return element.id;
}

// Add aria-label to an element
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  element.setAttribute('aria-label', label);
}

// Render dependency graphs
function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const { nodes = [], edges = [] } = options;
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph visualization');

  // Render nodes
  nodes.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.id = ensureElementHasId(nodeElement, 'node');
    nodeElement.textContent = node.label || node.id;
    nodeElement.className = 'graph-node';
    graphContainer.appendChild(nodeElement);
  });

  // Render edges (connections between nodes)
  edges.forEach(edge => {
    const sourceId = ensureElementHasId(document.getElementById(edge.source) || { id: edge.source }, 'node-source');
    const targetId = ensureElementHasId(document.getElementById(edge.target) || { id: edge.target }, 'node-target');

    const edgeElement = document.createElement('div');
    edgeElement.className = 'graph-edge';
    edgeElement.setAttribute('data-source', edge.source);
    edgeElement.setAttribute('data-target', edge.target);
    graphContainer.appendChild(edgeElement);
  });

  container.appendChild(graphContainer);
  return graphContainer;
}

// TODO: Implement spawning logic
async function implementSpawningLogic(command, args) {
  try {
    const output = await spawnChildProcess(command, args);
    console.log(` spawn output: ${output}`);
  } catch (error) {
    console.error(error.message);
  }
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  renderDependencyGraph,
  renderIndex,
  renderGraphIndex,
  limitTabFunctionality,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  functionA,
  functionB,
  accessibilityUtils,
  newFocusTrap,
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateTableAccessibilityImpl,
  validateTableStructureImpl,
  transformInputData,
  setSvgAccessibleProps,
  addAccessibleNamesToSVGs,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn
} = main;

// New rendering function (DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW)

/**
 * New function for rendering the graph/index
 * @param {Object} content - The content to render
 * @param {Object} options - Rendering options
 * @returns {string} Rendered HTML
 */
function renderGraphIndex(content, options = {}) {
  // Implementation of the new function
  // This is a placeholder for the actual rendering logic
  return content; // Simplified return for demonstration
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement && lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement && firstElement.focus();
      }
    }
  });
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(container, lang = 'en') {
  let htmlElement = container.querySelector('html') || document.documentElement;
  if (!htmlElement) {
    htmlElement = document.querySelector('html');
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;

  // Ensure table has proper scope attributes on headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const row = th.closest('tr');
      const cellIndex = Array.from(row.children).indexOf(th);
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col');
    }
  });

  // Add caption if missing and table doesn't have one
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    caption.style.srOnly = true;
    tableElement.insertBefore(caption, tableElement.firstChild);
  }

  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function fixLandmarkIssues(container) {
  if (!container) return null;

  // Ensure main content is wrapped in main landmark
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]');
  if (!mainElement) {
    const existingMain = container.querySelector('#main-content');
    if (existingMain) {
      existingMain.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has proper nav landmarks
  const navElements = container.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Navigation');
    }
  });

  // Ensure footer has proper footer landmark
  const footerElement = container.querySelector('footer');
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo');
  }

  return container;
}

// New function to be exported
function newExportedFunction() {
  // Implementation of the new function
  // ...
}

// Existing rendering functions (preserving existing exports and functions)
const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap } = main;

// Accessibility helper function for keyboard navigation (new functionality)
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

/**
 * Generates a report based on accessibility issues found in the document.
 * @returns {Object} A report containing accessibility findings categorized by type.
 */
function generateAccessibilityReport() {
  // (Existing code remains as-is)
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Implementation to address accessibility issues from an insight report.
  // Apply specific accessibility fixes here based on the report's structure.
  // For now, we simply return the report unchanged.
  return insightReport;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    ensureUniqueLandmarks,
    setupKeyboardNavigation,
    trapFocus,
    generateAccessibilityReport,
    addressAccessibilityIssues,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs,
    implementSpawningLogic // Add the new function to the exports
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Fix lang attribute on HTML element
  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  if (report.issues.missingMainLandmark) {
    const mainElements = container.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      // Try to convert the first section to main
      const firstSection = container.querySelector('section');
      if (firstSection) {
        // Create a new main element and move content into it
        const mainElement = container.ownerDocument.createElement('main');
        while (firstSection.firstChild) {
          mainElement.appendChild(firstSection.firstChild);
        }
        firstSection.parentNode.insertBefore(mainElement, firstSection);
        firstSection.remove();
        fixes.mainLandmarkAdded = true;
      }
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    const uniqueLandmarksFixed = new Set();
    
    report.issues.landmarkIssues.forEach(issue => {
      if (issue.selector && !uniqueLandmarksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Add accessible name if missing
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            
            // Try to get label from surrounding context
            const previousSibling = element.previousElementSibling;
            if (previousSibling && previousSibling.textContent.trim()) {
              const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const labelSpan = container.ownerDocument.createElement('span');
              labelSpan.id = labelId;
              labelSpan.textContent = previousSibling.textContent.trim();
              labelSpan.style.display = 'none';
              element.parentNode.insertBefore(labelSpan, element);
              element.setAttribute('aria-labelledby', labelId);
            } else {
              // Use role as fallback label
              const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/[^a-zA-Z]/g, ' ');
              element.setAttribute('aria-label', roleLabel);
            }
            uniqueLandmarksFixed.add(issue.selector);
            fixes.landmarksFixed++;
          }
        }
      }
    });
  }

  // Add accessible names to SVGs
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        // Check if SVG already has an accessible name
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          // Look for a title element within the SVG
          let titleElement = svg.querySelector('title');
          
          if (!titleElement) {
            // Create a title element
            titleElement = container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
            const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            titleElement.id = titleId;
            titleElement.textContent = issue.suggestedName || 'Decorative SVG';
            
            // Insert title as first child of SVG
            if (svg.firstChild) {
              svg.insertBefore(titleElement, svg.firstChild);
            } else {
              svg.appendChild(titleElement);
            }
            
            svg.setAttribute('aria-labelledby', titleId);
            fixes.svgNamesAdded++;
          }
        }
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    const uniqueFakeLinksFixed = new Set();
    
    report.issues.fakeLinkIssues.forEach(issue => {
      if (issue.selector && !uniqueFakeLinksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Check if this element should be a link or a button
          const isNavigation = element.closest('nav') !== null;
          
          if (isNavigation || element.tagName.toLowerCase() === 'a') {
            // Convert to proper link with href
            if (!element.hasAttribute('href')) {
              element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
              element.setAttribute('role', 'link');
              uniqueFakeLinksFixed.add(issue.selector);
              fixes.fakeLinksFixed++;
            }
          } else {
            // Convert to button
            element.setAttribute('role', 'button');
            if (!element.hasAttribute('tabindex')) {
              element.setAttribute('tabindex', '0');
            }
            uniqueFakeLinksFixed.add(issue.selector);
            fixes.fakeLinksFixed++;
          }
        }
      }
    });
  }

  return fixes;
}

// Preserved existing function from origin/main
function myAccessibleFunction() {
  const accessibilityElement = document.createElement('div');
  accessibilityElement.setAttribute('aria-label', 'Accessible description of the element');
  // Existing function code...
  return accessibilityElement;
}

// New function: Check if a link is accessible
function isLinkAccessible(link) {
  if (!link) return false;
  // Simple validation: link should have href and either text content or aria-label
  const hasHref = link.hasAttribute && link.hasAttribute('href');
  const hasAccessibleText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute && (link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby'));
  
  return hasHref && (hasAccessibleText || hasAriaLabel);
}

module.exports = {
  ...main,

  addressAccessibilityIssues: (container, report) => {
    // If report is provided, use the detailed implementation
    if (report) {
      return implementAccessibilityFixesFromReport(container, report);
    }

    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
      const body = container.querySelector('body');
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.appendChild(newMain);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // Validate accessibility report
    const validationResult = validateAccessibilityReport(container);
    if (validationResult && validationResult.length > 0) {
      console.warn(`Accessibility report contains ${validationResult.length} remaining issues`);
    }

    if (fixes.langAdded) {
      console.info('Lang attribute added to HTML element');
    }

    if (fixes.mainLandmarkAdded) {
      console.info('Main landmark added');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      console.info(`Fixed ${landmarkFixesCount} unique landmarks`);
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      console.info(`Fixed accessible names for ${svgFixes} SVGs`);
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      console.info(`Fixed fake link issues for ${fakeLinkFixes} elements`);
    }

    return fixes;
  },

  implementAccessibilityFixesFromReport,

  focusTrap,

  newExportedFunction,

  // Preserved from origin/main
  myAccessibleFunction,

  // New accessibility functions
  isLinkAccessible
};