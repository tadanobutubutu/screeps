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
    addProperLandmarkRegions
  };
}

// Initialize accessibility if not already done by the event listener
if (typeof document !== 'undefined') {
  initAccessibility();
}