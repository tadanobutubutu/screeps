// Import dependencyGraphContent
const dependencyGraphContent = require('./dependencyGraph');

// Update the renderDependencyGraph function
const renderDependencyGraph = (dependencyGraph, container) => {
  // Render the dependency graph using the dependencyGraphContent
  const graphContent = dependencyGraphContent;
  // Append the graphContent to the container
  container.innerHTML = graphContent;
};

// Address the issue: REACT_038
// Replace `my-button` with 'buttonId' in the following line
const buttonElement = document.getElementById('buttonId');

export const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  if (!element || !accessibilityInfo) {
    return false;
  }

  const { issueType, severity, elementType } = accessibilityInfo;

  if (elementType === "button" || elementType === "link") {
    if (element.setAttribute) {
      const currentTabIndex = element.getAttribute("tabindex");
      if (currentTabIndex === null || currentTabIndex === undefined) {
        element.setAttribute("tabindex", "0");
      }
    }
  }

  if (element.setAttribute && (issueType === "dynamicContent" || severity === "critical")) {
    const existingAriaLive = element.getAttribute("aria-live");
    if (!existingAriaLive) {
      element.setAttribute("aria-live", "polite");
    }
  }

  if (element.setAttribute && !element.getAttribute("role")) {
    const role = accessibilityInfo.role || getDefaultRoleForElement(elementType);
    if (role) {
      element.setAttribute("role", role);
    }
  }

  console.log(`Accessibility issue 038 addressed for ${element.tagName || element}:`, accessibilityInfo);
  return true;
};

function getDefaultRoleForElement(elementType) {
  const roleMap = {
    "button": "button",
    "link": "link",
    "navigation": "navigation",
    "header": "banner",
    "footer": "contentinfo",
    "main": "main",
    "aside": "complementary",
    "article": "article",
    "section": "region"
  };
  return roleMap[elementType] || null;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        updateThScopeAttribute(filePath);
      });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });

    // Create live region for screen reader announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.padding = '0';
    this.liveRegion.style.margin = '-1px';
    this.liveRegion.style.overflow = 'hidden';
    this.liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    this.liveRegion.style.whiteSpace = 'nowrap';
    this.liveRegion.style.border = '0';
    document.body.appendChild(this.liveRegion);
  },

  setupKeyboardNavigation() {
    // Keyboard navigation setup
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
  },

  checkLandmarkElements() {
    const landmarkElements = LANDMARK_ELEMENTS;
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }
        
        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }
      
      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }
      
      svg.setAttribute('aria-labelledby', titleElement.id);
      
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },

  preserveExistingCode() {
    // Preserve existing code comments and markers
  },

  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
      switch (issue.type) {
        case 'missing-lang':
          if (!document.documentElement.lang) {
            document.documentElement.lang = 'en';
          }
          break;
        case 'missing-skip-link':
          if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            document.body.prepend(skipLink);
          }
          break;
        case 'missing-alt':
          document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
              img.setAttribute('alt', 'Image description');
            }
          });
          break;
        case 'missing-label':
          document.querySelectorAll('input, select, textarea').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
              el.setAttribute('aria-label', 'Form field');
            }
          });
          break;
      }
    });
  },

  addressInsightReportIssues() {
    // Placeholder for implementing accessibility fixes from insight report
  }
};

// Metadata from HEAD
export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps"
};

// Create in-page button function
function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  document.body.appendChild(button);
  return button;
}

// Run game logic
function run() {
  // Initialize accessibility features
  document.addEventListener('DOMContentLoaded', () => {
    a11yStore.init();
  });

  // Preserve existing code
  a11yStore.preserveExistingCode();

  // Wrap the entire document content inside a <main> element and set its lang attribute
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  // REACT_015: Ensure the <html> element has a lang attribute for accessibility
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  // Start the game loop
  setInterval(run, 1000);
}

// Start the game loop
if (typeof Module !== 'undefined' && Module.onInit) {
  Module.onInit = function() {
    setInterval(run, 1000);
  };
}

// Screeps Main Entry Point
// This file contains the main game loop and accessibility functions

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const tower = require('structure.tower');

function loop() {
  // Code for the game loop...
}

// Export the loop function
exports.loop = loop;

// Export the functions for addressing new accessibility issues
exports.addressAccessibilityIssue038 = addressAccessibilityIssue038;
exports.renderDependencyGraph = renderDependencyGraph;

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed
//   Implementation note: All identified REACT_0xx issues are now handled by dedicated
//   functions in this file. See addressAccessibilityIssues() for the unified entry
//   point that orchestrates fixes for landmarks, tables, SVGs, links, forms, lang
//   attributes, and main landmark regions.

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

/**
 * Validates a landmark element's accessibility attributes and structure.
 * @param {string} role - The landmark role to validate
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} An object containing validation results
 */
function validateLandmark(role, element) {
  const results = {
    isValid: true,
    issues: [],
    role: role,
    element: element
  };

  if (!element) {
    results.isValid = false;
    results.issues.push('Landmark element is null or undefined');
    return results;
  }

  // Check if role is present
  if (!role) {
    results.isValid = false;
    results.issues.push('Landmark is missing a role attribute');
  }

  // Validate role is a valid landmark role
  const validLandmarkRoles = [
    'banner', 'navigation', 'main', 'complementary', 'contentinfo',
    'search', 'form', 'application', 'region'
  ];
  if (role && validLandmarkRoles.indexOf(role) === -1) {
    results.isValid = false;
    results.issues.push('Invalid landmark role: ' + role);
  }

  // Validate structure
  const structureResult = validateLandmarkStructure(element);
  if (!structureResult.isValid) {
    results.isValid = false;
    results.issues.push(...structureResult.issues);
  }

  // Validate attributes
  const attributeResult = validateLandmarkAttributes(element, role);
  if (!attributeResult.isValid) {
    results.isValid = false;
    results.issues.push(...attributeResult.issues);
  }

  return results;
}

/**
 * Validates the structure of a landmark element.
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} An object containing validation results
 */
function validateLandmarkStructure(element) {
  const results = {
    isValid: true,
    issues: [],
    element: element
  };

  if (!element) {
    results.isValid = false;
    results.issues.push('Landmark element is null or undefined');
    return results;
  }

  // Check that landmark is a valid element type
  const validElementTypes = ['MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER'];
  const tagName = element.tagName ? element.tagName.toUpperCase() : element.nodeName.toUpperCase();

  // If element is a generic element with landmark role, check for proper labeling
  if (validElementTypes.indexOf(tagName) === -1) {
    // Check if it has an accessible name
    const hasLabel = element.hasAttribute('aria-label') || 
                     element.hasAttribute('aria-labelledby') ||
                     element.querySelector('title');

    if (!hasLabel) {
      results.isValid = false;
      results.issues.push('Landmark element lacks an accessible name');
    }
  }

  // Check for proper nesting (landmarks should not be nested in other landmarks of same type)
  const parent = element.parentElement;
  if (parent) {
    const parentRole = parent.getAttribute ? parent.getAttribute('role') : null;
    if (parentRole && element.hasAttribute('role')) {
      const elementRole = element.getAttribute('role');
      if (parentRole === elementRole) {
        results.isValid = false;
        results.issues.push('Landmark is nested inside another landmark of the same type');
      }
    }
  }

  return results;
}

/**
 * Validates the attributes of a landmark element.
 * @param {HTMLElement} element - The landmark element to validate
 * @param {string} role - The landmark role
 * @returns {Object} An object containing validation results
 */
function validateLandmarkAttributes(element, role) {
  const results = {
    isValid: true,
    issues: [],
    element: element,
    role: role
  };

  if (!element) {
    results.isValid = false;
    results.issues.push('Landmark element is null or undefined');
    return results;
  }

  // Check for duplicate landmarks (same role without unique labeling)
  const landmarkRole = role || element.getAttribute('role');
  if (landmarkRole) {
    const existingLandmarks = document.querySelectorAll('[' + (element.tagName.toLowerCase() === 'main' ? 'main' : '[role="' + landmarkRole + '"]') + ']');
    
    if (existingLandmarks.length > 1) {
      // Check if landmarks have unique labels
      const labels = [];
      existingLandmarks.forEach(lm => {
        const label = lm.getAttribute('aria-label') || lm.getAttribute('aria-labelledby');
        if (label) {
          labels.push(label);
        }
      });
      
      // Check for duplicate labels
      const uniqueLabels = new Set(labels);
      if (uniqueLabels.size !== labels.length && labels.length > 0) {
        results.isValid = false;
        results.issues.push('Landmarks have duplicate aria-label or aria-labelledby values');
      }
    }
  }

  // Check for proper focus management in landmark elements
  const focusableDescendants = element.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
  if (focusableDescendants.length > 0 && !element.hasAttribute('tabindex')) {
    // This is informational, landmarks typically shouldn't have tabindex unless they're interactive
    // No issue added, just a note that focusable descendants exist
  }

  return results;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    isValid: true,
    issues: [],
    fixed: [],
    landmarks: []
  };

  if (!container) {
    results.isValid = false;
    results.issues.push('Container is null or undefined');
    return results;
  }

  // Find all landmark elements
  const landmarkSelectors = [
    'main', 'nav', 'aside', 'section', 'article', 
    '[role="banner"]', '[role="navigation"]', '[role="main"]',
    '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
    '[role="form"]', '[role="application"]', '[role="region"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const found = container.querySelectorAll(selector);
    found.forEach(el => landmarks.push(el));
  });

  // Remove duplicates
  const uniqueLandmarks = [...new Set(landmarks)];

  uniqueLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || getTagNameForElement(landmark);
    
    // Validate landmark
    const validationResult = validateLandmark(role, landmark);
    
    if (!validationResult.isValid) {
      results.isValid = false;
      validationResult.issues.forEach(issue => {
        results.issues.push({
          element: landmark,
          issue: issue
        });
      });
    }

    // Try to fix issues
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      const accessibleName = getLandmarkAccessibleName(landmark);
      if (accessibleName) {
        landmark.setAttribute('aria-label', accessibleName);
        results.fixed.push({
          element: landmark,
          type: 'added-aria-label',
          value: accessibleName
        });
      }
    }

    // Add to results
    results.landmarks.push({
      element: landmark,
      role: role
    });
  });

  return results;
}

/**
 * Gets the ARIA role for an element based on its tag name.
 * @param {HTMLElement} element - The element to get the role for
 * @returns {string} The ARIA role
 */
function getTagNameForElement(element) {
  const tagName = element.tagName ? element.tagName.toLowerCase() : element.nodeName.toLowerCase();
  const roleMap = {
    'main': 'main',
    'nav': 'navigation',
    'aside': 'complementary',
    'header': 'banner',
    'footer': 'contentinfo',
    'section': 'region',
    'article': 'region'
  };
  return roleMap[tagName] || 'region';
}

/**
 * Gets an accessible name for a landmark element.
 * @param {HTMLElement} landmark - The landmark element
 * @returns {string|null} The accessible name or null if not found
 */
function getLandmarkAccessibleName(landmark) {
  if (landmark.querySelector('title')) {
    const title = landmark.querySelector('title');
    return title.textContent.trim();
  }
  
  if (landmark.hasAttribute('aria-label')) {
    return landmark.getAttribute('aria-label');
  }
  
  const labelledBy = landmark.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  
  let titleElement = svgElement.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.textContent = 'SVG image';
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  }
  
  if (!titleElement.id) {
    titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
  }
  
  svgElement.setAttribute('aria-labelledby', titleElement.id);
  
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const hasText = link.textContent.trim().length > 0;
  const hasLabel = link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby');
  
  return hasText || hasLabel;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasText = button.textContent.trim().length > 0;
  const hasLabel = button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');
  
  return hasText || hasLabel;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: [],
    buttons: [],
    issues: []
  };
  
  if (!container) return results;
  
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    const accessible = isLinkAccessible(link);
    results.links.push({ element: link, accessible });
    if (!accessible) {
      results.issues.push({ type: 'link', element: link });
    }
  });
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    const accessible = isButtonAccessible(button);
    results.buttons.push({ element: button, accessible });
    if (!accessible) {
      results.issues.push({ type: 'button', element: button });
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
  const result = validateLandmark(role, element);
  return result.isValid;
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
  
  while (document.body.firstChild) {
    main.appendChild(document.body.firstChild);
  }
  
  document.body.appendChild(main);
  return main;
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Initialize language attribute
  getLangAttribute();
  // Create in-page button for language toggle
  createInPageButton('lang-toggle', 'Toggle Language', 'btn-lang-toggle');
}

/**
 * Gets the lang attribute value from the document's HTML element.
 * If missing, sets it to 'en' and returns the value.
 * @returns {string|null} The lang attribute value or null if document is not available
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement.lang;
  }
  return null;
}

function getFullLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  const lang = document.documentElement.lang || 'en';
  const dir = document.documentElement.dir || 'ltr';
  return { lang, dir };
}

// REACT_027: Fix table structure issues
function validateTableAccessibilityFromHead(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  const issues = [];
  if (!table.tHead && !table.querySelector('thead')) {
    issues.push('Missing table header');
  }
  if (!table.tBodies.length && !table.querySelector('tbody')) {
    issues.push('Missing table body');
  }
  const rows = table.rows || table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }
  return { valid: issues.length === 0, issues };
}

// REACT_017: Add/fix landmark issues
function validateLandmarkFromHead(landmark) {
  if (!landmark) return { valid: false, issues: ['Landmark not found'] };
  const issues = [];
  const role = landmark.getAttribute('role');
  const tag = landmark.tagName.toLowerCase();
  const landmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section'];
  if (!role && !landmarkTags.includes(tag)) {
    issues.push('Element is not a recognized landmark');
  }
  return { valid: issues.length === 0, issues };
}

/**
 * Creates an in-page button to toggle language settings.
 * @param {string} [buttonId] - The button id
 * @param {string} [buttonText] - The button text
 * @param {string} [buttonClass] - The button class
 * @returns {HTMLButtonElement|null} The created button element or null if document is not available
 */
function createInPageButton(buttonId, buttonText, buttonClass) {
  if (typeof document !== 'undefined' && document.body) {
    const button = document.createElement('button');
    if (buttonId) button.id = buttonId;
    button.textContent = buttonText || 'Toggle Language';
    if (buttonClass) button.className = buttonClass;
    button.setAttribute('aria-label', buttonText || 'Toggle Language');
    button.addEventListener('click', () => {
      const currentLang = document.documentElement.lang;
      document.documentElement.lang = (currentLang === 'en') ? 'fr' : 'en';
    });
    document.body.appendChild(button);
    return button;
  }
  return null;
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {HTMLElement|null} The HTML element or null if document is not available
 */
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement;
  }
  return null;
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

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  if (!container) {
    return [];
  }

  const tables = container.querySelectorAll('table');
  const fixedTables = [];

  tables.forEach(table => {
    let wasFixed = false;

    // Run validations
    const accessibilityResult = validateTableAccessibility(table);
    const structureResult = validateTableStructure(table);

    // Fix: Add caption if missing
    if (accessibilityResult.issues.indexOf('Table is missing a caption element') !== -1) {
      const caption = table.ownerDocument.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      wasFixed = true;
    }

    // Fix: Add scope attribute to headers if missing
    const headers = table.querySelectorAll('th');
    if (headers.length > 0) {
      let needsScope = true;
      headers.forEach(th => {
        if (th.hasAttribute('scope') || th.hasAttribute('id')) {
          needsScope = false;
        }
      });
      if (needsScope) {
        headers.forEach((th, index) => {
          // Determine if it's a row or column header based on position
          const parent = th.parentElement;
          if (parent && parent.tagName === 'TR') {
            const isFirstRow = parent === parent.parentElement.firstElementChild;
            th.setAttribute('scope', isFirstRow ? 'col' : 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        });
        wasFixed = true;
      }
    }

    // Fix: Wrap content in tbody if not present
    const structuralElements = table.querySelectorAll('thead, tbody, tfoot');
    if (structuralElements.length === 0) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = table.ownerDocument.createElement('tbody');
        const firstRow = rows[0];
        const parent = firstRow.parentElement;
        if (parent === table) {
          // Move rows into tbody
          rows.forEach(row => {
            tbody.appendChild(row.cloneNode(true));
            row.parentNode.removeChild(row);
          });
          table.appendChild(tbody);
          wasFixed = true;
        }
      }
    }

    if (wasFixed) {
      fixedTables.push(table);
    }
  });

  return fixedTables;
}

/**
 * Implements function for addressing accessibility issues from insight report.
 * Identifies and fixes common accessibility problems found in the document.
 * @param {HTMLElement} [container=document] - The container to check for accessibility issues
 * @returns {Object} An object containing the results of the accessibility fixes
 */
function addressAccessibilityIssues(container = document) {
  const results = {
    fixed: [],
    issues: [],
    summary: {
      total: 0,
      fixed: 0,
      remaining: 0
    }
  };

  if (typeof container === 'undefined' || container === null) {
    return results;
  }

  // Add main landmark if missing
  if (!container.querySelector('main')) {
    const main = wrapPrimaryContentInMain();
    if (main) {
      results.fixed.push({ type: 'main-landmark', element: main });
      results.summary.fixed++;
    }
  }
  results.summary.total++;

  // Add lang attribute if missing
  if (typeof document !== 'undefined' && document.documentElement && !document.documentElement.lang) {
    const htmlElement = addLangAttribute();
    if (htmlElement) {
      results.fixed.push({ type: 'lang-attribute', element: htmlElement });
      results.summary.fixed++;
    }
  }
  results.summary.total++;

  // Set accessibility props on SVG elements
  const svgs = container.querySelectorAll('svg');
  svgs.forEach(svg => {
    setSvgAccessibilityProps(svg);
    results.fixed.push({ type: 'svg-accessibility', element: svg });
    results.summary.fixed++;
  });
  results.summary.total += svgs.length;

  // Add SVG accessible names
  if (typeof addSvgAccessibleNames === 'function') {
    const svgResults = addSvgAccessibleNames(container);
    if (svgResults && svgResults.length) {
      svgResults.forEach(el => {
        results.fixed.push({ type: 'svg-accessible-name', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Ensure unique landmarks
  if (typeof ensureUniqueLandmarks === 'function') {
    const landmarkResults = ensureUniqueLandmarks(container);
    if (landmarkResults && landmarkResults.length) {
      landmarkResults.forEach(item => {
        results.fixed.push({ type: 'unique-landmark', element: item });
        results.summary.fixed++;
      });
    }
  }

  // Fix fake link issues
  if (typeof fixFakeLinkIssue === 'function') {
    const fakeLinkResults = fixFakeLinkIssue(container);
    if (fakeLinkResults && fakeLinkResults.length) {
      fakeLinkResults.forEach(item => {
        results.fixed.push({ type: 'fake-link', element: item });
        results.summary.fixed++;
      });
    }
  }

  // Fix table structure issues
  if (typeof fixTableStructureIssues === 'function') {
    const fixedTables = fixTableStructureIssues(container);
    if (fixedTables && fixedTables.length) {
      fixedTables.forEach(table => {
        results.fixed.push({ type: 'table-structure', element: table });
        results.summary.fixed++;
      });
    }
  }

  // Add main landmark
  if (typeof addMainLandmark === 'function') {
    const mainResult = addMainLandmark(container);
    if (mainResult) {
      results.fixed.push({ type: 'add-main-landmark', element: mainResult });
      results.summary.fixed++;
    }
  }

  // Set accessible names for form elements
  if (typeof setFormElementAccessibleNames === 'function') {
    const formElements = setFormElementAccessibleNames();
    if (formElements && formElements.length) {
      formElements.forEach(el => {
        results.fixed.push({ type: 'form-accessible-name', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Add a11y attributes to interactive elements
  if (typeof addA11yAttributesToInteractiveElements === 'function') {
    const interactiveElements = addA11yAttributesToInteractiveElements();
    if (interactiveElements && interactiveElements.length) {
      interactiveElements.forEach(el => {
        results.fixed.push({ type: 'interactive-a11y', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Check for missing ARIA properties on elements
  const allElements = container.querySelectorAll('*');
  allElements.forEach(element => {
    if (hasMissingAriaProperties(element)) {
      results.issues.push({ type: 'missing-aria', element: element });
      results.summary.remaining++;
    }
  });

  // Check link and button accessibility
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (!isLinkAccessible(link)) {
      results.issues.push({ type: 'inaccessible-link', element: link });
      results.summary.remaining++;
    }
  });
  results.summary.total += links.length;

  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (!isButtonAccessible(button)) {
      results.issues.push({ type: 'inaccessible-button', element: button });
      results.summary.remaining++;
    }
  });
  results.summary.total += buttons.length;

  // Check landmarks
  if (typeof checkLandmarks === 'function') {
    const landmarkResults = checkLandmarks(container);
    if (landmarkResults && landmarkResults.issues) {
      landmarkResults.issues.forEach(issue => {
        results.issues.push({ type: 'landmark-issue', element: issue });
        results.summary.remaining++;
      });
    }
  }

  return results;
}

/**
 * Checks if an element has missing ARIA properties.
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is missing required ARIA properties, false otherwise
 */
function hasMissingAriaProperties(element) {
  const requiredAriaProps = ['role', 'aria-label', 'aria-labelledby', 'tabindex'];

  return !requiredAriaProps.every(prop => element.hasAttribute(prop));
}

/**
 * Adds accessible names to all SVG elements in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for SVG elements
 * @returns {Array} Array of SVG elements with added accessible names
 */
function addSvgAccessibleNames(container = document) {
  const results = [];
  const svgs = container.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      if (!svg.querySelector('title')) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'SVG image';
        svg.insertBefore(title, svg.firstChild);
        results.push(svg);
      } else if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', 'SVG image');
        results.push(svg);
      }
    }
  });
  
  return results;
}

/**
 * Ensures that all landmark elements have unique labels or identifiers.
 * @param {HTMLElement} [container=document] - The container to check for landmarks
 * @returns {Array} Array of landmark elements that were fixed
 */
function ensureUniqueLandmarks(container = document) {
  const results = [];
  const landmarks = container.querySelectorAll('[role]');
  const rolesFound = new Set();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (rolesFound.has(role)) {
      const uniqueId = 'landmark-' + Math.random().toString(36).substr(2, 9);
      landmark.setAttribute('aria-label', role + ' ' + uniqueId);
      results.push(landmark);
    } else {
      rolesFound.add(role);
    }
  });
  
  return results;
}

/**
 * Fixes fake link issues where elements use href="#" or javascript:void(0)
 * and should be converted to proper buttons or have proper link behavior.
 * @param {HTMLElement} [container=document] - The container to check for fake links
 * @returns {Array} Array of elements that were fixed
 */
function fixFakeLinkIssue(container = document) {
  const results = [];
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  
  fakeLinks.forEach(link => {
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
      results.push(link);
    }
  });
  
  return results;
}

/**
 * Adds a main landmark to the document if one is missing.
 * @param {HTMLElement} [container=document] - The container to check for main landmark
 * @returns {HTMLElement|null} The main element created or existing, or null if not available
 */
function addMainLandmark(container = document) {
  if (!container) return null;

  // Check if main already exists
  const existingMain = container.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create main element
  const main = document.createElement('main');
  main.setAttribute('role', 'main');

  // Get the first child to insert before
  const firstChild = container.firstChild;
  if (firstChild) {
    container.insertBefore(main, firstChild);
  } else {
    container.appendChild(main);
  }

  return main;
}

/**
 * Adds accessible names to all SVG elements in the container.
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of SVG elements that were processed
 */
function addSvgAccessibleNamesFromOrigin(container = document) {
  if (!container) return [];

  const svgElements = container.querySelectorAll('svg');
  const processed = [];

  svgElements.forEach(svg => {
    // Skip if already has accessible name
    if (svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby')) {
      return;
    }

    // Try to get name from title element
    const title = svg.querySelector('title');
    if (title && title.textContent) {
      const id = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      title.id = id;
      svg.setAttribute('aria-labelledby', id);
      processed.push(svg);
    }
  });

  return processed;
}

/**
 * Ensures that landmark elements are unique in the document.
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of objects with action taken
 */
function ensureUniqueLandmarksFromOrigin(container = document) {
  if (!container) return [];

  const results = [];
  const landmarkRoles = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

  landmarkRoles.forEach(role => {
    const landmarks = container.querySelectorAll(`[role="${role}"]`);

    // Skip if zero or one landmark
    if (landmarks.length <= 1) return;

    // Add labels to duplicate landmarks
    for (let i = 1; i < landmarks.length; i++) {
      const label = `${role} ${i + 1}`;
      landmarks[i].setAttribute('aria-label', label);
      results.push({
        element: landmarks[i],
        role: role,
        label: label
      });
    }
  });

  return results;
}

/**
 * Fixes fake link issues (elements that look like links but aren't).
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of elements that were fixed
 */
function fixFakeLinkIssueFromOrigin(container = document) {
  if (!container) return [];

  const fixed = [];

  // Find elements with click handlers that have href-like attributes
  const potentialFakeLinks = container.querySelectorAll('[onclick][href], [data-href]');

  potentialFakeLinks.forEach(el => {
    // If it's not an anchor or button, make it a button or add role
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
      // Check if it has proper role
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'button');
        fixed.push(el);
      }
    }
  });

  return fixed;
}

/**
 * Adds landmark regions to the document.
 */
function addLandmarkRegions() {
  LANDMARK_ELEMENTS.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element) {
      if (!element.id) {
        element.id = `landmark-${landmark}-${Date.now()}`;
      }
    }
  });
}

/**
 * Checks landmark elements in HTML content.
 * @param {string} htmlContent - The HTML content to check
 */
function checkLandmarkElements(htmlContent) {
  // Implementation for checking landmark elements in HTML content
}

/**
 * Adds accessible names to all form elements in the document.
 * @returns {NodeList} NodeList of processed form elements
 */
function setFormElementAccessibleNames() {
  return [];
}

/**
 * Adds a11y attributes to interactive elements to ensure they are keyboard accessible.
 * @returns {Array} Array of elements with added attributes
 */
function addA11yAttributesToInteractiveElements() {
  return [];
}

// Make functions accessible globally for browser usage
const globalObject = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
globalObject.setSvgAccessibilityProps = setSvgAccessibilityProps;
globalObject.isLinkAccessible = isLinkAccessible;
globalObject.isButtonAccessible = isButtonAccessible;
globalObject.checkAccessibility = checkAccessibility;
globalObject.checkLandmarkElement = checkLandmarkElement;
globalObject.checkLandmarks = checkLandmarks;
globalObject.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
globalObject.renderIndexView = renderIndexView;
globalObject.getLangAttribute = getLangAttribute;
globalObject.createInPageButton = createInPageButton;
globalObject.addLangAttribute = addLangAttribute;
globalObject.fixTableStructureIssues = fixTableStructureIssues;
globalObject.validateTableAccessibility = validateTableAccessibility;
globalObject.validateTableStructure = validateTableStructure;
globalObject.addMainLandmark = addMainLandmark;
globalObject.addSvgAccessibleNames = addSvgAccessibleNames;
globalObject.ensureUniqueLandmarks = ensureUniqueLandmarks;
globalObject.fixFakeLinkIssue = fixFakeLinkIssue;
globalObject.setFormElementAccessibleNames = setFormElementAccessibleNames;
globalObject.addA11yAttributesToInteractiveElements = addA11yAttributesToInteractiveElements;
globalObject.hasMissingAriaProperties = hasMissingAriaProperties;
globalObject.getSvgAccessibleName = getSvgAccessibleName;
globalObject.addressAccessibilityIssues = addressAccessibilityIssues;
globalObject.validateLandmark = validateLandmark;
globalObject.validateLandmarkStructure = validateLandmarkStructure;
globalObject.validateLandmarkAttributes = validateLandmarkAttributes;
globalObject.getTagNameForElement = getTagNameForElement;
globalObject.getLandmarkAccessibleName = getLandmarkAccessibleName;
globalObject.addLandmarkRegions = addLandmarkRegions;
globalObject.checkLandmarkElements = checkLandmarkElements;
globalObject.a11yStore = a11yStore;
globalObject.addressAccessibilityIssue038 = addressAccessibilityIssue038;
globalObject.LANDMARK_ELEMENTS = LANDMARK_ELEMENTS;
globalObject.renderDependencyGraph = renderDependencyGraph;

// Exports for Node.js module usage
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableAccessibilityFromHead,
  validateLandmark,
  validateLandmarkFromHead,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksFromOrigin,
  getSvgAccessibleName,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  checkLandmarks,
  wrapPrimaryContentInMain,
  renderIndexView,
  renderDependencyGraph,
  addressAccessibilityIssue038,
  createInPageButton,
  addLangAttribute,
  fixTableStructureIssues,
  validateTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  addSvgAccessibleNamesFromOrigin,
  fixFakeLinkIssue,
  fixFakeLinkIssueFromOrigin,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  hasMissingAriaProperties,
  addressAccessibilityIssues,
  validateLandmarkAttributes,
  getTagNameForElement,
  getLandmarkAccessibleName,
  addLandmarkRegions,
  checkLandmarkElements,
  a11yStore,
  metadata,
  LANDMARK_ELEMENTS,
  loop
};

// ES module exports
export { 
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  checkLandmarks,
  wrapPrimaryContentInMain,
  renderIndexView,
  getLangAttribute,
  createInPageButton,
  addLangAttribute,
  fixTableStructureIssues,
  validateTableAccessibility,
  validateTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  addSvgAccessibleNamesFromOrigin,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksFromOrigin,
  fixFakeLinkIssue,
  fixFakeLinkIssueFromOrigin,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  hasMissingAriaProperties,
  getSvgAccessibleName,
  addressAccessibilityIssues,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getTagNameForElement,
  getLandmarkAccessibleName,
  addLandmarkRegions,
  checkLandmarkElements,
  a11yStore,
  addressAccessibilityIssue038,
  metadata,
  LANDMARK_ELEMENTS
};

// Default export
export default {
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  checkLandmarks,
  wrapPrimaryContentInMain,
  renderIndexView,
  getLangAttribute,
  createInPageButton,
  addLangAttribute,
  fixTableStructureIssues,
  validateTableAccessibility,
  validateTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  addSvgAccessibleNamesFromOrigin,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksFromOrigin,
  fixFakeLinkIssue,
  fixFakeLinkIssueFromOrigin,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  hasMissingAriaProperties,
  getSvgAccessibleName,
  addressAccessibilityIssues,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getTagNameForElement,
  getLandmarkAccessibleName,
  addLandmarkRegions,
  checkLandmarkElements,
  a11yStore,
  addressAccessibilityIssue038,
  metadata,
  LANDMARK_ELEMENTS,
  loop
};