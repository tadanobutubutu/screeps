// main.js - Existing code file
// TODO: This is the existing code that needs to be preserved

// Accessible Insight Report Interface - Dependency Graph Rendering
// Line 13: Address accessibility issues from insight report — CONTINUING

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

// Existing functionality preserved
function existingFunction() {
  return 'existing';
}

// Main application logic
function main() {
  console.log('Application started');
}

// Accessibility helper function to announce dynamic content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
  
  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(announcer);
  return announcer;
}

// Trap focus within modal dialogs for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
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
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    // Close on Escape key
    if (e.key === 'Escape') {
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
      document.removeEventListener('keydown', handleTabKey);
    }
  }

  document.addEventListener('keydown', handleTabKey);
  firstFocusable && firstFocusable.focus();
}

// Update ARIA expanded state for collapsible sections
function toggleAriaExpanded(element) {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);
  
  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (controlledElement) {
      controlledElement.setAttribute('aria-hidden', isExpanded);
    }
  }
}

// Handle missing alt text for images
function handleMissingAltText(container) {
  const images = container.querySelectorAll('img:not([alt])');
  images.forEach((img, index) => {
    img.setAttribute('alt', `Image ${index + 1} - description unavailable`);
    img.setAttribute('role', 'presentation');
  });
  
  // Add warning for accessibility audit
  if (images.length > 0) {
    console.warn(`Accessibility: ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// ... Existing functions and exports ...

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
  button.classList.add('in-page-button');

  if (getBrowserName() !== 'firefox') {
    // Non-Firefox browsers have a built-in aria-label for anchors, no need to duplicate
    button.setAttribute('aria-label', options.label);
  }

  return button;
}

// Helper function to detect the current browser
function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('firefox') !== -1) return 'firefox';
  if (userAgent.indexOf('chrome') !== -1) return 'chrome';
  if (userAgent.indexOf('safari') !== -1) return 'safari';
  if (userAgent.indexOf('edge') !== -1) return 'edge';
  return 'unknown';
}

// New function to get accessible name for an SVG
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const id = svg.id || '';
  if (id) return `SVG with id ${id}`;
  return '';
}

// New function to set accessible attributes on an SVG
function setSvgAttributes(svg, name) {
  if (!svg.hasAttribute('aria-label')) {
    svg.setAttribute('aria-label', name);
  }
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
}

// Accessibility function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg) || `SVG graphic ${index + 1}`;
    setSvgAttributes(svg, name);
  });
}

// Accessibility function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside, section[aria-label], section[aria-labelledby]');
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if ((tagName === 'header' || tagName === 'footer') && !landmark.closest('main')) {
      // Keep multiple headers/footers outside main
    } else if (landmark.querySelector('main') || landmark.closest('main')) {
      // Ensure main is not nested incorrectly
      const nestedMain = landmark.querySelector('main');
      if (nestedMain && !landmark.closest('section') && !landmark.closest('article')) {
        const parent = landmark.parentNode;
        if (parent) {
          parent.insertBefore(nestedMain, landmark.nextSibling);
        }
      }
    }
  });
}

// Accessibility function to fix fake link issues
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const isButton = link.getAttribute('role') === 'button' || link.tagName === 'BUTTON';
    if ((onclick || isButton) && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      if (onclick) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  const buttonsAsLinks = document.querySelectorAll('button[href], a[onclick]');
  buttonsAsLinks.forEach(element => {
    if (element.tagName === 'BUTTON' && element.hasAttribute('href')) {
      element.removeAttribute('href');
    }
  });
}

// Render a dependency graph visualization with accessibility support
function renderDependencyGraph(container, graphData) {
  if (!container || typeof container.appendChild !== 'function') {
    console.warn('renderDependencyGraph: Invalid container element');
    return null;
  }
  
  const graphWrapper = document.createElement('div');
  graphWrapper.className = 'dependency-graph';
  graphWrapper.setAttribute('role', 'figure');
  graphWrapper.setAttribute('aria-label', 'Dependency graph');
  
  const title = document.createElement('h3');
  title.textContent = 'Dependency Graph';
  graphWrapper.appendChild(title);
  
  const description = document.createElement('p');
  description.className = 'sr-only';
  description.textContent = 'This visualization shows the dependencies and their relationships.';
  graphWrapper.appendChild(description);
  
  const list = document.createElement('ul');
  list.setAttribute('aria-label', 'Dependency list');
  
  if (graphData && Array.isArray(graphData)) {
    graphData.forEach((item, index) => {
      const listItem = document.createElement('li');
      const itemName = item && item.name ? item.name : `Node ${index + 1}`;
      listItem.textContent = itemName;
      
      if (item && item.dependencies && Array.isArray(item.dependencies) && item.dependencies.length > 0) {
        const subList = document.createElement('ul');
        subList.setAttribute('aria-label', `Dependencies for ${itemName}`);
        item.dependencies.forEach((dep, depIndex) => {
          const depItem = document.createElement('li');
          depItem.textContent = typeof dep === 'string' ? dep : dep.name || `Dependency ${depIndex + 1}`;
          subList.appendChild(depItem);
        });
        listItem.appendChild(subList);
      }
      
      list.appendChild(listItem);
    });
  }
  
  graphWrapper.appendChild(list);
  container.appendChild(graphWrapper);
  
  return graphWrapper;
}

// Update existing dependency graph with new data
function updateDependencyGraph(graphElement, newData) {
  if (!graphElement || !graphElement.parentNode) {
    console.warn('updateDependencyGraph: Invalid graph element');
    return false;
  }
  
  const newGraph = renderDependencyGraph(document.createElement('div'), newData);
  if (!newGraph) return false;
  
  graphElement.parentNode.replaceChild(newGraph, graphElement);
  return true;
}

// Generate a report based on accessibility issues found in the page
function generateAccessibilityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    issues: [],
    summary: {
      total: 0,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
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
    document.addEventListener('DOMContentLoaded', () => {
      addLangAttribute();
      fixTableStructureIssues();
      addMainLandmark();
      addSvgAccessibleNames();
      ensureUniqueLandmarks();
      fixFakeLinkIssue();
      createInPageButton({ id: 'example', label: 'Example Link' });
      
      // Additional accessibility features from origin/main
      announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
    });
  } else {
    // Document already loaded
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    createInPageButton({ id: 'example', label: 'Example Link' });
    
    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  }
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure all form inputs have associated labels
    const inputs = document.querySelectorAll('input:not([id]), select:not([id]), textarea:not([id])');
    inputs.forEach((input, index) => {
      const id = input.id || `auto-input-${index}`;
      input.id = id;
      
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = `Input ${index + 1}`;
        label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        input.parentNode.insertBefore(label, input);
      }
    });

    // Ensure buttons are keyboard accessible
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('tabindex') && !button.hasAttribute('aria-label')) {
        // Button is accessible by default
      }
    });

    // Handle missing alt text for images
    handleMissingAltText(document.body);

    // Run accessibility improvements
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    createInPageButton({ id: 'example', label: 'Example Link' });
    
    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  });
}

// Export functions that might be required by other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    main,
    existingFunction,
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
    generateAccessibilityReport
  };
}

// Initialize accessibility if not already done by the event listener
if (typeof document !== 'undefined') {
  initAccessibility();
}