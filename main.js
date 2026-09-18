// TODO: Implement function for adding proper landmark regions

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

// Main application logic
function main() {
  console.log('Application started');
}

// Harvest and upgrade logic
function harvest(resource, amount = 1) {
  if (!resource) {
    throw new Error('Resource is required');
  }
  const harvestedAmount = Math.max(0, amount);
  return {
    resource,
    amount: harvestedAmount,
    timestamp: Date.now()
  };
}

function upgrade(currentLevel, upgradeCost) {
  if (typeof currentLevel !== 'number' || currentLevel < 0) {
    throw new Error('Invalid current level');
  }
  if (typeof upgradeCost !== 'number' || upgradeCost < 0) {
    throw new Error('Invalid upgrade cost');
  }
  return {
    previousLevel: currentLevel,
    newLevel: currentLevel + 1,
    cost: upgradeCost,
    timestamp: Date.now()
  };
}

// Accessibility helper function to announce dynamic content changes to screen readers
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  document.body.appendChild(announcer);
  return announcer;
}

function announceToScreenReader(message, priority = 'polite') {
  const announcer = ... || createAnnouncer();
  ... priority);
  announcer.textContent = message;

  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = ...
  announcer.id = 'sr-announcer';
  ... 'polite');
  ... 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = ...
  ...
  return announcer;
}

// Trap focus within modal dialogs for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, ...
  );
  const firstFocusable = ...
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          ...
          e.preventDefault();
        }
      }
    }
    // Close on Escape key
    if (e.key === 'Escape') {
      ... 'true');
      element.style.display = 'none';
      ... handleTabKey);
    }
  }

  ... handleTabKey);
  firstFocusable && ...
}

// Update ARIA expanded state for collapsible sections
function toggleAriaExpanded(element) {
  const isExpanded = ... === 'true';
  ... !isExpanded);
  
  const controlsId = ...
  if (controlsId) {
    const controlledElement = ...
    if (controlledElement) {
      ... isExpanded);
    }
  }
}

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = 'elem-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
};

  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (controlledElement) {
      controlledElement.setAttribute('aria-hidden', isExpanded);
    }
  });

  return { valid: issues.length === 0, issues };
};

// Ensure unique landmark ARIA labels
const ensureUniqueLandmarkLabels = (document) => {
  const landmarks = document.querySelectorAll('nav, header, footer, aside, main, [role="navigation"], [role="banner"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const labelMap = new Map();
  const duplicates = [];
  
  landmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || '';
    if (label && labelMap.has(label)) {
      duplicates.push({ label, element: landmark });
    } else {
      labelMap.set(label, landmark);
    }
  });
  
  // Assign unique labels to duplicates
  duplicates.forEach((dup, index) => {
    const uniqueLabel = `${dup.label}-${index + 1}`;
    dup.element.setAttribute('aria-label', uniqueLabel);
  });
  
  return duplicates;
};

// Get landmark accessibility information
const getLandmarkAccessibilityInfo = (document) => {
  const landmarks = document.querySelectorAll('[role], nav, header, footer, aside, main');
  return Array.from(landmarks).map(el => ({
    tag: el.tagName.toLowerCase(),
    role: el.getAttribute('role'),
    ariaLabel: el.getAttribute('aria-label'),
    ariaLabelledby: el.getAttribute('aria-labelledby'),
    id: el.id
  }));
};

function getLangAttribute(element) {
  if (element && element.getAttribute) {
    return element.getAttribute('lang') || document.documentElement.lang;
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang') || 'en';
  }
}

// Handle missing alt text for images
function ... {
  const images = ...
  images.forEach((img, index) => {
    img.setAttribute('alt', `Image ${index + 1} - description unavailable`);
    img.setAttribute('role', 'presentation');
  });

  // Add warning for accessibility audit
  if (images.length > 0) {
    ... ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

function addMainLandmark() {
  if (!document.querySelector('main') && !document.querySelector('[role="main"]')) {
    const main = document.createElement('main');
    main.id = 'main';
    document.body.appendChild(main);
  }
}

// New function to get and set the lang attribute on an element
function getLangAttribute(element) {
  return element.getAttribute('lang') || document.documentElement.lang;
}

// New function to create an in-page button
function createInPageButton(options) {
  if (!options || !options.id || !options.label) {
    throw new Error('Options must include "id" and "label".');
  }

  const button = document.createElement('a');
  button.href = `#${options.id}`;
  button.textContent = options.label;
  ...

  if (getBrowserName() !== 'firefox') {
    // Non-Firefox browsers have a built-in aria-label for anchors, no need to duplicate
    button.setAttribute('aria-label', options.label);
  }

  // Accessibility improvements
  button.setAttribute('aria-label', text); // Add aria-label for screen readers

  return button;
}

// Helper function to detect the current browser
function getBrowserName() {
  const userAgent = navigator.userAgent;
  if ... !== -1) return 'firefox';
  if ... !== -1) return 'chrome';
  if ... !== -1) return 'safari';
  if (userAgent.indexOf('edge') !== -1) return 'edge';
  return 'unknown';
}

// New function to get accessible name for an SVG
function getSvgAccessibleName(svg) {
  const title = ...
  if (title) return title.textContent;
  const id = svg.id || '';
  if (id) return `SVG with id ${id}`;
  return '';
}

// New function to set accessible attributes on an SVG
function setSvgAttributes(svg, name) {
  if ... {
    ... name);
  }
  let title = ...
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
}

// Accessibility function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = ...
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg) || `SVG graphic ${index + 1}`;
    setSvgAttributes(svg, name);
  });
}

// Accessibility function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = ... footer, nav, aside, section[aria-label], ...
  landmarks.forEach(landmark => {
    const tagName = ...
    if ((tagName === 'header' || tagName === 'footer') && ... {
      // Keep multiple headers/footers outside main
    } else if ... || ... {
      // Ensure main is not nested incorrectly
      const nestedMain = ...
      if (nestedMain && ... && ... {
        const parent = landmark.parentNode;
        if (parent) {
          parent.insertBefore(nestedMain, ...
        }
      }
    }
  });
}

// Accessibility function to fix fake link issues
function fixFakeLinkIssue() {
  const fakeLinks = ... a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = ...
    const isButton = link.getAttribute('role') === 'button' || link.tagName === 'BUTTON';
    if ((onclick || isButton) && ... {
      link.setAttribute('role', 'button');
      if (onclick) {
        ... '0');
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return {
      destroy: () => {
        element.removeEventListener('keydown', handleKeyDown);
        originalFocus.focus();
      }
    };
  };

  return {
    create: createTrap,
    
    // Alias for create to match the expected API
    trapFocus: createTrap,
    
    // Helper method to check if an element is focusable
    isFocusable: (element) => {
      if (!element) return false;
      
      return (
        element.tabIndex >= 0 || 
        (element.tagName === 'A' && element.href) ||
        (element.tagName === 'BUTTON' && !element.disabled) ||
        (element.tagName === 'INPUT' && !element.disabled) ||
        (element.tagName === 'TEXTAREA' && !element.disabled) ||
        (element.tagName === 'SELECT' && !element.disabled)
      );
    }
  };
}

// Render a dependency graph visualization with accessibility support
function renderDependencyGraph(container, graphData) {
  // ... Existing functions and exports ...
}

// Update existing dependency graph with new data
function updateDependencyGraph(graphElement, newData) {
  // ... Existing functions and exports ...
}

// Update document.readyState check to call new functions as well
function initAccessibility() {
  // ... Existing functions and exports ...

  // Add new accessibility functions from insight report
  addLangAttribute();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();

  // ... Existing functions and exports for initAccessibility ...
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    // ... Existing functions and exports for DOMContentLoaded event ...

    // Add new accessibility functions from insight report
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    createInPageButton({ id: 'example', label: 'Example Link' });

    // ... Existing functions and exports for DOMContentLoaded event ...
  });
}

// ... Existing exports ...

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return timestamp + '-' + randomPart;
}

// Validate table accessibility (REACT_027)
const validateTableAccessibilityDetailed = (tableElement) => {
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }

  const errors = [];
  
  // Check for caption
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    errors.push('Table missing caption');
  }
  
  // Check for summary or aria-label
  const summary = tableElement.getAttribute('summary') || tableElement.getAttribute('aria-label');
  if (!summary) {
    errors.push('Table missing summary or aria-label');
  }
  
  // Check headers
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table missing header cells');
  }
  
  // Check scope attributes on header cells
  headers.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
  const buttonsAsLinks = ... a[onclick]');
  ... => {
    if (element.tagName === 'BUTTON' && ... {
      element.removeAttribute('href');
    }
  });
}

// Fix table structure issues for accessibility
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;
    
    if (hasThead || hasTbody) return;
    
    // Check if first row looks like a header row
    const firstRow = table.rows[0];
    if (!firstRow) return;
    
    let isHeaderRow = true;
    for (let i = 0; i < firstRow.cells.length; i++) {
      const cell = firstRow.cells[i];
      if (cell.tagName === 'TH') {
        isHeaderRow = true;
      } else if (cell.textContent.trim() === '') {
        isHeaderRow = true;
      } else {
        isHeaderRow = false;
        break;
      }
    }
    
    if (isHeaderRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
      
      const tbody = document.createElement('tbody');
      for (let i = 1; i < table.rows.length; i++) {
        tbody.appendChild(table.rows[i].cloneNode(true));
      }
      table.appendChild(tbody);
    }
  });
}

// Add main landmark for accessibility
function addMainLandmark() {
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const main = document.createElement('main');
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.appendChild(main);
  }
}

// Render a dependency graph visualization with accessibility support
function renderDependencyGraph(container, graphData) {
  if (!container || typeof container.appendChild !== 'function') {
    ... Invalid container element');
    return null;
  }
  
  const graphWrapper = ...
  graphWrapper.className = 'dependency-graph';
  ... 'figure');
  ... 'Dependency graph');
  
  const title = ...
  title.textContent = 'Dependency Graph';
  graphWrapper.appendChild(title);
  
  const description = ...
  description.className = 'sr-only';
  description.textContent = 'This visualization shows the dependencies and their relationships.';
  ...
  
  const list = document.createElement('ul');
  list.setAttribute('aria-label', 'Dependency list');

  if (graphData && Array.isArray(graphData)) {
    ... index) => {
      const listItem = ...
      const itemName = item && item.name ? item.name : `Node ${index + 1}`;
      listItem.textContent = itemName;

      if (item && item.dependencies && Array.isArray(item.dependencies) && item.dependencies.length > 0) {
        const subList = document.createElement('ul');
        subList.setAttribute('aria-label', `Dependencies for ${itemName}`);
        ... depIndex) => {
          const depItem = ...
          depItem.textContent = typeof dep === 'string' ? dep : dep.name || `Dependency ${depIndex + 1}`;
          ...
        });
        ...
      }
      
      ...
    });
  }
  
  ...
  ...
  
  return graphWrapper;
}

// Update existing dependency graph with new data
function ... newData) {
  if (!graphElement || ... {
    ... Invalid graph element');
    return false;
  }
  
  const newGraph = ... newData);
  if (!newGraph) return false;
  
  ... graphElement);
  return true;
}

/**
 * Load table data into the application
 * @param {Array} tables - Array of table objects to load
 */
function loadTables(tables) {
  if (!Array.isArray(tables)) {
    throw new Error('Tables must be an array');
  }
  appData.tables = tables;
  return true;
}

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables() {
  return appData.tables;
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
  return { ...appData.config };
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have headers defined'
      });
    }
  };

  // Check for missing alt text on images
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    const issue = {
      type: 'missing-alt-text',
      severity: 'critical',
      count: imagesWithoutAlt.length,
      description: 'Images without alt text were found',
      elements: Array.from(imagesWithoutAlt).map((img, index) => ({
        tag: img.tagName.toLowerCase(),
        src: img.getAttribute('src') || '',
        index
      })),
      recommendation: 'Add descriptive alt attributes to all images.'
    };
    report.issues.push(issue);
    report.summary.critical += imagesWithoutAlt.length;
  }

  // Check for missing form labels
  const unlabeledInputs = document.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby]):not([id]), input[id]:not([aria-label]):not([aria-labelledby])'
  );
  let missingLabelCount = 0;
  unlabeledInputs.forEach(input => {
    const id = input.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) missingLabelCount++;
    } else {
      missingLabelCount++;
    }
  });
  if (missingLabelCount > 0) {
    const issue = {
      type: 'missing-form-labels',
      severity: 'critical',
      count: missingLabelCount,
      description: 'Form inputs without associated labels were found',
      recommendation: 'Associate every form input with a label element or provide aria-label/aria-labelledby.'
    };
    report.issues.push(issue);
    report.summary.critical += missingLabelCount;
  }

  // Check for missing lang attribute
  if (!document.documentElement.hasAttribute('lang')) {
    const issue = {
      type: 'missing-lang-attribute',
      severity: 'serious',
      count: 1,
      description: 'The HTML element is missing the lang attribute',
      recommendation: 'Add a lang attribute to the html element to identify the page language.'
    };
    report.issues.push(issue);
    report.summary.serious += 1;
  }

  // Check for duplicate IDs
  const allElements = document.querySelectorAll('[id]');
  const idMap = {};
  allElements.forEach(el => {
    const id = el.id;
    if (id) {
      if (!idMap[id]) idMap[id] = 0;
      idMap[id]++;
    }
  });
  const duplicateIds = Object.keys(idMap).filter(id => idMap[id] > 1);
  if (duplicateIds.length > 0) {
    const issue = {
      type: 'duplicate-ids',
      severity: 'serious',
      count: duplicateIds.length,
      description: `Duplicate IDs found: ${duplicateIds.join(', ')}`,
      elements: duplicateIds,
      recommendation: 'Ensure all IDs are unique within the document.'
    };
    report.issues.push(issue);
    report.summary.serious += duplicateIds.length;
  }

  // Check for missing main landmark
  const mainLandmarks = document.querySelectorAll('main');
  if (mainLandmarks.length === 0) {
    const issue = {
      type: 'missing-main-landmark',
      severity: 'moderate',
      count: 1,
      description: 'No main landmark was found on the page',
      recommendation: 'Add a main element to identify the primary content of the page.'
    };
    report.issues.push(issue);
    report.summary.moderate += 1;
  }

  // Check for empty links
  const links = document.querySelectorAll('a');
  let emptyLinkCount = 0;
  links.forEach(link => {
    const text = (link.textContent || '').trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    if (!text && !ariaLabel && !title) emptyLinkCount++;
  });
  if (emptyLinkCount > 0) {
    const issue = {
      type: 'empty-links',
      severity: 'serious',
      count: emptyLinkCount,
      description: 'Links without accessible text were found',
      recommendation: 'Provide descriptive text, aria-label, or title for all links.'
    };
    report.issues.push(issue);
    report.summary.serious += emptyLinkCount;
  }

  // Check for empty buttons
  const buttons = document.querySelectorAll('button');
  let emptyButtonCount = 0;
  buttons.forEach(button => {
    const text = (button.textContent || '').trim();
    const ariaLabel = button.getAttribute('aria-label');
    const title = button.getAttribute('title');
    if (!text && !ariaLabel && !title) emptyButtonCount++;
  });
  if (emptyButtonCount > 0) {
    const issue = {
      type: 'empty-buttons',
      severity: 'critical',
      count: emptyButtonCount,
      description: 'Buttons without accessible names were found',
      recommendation: 'Provide visible text, aria-label, or title for all buttons.'
    };
    report.issues.push(issue);
    report.summary.critical += emptyButtonCount;
  }

  // Check for headings hierarchy issues
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let headingSkipCount = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && level > previousLevel + 1) {
      headingSkipCount++;
    }
    previousLevel = level;
  });
  if (headingSkipCount > 0) {
    const issue = {
      type: 'heading-hierarchy',
      severity: 'moderate',
      count: headingSkipCount,
      description: 'Heading levels skip one or more levels',
      recommendation: 'Use heading levels in sequential order without skipping levels.'
    };
    report.issues.push(issue);
    report.summary.moderate += headingSkipCount;
  }

  // Check for missing document title
  if (!document.title || document.title.trim() === '') {
    const issue = {
      type: 'missing-title',
      severity: 'serious',
      count: 1,
      description: 'The document is missing a title',
      recommendation: 'Provide a descriptive title element for the page.'
    };
    report.issues.push(issue);
    report.summary.serious += 1;
  }

  // Check for SVGs without accessible names
  const svgsWithoutName = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby]):not([title])');
  if (svgsWithoutName.length > 0) {
    const issue = {
      type: 'svg-accessible-name',
      severity: 'serious',
      count: svgsWithoutName.length,
      description: 'SVGs without accessible names were found',
      recommendation: 'Add aria-label, aria-labelledby, or a title element to all meaningful SVGs.'
    };
    report.issues.push(issue);
    report.summary.serious += svgsWithoutName.length;
  }

  // Calculate total issues
  report.summary.total = report.summary.critical + report.summary.serious +
                         report.summary.moderate + report.summary.minor;

  // Announce the report results to screen readers
  announceToScreenReader(
    `Accessibility report generated. Found ${report.summary.total} issues: ` +
    `${report.summary.critical} critical, ${report.summary.serious} serious, ` +
    `${report.summary.moderate} moderate, ${report.summary.minor} minor.`,
    'assertive'
  );

  // Log the report to the console for developers
  console.log('Accessibility Report:', report);

  return report;
}

// Update document.readyState check to call new functions as well
function initAccessibility() {
  if (document.readyState === 'loading') {
    ... () => {
      addLangAttribute();
      ...
      addMainLandmark();
      ...
      ensureUniqueLandmarks();
      fixFakeLinkIssue();
      createInPageButton({ id: 'example', label: 'Example Link' });

      // Additional accessibility features from origin/main
      announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
    });
  } else {
    // Document already loaded
    addLangAttribute();
    ...
    addMainLandmark();
    ...
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    createInPageButton({ id: 'example', label: 'Example Link' });
    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  }
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  ... () => {
    // Ensure all form inputs have associated labels
    const inputs = ... select:not([id]), textarea:not([id])');
    ... index) => {
      const id = input.id || ...
      input.id = id;
      
      if ... && ... {
        const label = ...
        label.htmlFor = id;
        label.textContent = `Input ${index + 1}`;
        label.style.cssText = ...
        ... input);
      }
    });

    // Ensure buttons are keyboard accessible
    const buttons = ...
    buttons.forEach(button => {
      if ... && ... {
        // Button is accessible by default
      }
    });

    // Handle missing alt text for images
    ...

    // Run accessibility improvements
    addLangAttribute();
    ...
    addMainLandmark();
    ...
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    createInPageButton({ id: 'example', label: 'Example Link' });
    
    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  });
}

// Add proper landmark regions to ensure accessibility structure
function addProperLandmarkRegions() {
  // Ensure there is exactly one main landmark
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');
    const body = document.body;
    if (body) {
      // Move existing content (excluding header/footer/nav) into main
      const nodesToMove = [];
      for (let i = 0; i < body.childNodes.length; i++) {
        const child = body.childNodes[i];
        if (child.nodeType === 1) {
          const tag = child.tagName && child.tagName.toLowerCase();
          if (tag !== 'header' && tag !== 'footer' && tag !== 'nav' && tag !== 'aside') {
            nodesToMove.push(child);
          }
        }
      }
      body.insertBefore(main, body.firstChild);
      nodesToMove.forEach(node => main.appendChild(node));
    }
  } else if (mains.length > 1) {
    // Keep only the first main, move others' content into it
    const firstMain = mains[0];
    for (let i = 1; i < mains.length; i++) {
      const extraMain = mains[i];
      while (extraMain.firstChild) {
        firstMain.appendChild(extraMain.firstChild);
      }
      extraMain.parentNode.removeChild(extraMain);
    }
  }

  // Ensure complementary (aside) landmarks have aria-label
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
      aside.setAttribute('aria-label', `Complementary content ${index + 1}`);
    }
  });

  // Ensure navigation landmarks have aria-label
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });

  // Ensure banner landmarks (header) have aria-label if there are multiple
  const headers = document.querySelectorAll('header');
  if (headers.length > 1) {
    headers.forEach((header, index) => {
      if (!header.hasAttribute('aria-label') && !header.hasAttribute('aria-labelledby')) {
        header.setAttribute('aria-label', `Banner ${index + 1}`);
      }
    });
  }

  // Ensure contentinfo landmarks (footer) have aria-label if there are multiple
  const footers = document.querySelectorAll('footer');
  if (footers.length > 1) {
    footers.forEach((footer, index) => {
      if (!footer.hasAttribute('aria-label') && !footer.hasAttribute('aria-labelledby')) {
        footer.setAttribute('aria-label', `Content info ${index + 1}`);
      }
    });
  }
}

// Export functions that might be required by other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    main,
    helperFunction,
    formatData,
    validateInput,
    announceToScreenReader,
    trapFocus,
    toggleAriaExpanded,
    handleMissingAltText,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    renderDependencyGraph,
    updateDependencyGraph,
    initAccessibility,
    createInPageButton,
    getBrowserName,
    getLangAttribute,
    getSvgAccessibleName,
    setSvgAttributes,
    createAnnouncer
  };
}

// Initialize accessibility if not already done by the event listener
if (typeof document !== 'undefined') {
  initAccessibility();
}