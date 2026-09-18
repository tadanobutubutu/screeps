// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

// Accessible Insight Report Interface - Dependency Graph Rendering
// Line 13: Address accessibility issues from insight report — CONTINUING

// main.js - Entry point for the application

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch)
// Code for version 1 implementation goes here.

let newFeatureV1 = (param) => {
  // Version 1 implementation of the new feature
  console.log('Version 1 feature executed with:', param);
  return { version: 1, status: 'active', data: param };
};

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// Addressed accessibility issues from insight report:
// REACT_015: Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) htmlElement.setAttribute('lang', 'en');
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
  });

  // Add warning for accessibility audit
  if (images.length > 0) {
    console.warn(`Accessibility: ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// Update or create the affected functions to be accessible
// Address additional accessibility issues by fixing table structure issues

function generateUniqueId(prefix = 'id', length = 9) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = `${prefix}-`;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
  if (!landmarks || !Array.isArray(landmarks)) {
    throw new Error('Landmarks array is required');
  }

  const ids = [];
  const usedIds = new Set();

  landmarks.forEach((landmark, index) => {
    if (!landmark) {
      return;
    }

    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = `${prefix}-${index}`;
        landmark.id = newId;
        usedIds.add(newId);
        ids.push(newId);
      } else {
        usedIds.add(landmark.id);
        ids.push(landmark.id);
      }
    } else {
      let generatedId = generateUniqueId(prefix);
      while (usedIds.has(generatedId)) {
        generatedId = generateUniqueId(prefix);
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

function setLanguageAttribute(languageCode = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = languageCode;
  }
}

export function anotherFunction() {
  // More existing functionality
  return 'anotherFunction executed';
}

function addDependencyGraphAccessibility(container) {
  const container = document.querySelector('.dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Wrap tables in a main element if not already
    if (!table.closest('main')) {
      const main = document.createElement('main');
      table.parentNode.insertBefore(main, table);
      main.appendChild(table);
    }
  });
}

function validateTableAccessibility(tables) {
  tables.forEach((table) => {
    // Validate that tables have proper accessibility attributes
    if (!table.getAttribute('role') && !table.querySelector('caption')) {
      // Add role="table" for accessibility
      table.setAttribute('role', 'table');
    }
    // Ensure proper table structure
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.getAttribute('scope')) {
        // Determine if header is for column or row
        const parent = th.parentElement;
        if (parent && parent.tagName === 'TR') {
          const cells = Array.from(parent.children);
          const thIndex = cells.indexOf(th);
          if (thIndex === 0) {
            th.setAttribute('scope', 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        }
      }
    });
  });
}

export function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      body.insertBefore(mainElement, body.firstChild);
    }
  }
  return mainElement;
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // Merge the changes from both branches
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleText = title.textContent;
        if (titleText) {
          svg.setAttribute('aria-label', titleText);
        }
      }
    }
  });
}

function ensureUniqueMainLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const section = document.createElement('section');
      while (mainElements[i].firstChild) {
        section.appendChild(mainElements[i].firstChild);
      }
      mainElements[i].parentNode.replaceChild(section, mainElements[i]);
    }
  }
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    // Replace the anchor with a button for accessibility
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = fakeLink.textContent;
    fakeLink.parentNode.replaceChild(button, fakeLink);
  });
}

function addSvgAccessibilityProps(svgElement, options = {}) {
  if (!svgElement) {
    return;
  }

  const { label, role = 'img' } = options;

  if (role) {
    svgElement.setAttribute('role', role);
  }

  if (label) {
    svgElement.setAttribute('aria-label', label);
  }

  // Make SVG focusable for keyboard navigation
  svgElement.setAttribute('tabindex', '0');

  return svgElement;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  return '';
}

function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    // Skip if already has accessibility attributes
    const hasRole = svg.hasAttribute('role');
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby') || svg.hasAttribute('aria-describedby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      // Add default accessibility props to bare SVGs
      addSvgAccessibilityProps(svg, { label: 'Decorative SVG' });
    }
  });
}

export function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute('en');

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

// Comprehensive accessibility audit function
function performAccessibilityAudit() {
  const auditResults = {
    errors: [],
    warnings: [],
    passed: true
  };
  
  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt]):not([role="presentation"])');
  if (imagesWithoutAlt.length > 0) {
    auditResults.errors.push(
      `Found ${imagesWithoutAlt.length} image(s) without alt text. ` +
      `Consider adding descriptive alt text or marking decorative images with role="presentation".`
    );
  }
  
  // Check for skipping navigation regions
  const headers = document.querySelectorAll('header');
  if (headers.length > 0 && !headers[0].querySelector('nav')) {
    auditResults.warnings.push(
      'Header does not contain navigation, which may help keyboard users skip to navigation.'
    );
  }
  
  // Check for focus handling in interactive elements
  const interactiveElements = document.querySelectorAll(
    'button:not([disabled]), [role="button"]:not([aria-disabled="true"]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby') && 
        !element.textContent.trim() && element.tagName !== 'INPUT') {
      auditResults.warnings.push(
        `Interactive element ${element.tagName} may lack accessible name.`
      );
    }
  });
  
  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      auditResults.errors.push(
        `Skipping heading level between ${previousLevel} and ${level} at element: ${heading.textContent}`
      );
    }
    previousLevel = level;
  });
  
  // Check for color contrast (basic check)
  const elementsWithColor = document.querySelectorAll('[style*="color"], [class*="text-"]');
  elementsWithColor.forEach(element => {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;
    
    // Basic validation for elements with both color and background
    if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      // This is a basic check - proper color contrast requires more sophisticated analysis
      const contrast = calculateRelativeLuminance(color) - calculateRelativeLuminance(backgroundColor);
      if (Math.abs(contrast) < 0.5) {
        auditResults.warnings.push(
          `Element ${element.tagName} may have insufficient color contrast.`
        );
      }
    }
  });
  
  // Validate ARIA attributes
  const elementsWithAria = document.querySelectorAll('[aria-*]');
  elementsWithAria.forEach(element => {
    const ariaAttributes = Array.from(element.attributes).filter(attr => attr.name.startsWith('aria-'));
    ariaAttributes.forEach(attr => {
      if (attr.name === 'aria-expanded' && !['true', 'false'].includes(attr.value)) {
        auditResults.errors.push(
          `Element ${element.tagName} has invalid aria-expanded value: ${attr.value}`
        );
      } else if (attr.name === 'aria-selected' && !['true', 'false'].includes(attr.value)) {
        auditResults.errors.push(
          `Element ${element.tagName} has invalid aria-selected value: ${attr.value}`
        );
      } else if (attr.name === 'aria-hidden' && !['true', 'false'].includes(attr.value)) {
        auditResults.errors.push(
          `Element ${element.tagName} has invalid aria-hidden value: ${attr.value}`
        );
      } else if (attr.name === 'aria-level' && isNaN(parseInt(attr.value))) {
        auditResults.errors.push(
          `Element ${element.tagName} has invalid aria-level value: ${attr.value}`
        );
      } else if (attr.name === 'aria-setsize' && isNaN(parseInt(attr.value))) {
        auditResults.errors.push(
          `Element ${element.tagName} has invalid aria-setsize value: ${attr.value}`
        );
      } else if (attr.name === 'aria-posinset' && isNaN(parseInt(attr.value))) {
        auditResults.errors.push(
          `Element ${element.tagName} has invalid aria-posinset value: ${attr.value}`
        );
      }
    });
  });
  
  // Check for proper landmark regions
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  landmarks.forEach(landmark => {
    if (landmark.hasAttribute('role') && landmark.hasAttribute('aria-label')) {
      // Good - has aria-label
    } else if (landmark.hasAttribute('role') && landmark.hasAttribute('aria-labelledby')) {
      // Good - has aria-labelledby
    } else if (landmark.getAttribute('role') !== 'generic') {
      auditResults.warnings.push(
        `Landmark role "${landmark.getAttribute('role')}" may need an accessible name.`
      );
    }
  });
  
  auditResults.passed = auditResults.errors.length === 0;
  return auditResults;
}

// Helper function to calculate relative luminance for contrast checking
function calculateRelativeLuminance(color) {
  const rgb = color.match(/\d+/g);
  if (!rgb || rgb.length < 3) return 0;
  
  const r = parseInt(rgb[0]) / 255;
  const g = parseInt(rgb[1]) / 255;
  const b = parseInt(rgb[2]) / 255;
  
  const adjust = (c) => {
    if (c <= 0.03928) return c / 12.92;
    return Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const lumR = adjust(r) * 0.2126;
  const lumG = adjust(g) * 0.7152;
  const lumB = adjust(b) * 0.0722;
  
  return lumR + lumG + lumB;
}

// Enhanced function to ensure keyboard accessibility for custom components
function enhanceKeyboardAccessibility() {
  const focusableSelectors = 'button, [role="button"], a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = document.querySelectorAll(focusableSelectors);
  
  focusableElements.forEach(element => {
    // Add focus indicator if missing
    if (!element.style.outline && !element.classList.contains('focus-visible')) {
      element.style.outline = '2px solid #007bff';
      element.style.outlineOffset = '2px';
    }
    
    // Ensure element has proper ARIA attributes
    if (element.hasAttribute('role') && element.getAttribute('role') === 'button') {
      if (!element.hasAttribute('aria-pressed')) {
        element.setAttribute('aria-pressed', 'false');
      }
      if (!element.hasAttribute('aria-label') && !element.textContent.trim()) {
        element.setAttribute('aria-label', 'Button');
      }
    }
    
    // Enhance link accessibility
    if (element.tagName === 'A' && element.getAttribute('href') && element.textContent.trim().length < 2) {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('title')) {
        element.setAttribute('aria-label', element.getAttribute('href'));
      }
    }
    
    // Enhance input accessibility
    if (element.tagName === 'INPUT' && !element.hasAttribute('aria-label') && !element.id) {
      element.id = `enhanced-input-${Math.random().toString(36).substr(2, 9)}`;
      const parentLabel = element.closest('label');
      if (parentLabel) {
        parentLabel.setAttribute('for', element.id);
      }
    }
  });
}

// Accessibility function to check and fix viewport meta tag
function fixViewportMeta() {
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.setAttribute('name', 'viewport');
    document.head.appendChild(viewportMeta);
  }
  
  const content = viewportMeta.getAttribute('content');
  if (!content || !content.includes('width=device-width')) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
  }
}

// Accessibility function to ensure proper skip links
function enhanceSkipLinks() {
  const skipLinks = document.querySelectorAll('a[href^="#main"], a[href^="#navigation"], a[href^="#content"]');
  skipLinks.forEach(link => {
    if (!link.textContent.trim()) {
      link.textContent = link.getAttribute('href').replace('#', '') + ' content';
    }
    
    // Ensure skip links are keyboard accessible
    link.setAttribute('tabindex', '0');
  });
}

// Initialize accessibility features on DOM ready with comprehensive improvements
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
  }

  // Enhance SVG accessibility for all SVGs on the page
  enhanceSVGsAccessibility();

    // Handle missing alt text for images
    handleMissingAltText(document.body);

    // Run origin/main accessibility improvements
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();

    // Enhanced accessibility improvements
    fixViewportMeta();
    enhanceSkipLinks();
    enhanceKeyboardAccessibility();

    // Announce initial page load
    announceToScreenReader('Page loaded and comprehensive accessibility features initialized', 'assertive');

    // Perform initial accessibility audit
    const auditResults = performAccessibilityAudit();
    console.log('Accessibility Audit Results:', auditResults);
    
    if (!auditResults.passed) {
      console.warn('Accessibility Issues Found:', auditResults.errors);
    }
  });
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
    performAccessibilityAudit,
    enhanceKeyboardAccessibility,
    fixViewportMeta,
    enhanceSkipLinks
  };
}