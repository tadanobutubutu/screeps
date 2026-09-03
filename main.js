const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main

const primaryContent = (typeof document !== 'undefined') ? document.querySelector('main') || document.querySelector('#content') || document.querySelector('.content') || document.querySelector('article') || document.getElementById('primary-content') || document.body : null;

// Load configurations from package.json if it exists
function loadConfigurations() {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            config.name = packageJson.name || 'dependency-counter';
            config.version = packageJson.version || '1.0.0';
            config.dependencies = packageJson.dependencies || {};
            config.devDependencies = packageJson.devDependencies || {};
            config.accessibility = packageJson.accessibility || {};
        }
    } catch (error) {
        console.error('Error loading configurations:', error.message);
    }
}

// Implement function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1e9).toString(36).substring(0, 9);
    return timestamp + '-' + randomPart;
}

/**
 * Check if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
function prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers high contrast
 * @returns {boolean} True if the user prefers high contrast
 */
function prefersHighContrast() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
    const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

    if (!element) {
        return false;
    }

    if (typeof element === 'string') {
        return landmarkTags.includes(element.toLowerCase());
    }

    if (element.tagName) {
        return landmarkTags.includes(element.tagName.toLowerCase());
    }

    return false;
}

function checkLandmarkAccessibility(container) {
    const landmarkCount = {};

    container.querySelectorAll('[role="main"], main, nav, header, footer, section, article, form, search').forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        landmarkCount[role] = (landmarkCount[role] || 0) + 1;
    });

    return landmarkCount;
}

function validateLandmarkStructure(container) {
    const landmarkCount = {};

    container.querySelectorAll('[role="main"], main, nav, header, footer, section, article, form, search').forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        landmarkCount[role] = (landmarkCount[role] || 0) + 1;
    });

    return missingRoles(['main', 'banner', 'contentinfo'], new Set(Object.keys(landmarkCount)));
}

function configureSvgAccessibility(svg) {
    if (svg && svg.setAttribute) {
        svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
        svg.setAttribute('aria-labelledby', accessibleName);
    }

    setSvgAttributes(svg);
}

function getSvgAccessibleName(svg) {
    if (!svg) return null;

    const title = svg.querySelector('title');
    if (title && title.textContent) {
        return title.textContent.trim();
    }

    const desc = svg.querySelector('desc');
    if (desc && desc.textContent) {
        return desc.textContent.trim();
    }

    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel.trim();
    }

    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labeledElement = document.getElementById(ariaLabelledby);
        if (labeledElement && labeledElement.textContent) {
            return labeledElement.textContent.trim();
        }
    }

    return null;
}

function validateAccessibilityReport(report) {
    const errors = [];
    const details = {
        landmarks: { valid: true, errors: [] },
        uniqueLandmarks: { valid: true, errors: [] },
        tables: { valid: true, errors: [] },
        tablesStructure: { valid: true, errors: [] },
        svgs: { valid: true, errors: [] },
        links: { valid: true, errors: [] }
    };

    if (!report || typeof report !== 'object') {
        return {
            valid: false,
            errors: ['Accessibility report is required and must be an object'],
            details: details
        };
    }

    // Validate landmarks
    if (Array.isArray(report.landmarks)) {
        report.landmarks.forEach((landmark, index) => {
            const result = isLandmarkElement(landmark);
            if (!result.valid) {
                result.errors.forEach(err => {
                    errors.push(`Landmark ${index}: ${err}`);
                    details.landmarks.errors.push(`Landmark ${index}: ${err}`);
                });
                details.landmarks.valid = false;
            }
        });
    }

    // Validate unique landmarks
    if (typeof ensureUniqueLandmarks === 'function') {
        const uniqueLandmarksResult = ensureUniqueLandmarks();
        if (!uniqueLandmarksResult.valid) {
            uniqueLandmarksResult.errors.forEach(err => {
                errors.push(`Unique landmarks: ${err}`);
                details.uniqueLandmarks.errors.push(err);
            });
            details.uniqueLandmarks.valid = false;
        }
    }

    // Validate table accessibility
    if (Array.isArray(report.tables)) {
        report.tables.forEach((table) => {
            const accResult = validateTableAccessibility(table);
            if (!accResult.details.success) {
                accResult.details.errors.forEach(err => {
                    errors.push(`Table accessibility: ${err}`);
                    details.tables.errors.push(`Table: ${err}`);
                });
                details.tables.valid = false;
            }

            const structResult = validateTableStructure(table);
            if (!structResult.details.valid) {
                structResult.details.errors.forEach(err => {
                    errors.push(`Table structure: ${err}`);
                    details.tablesStructure.errors.push(`Table: ${err}`);
                });
                details.tablesStructure.valid = false;
            }
        });
    }

    // Validate SVG accessible names
    if (Array.isArray(report.svgs)) {
        report.svgs.forEach((svg, index) => {
            const name = getSvgAccessibleName(svg);
            if (!name || name.trim() === '') {
                const err = `SVG ${index} is missing accessible name`;
                errors.push(err);
                details.svgs.errors.push(err);
                details.svgs.valid = false;
            }
        });
    }

    // Validate link accessibility
    if (Array.isArray(report.links)) {
        report.links.forEach((link, index) => {
            const linkResult = isLinkAccessible(link);
            if (!linkResult.valid) {
                linkResult.errors.forEach(err => {
                    errors.push(`Link ${index}: ${err}`);
                    details.links.errors.push(`Link ${index}: ${err}`);
                });
                details.links.valid = false;
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors,
        details: details
    };
}

/**
 * Creates an accessible button/link for external web resources (e.g., GitHub, Stack Overflow, etc.)
 * @param {Object} options - Configuration options for the web resource button
 * @param {string} options.url - The URL to link to
 * @param {string} options.label - The accessible label/name for the button (required for screen readers)
 * @param {string} options.icon - Optional icon class name or SVG markup to display
 * @param {string} options.type - Type of resource (e.g., 'github', 'stackoverflow', 'twitter', 'linkedin')
 * @param {string} options.variant - Button variant style (e.g., 'primary', 'secondary', 'icon-only')
 * @param {string} options.className - Additional CSS class names
 * @param {boolean} options.openInNewTab - Whether to open link in new tab (default: true for external resources)
 * @param {string} options.ariaDescription - Additional aria-description for more context
 * @returns {HTMLAnchorElement|HTMLButtonElement} - The accessible web resource button element
 */
function createWebResourceButton(options = {}) {
  const {
    url,
    label,
    icon,
    type,
    variant = 'secondary',
    className = '',
    openInNewTab = true,
    ariaDescription
  } = options;

  // Validate required parameters
  if (!url || typeof url !== 'string') {
    console.warn('createWebResourceButton: URL is required and must be a string');
    return null;
  }

  if (!label || typeof label !== 'string') {
    console.warn('createWebResourceButton: Label is required for accessibility and must be a string');
    return null;
  }

  // Create the anchor element for external links
  const button = document.createElement('a');
  
  // Set core attributes
  button.href = url;
  button.textContent = label;
  
  // Ensure accessible name for screen readers
  button.setAttribute('aria-label', label);
  
  // Handle external link accessibility
  if (openInNewTab || url.startsWith('http://') || url.startsWith('https://')) {
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    // Announce that link opens in new tab for screen reader users
    button.setAttribute('aria-describedby', 'external-link-description');
  }

  // Add type-specific class for styling
  if (type) {
    button.classList.add(`web-resource-btn`, `web-resource-btn--${type.toLowerCase()}`);
  }

  // Add variant class
  button.classList.add(`btn`, `btn--${variant}`);
  
  // Add any additional custom classes
  if (className) {
    const additionalClasses = className.split(' ').filter(c => c.trim());
    additionalClasses.forEach(c => button.classList.add(c));
  }

  // Add icon if provided
  if (icon) {
    if (icon.startsWith('<')) {
      // SVG markup - insert as HTML
      button.innerHTML = icon + label;
    } else {
      // Icon class - wrap in span
      const iconSpan = document.createElement('span');
      iconSpan.className = icon;
      iconSpan.setAttribute('aria-hidden', 'true');
      button.insertBefore(iconSpan, button.firstChild);
    }
  }

  // Add additional aria-description if provided
  if (ariaDescription) {
    button.setAttribute('aria-description', ariaDescription);
  }

  // Ensure keyboard accessibility
  button.tabIndex = 0;
  
  // Add Enter key support for keyboard activation
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });

  return button;
}

/**
 * wrapPrimaryContentInMain - Wraps the primary content of a container in a <main> element
 * This ensures proper landmark structure for accessibility compliance
 * @param {HTMLElement} container - The container element to process
 * @param {Object} options - Optional configuration options
 * @param {string} options.mainId - Custom id for the main element (default: 'main-content')
 * @param {string} options.mainRole - Role attribute for the main element (default: 'main')
 * @returns {HTMLElement|null} - The main element or null if operation failed
 */
export function wrapPrimaryContentInMain(container, options = {}) {
  if (!container || typeof container !== 'object' || !container.nodeType) {
    return null;
  }

  const config = {
    mainId: options.mainId || 'main-content',
    mainRole: options.mainRole || 'main'
  };

  // Check if main element already exists
  let mainElement = container.querySelector('main');

  if (mainElement) {
    // Main element already exists, ensure it has proper id
    if (!mainElement.id) {
      mainElement.id = config.mainId;
    }
    // Ensure proper role
    if (!mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', config.mainRole);
    }
    return mainElement;
  }

  // Create new main element
  mainElement = document.createElement('main');
  mainElement.id = config.mainId;
  mainElement.setAttribute('role', config.mainRole);

  // Find primary content to wrap
  // Priority: role="main" > main element > article > section with id > body content
  const primarySelectors = [
    '[role="main"]',
    'article:not([role])',
    'section[id]',
    '.primary-content',
    '#primary-content',
    '.main-content',
    '#main-content'
  ];

  let primaryContent = null;

  for (const selector of primarySelectors) {
    primaryContent = container.querySelector(selector);
    if (primaryContent) {
      break;
    }
  }

  if (primaryContent) {
    // Move primary content children into main element
    while (primaryContent.firstChild) {
      mainElement.appendChild(primaryContent.firstChild);
    }

    // Replace primary content with main element
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  } else {
    // No specific primary content found
    // Get body or container's direct children
    const body = container.ownerDocument ? container.ownerDocument.body : null;
    const contentParent = body || container;

    // Collect direct children to move
    const childrenToMove = Array.from(contentParent.childNodes).filter(node => {
      // Skip script, style, and meta elements
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (['script', 'style', 'link', 'meta', 'noscript'].includes(tagName)) {
          return false;
        }
        // Skip existing main element
        if (tagName === 'main') {
          return false;
        }
      }
      return true;
    });

    // Move children to main element
    childrenToMove.forEach(child => {
      mainElement.appendChild(child);
    });

    // Append main element to container
    if (body) {
      body.appendChild(mainElement);
    } else {
      container.appendChild(mainElement);
    }
  }

  // Log successful operation
  if (typeof log === 'function') {
    log(`Primary content wrapped in main element with id: ${config.mainId}`, 'info');
  }

  return mainElement;
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0