// Accessible Insight Report Interface - Dependency Graph Rendering
// Line 13: Address accessibility issues from insight report — CONTINUING

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

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

// Accessibility function to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || table.firstChild);
      }
    }
    table.querySelectorAll('td').forEach(td => {
      if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
        td.setAttribute('scope', 'col');
      }
    });
  });
}

// Accessibility function to ensure proper main landmark
function addMainLandmark() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else {
      body.appendChild(mainElement);
    }
  }
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

    // Ensure buttons are keyboard accessible
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('tabindex') && !button.hasAttribute('aria-label')) {
        // Button is accessible by default
      }
    });

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