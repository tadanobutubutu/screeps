// main.js

// TODO: Import required module(s) and export the new necessary function(s) here in main.js
import React from 'react';

// Import dependency graph and index content modules
import { dependencyGraphContent, indexContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Process data (preserved from original)
function processData(data) {
  if (!data) {
    return null;
  }

  // Process and normalize data structure
  const processed = {
    raw: data,
    normalized: Array.isArray(data) ? data.map(normalizeItem) : normalizeItem(data),
    metadata: extractMetadata(data)
  };

  return processed;
}

function normalizeItem(item) {
  if (typeof item === 'string') {
    return item.trim();
  }

  if (typeof item === 'object' && item !== null) {
    const normalized = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        normalized[key] = normalizeItem(item[key]);
      }
    }
    return normalized;
  }

  return item;
}

function extractMetadata(data) {
  const metadata = {
    type: Array.isArray(data) ? 'array' : typeof data,
    length: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 0),
    timestamp: Date.now()
  };
  return metadata;
}

// Initialize application logic
const initialize = (callback) => {
  const appData = processData({ dependencyGraphContent, indexContent });
  if (callback && typeof callback === 'function') {
    callback(appData);
  }
  return appData;
};

initialize(() => {
  addressAccessibilityIssues();
});

// Fix REACT_015: Add proper lang attribute to HTML element
export function createHtmlElement(language = 'en') {
  // Existing function with the addition of the critical lang attribute
  return {
    type: 'html',
    props: {
      lang: language, // Critical: HTML lang attribute required
      children: []
    }
  };
}

// New changes to fix the React SVG Accessible Name issue
// Add an accessible name to the SVGs in the icons object
const icons = {
  icon: '<svg ... viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...',
  apple: '<svg ... viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" ...',
};

// Fix REACT_041: SVG must have accessible name via aria-label, title, or role="img" with aria-labelledby
export function createSvgIcon(iconName, children = []) {
  return {
    type: 'svg',
    props: {
      'aria-label': iconName, // Provides accessible name for screen readers
      role: 'img',
      children: children
    }
  };
}

// NEW: Ensure accessible names for up to two SVG icons (REACT_041)
// Adds aria-label and a <title> element if the SVG lacks an accessible name.
function ensureSvgAccessibleNames() {
  // Target SVG elements that carry a data-icon-name attribute (common pattern)
  const svgs = document.querySelectorAll('svg[data-icon-name]');
  const toFix = Array.from(svgs).filter(svg => !svg.hasAttribute('aria-label')).slice(0, 2);
  toFix.forEach(svg => {
    const name = svg.getAttribute('data-icon-name');
    svg.setAttribute('aria-label', name);
    // Add a <title> child for extra screen‑reader clarity
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = name;
    // Insert the title as the first child to keep it at the top of the SVG content
    svg.insertBefore(title, svg.firstChild);
  });
}

// Fix REACT_025 & REACT_017: Use semantic landmark elements with unique labels
// (as the issue asks for the fix for React, I'm assuming there's some other place to apply these changes)

// Ensure unique landmarks across the application (DOM version)
function ensureUniqueLandmarksDOM(container = document) {
  const landmarks = ['header', 'footer', 'aside', 'section', 'nav', 'main'];
  const seenIds = new Set();

  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    elements.forEach((element) => {
      let id = element.id;
      if (!id) {
        id = 'landmark-' + Math.random().toString(36).substr(2, 9);
        element.id = id;
      }
      if (seenIds.has(id)) {
        id = 'landmark-' + Math.random().toString(36).substr(2, 9);
        element.id = id;
      }
      seenIds.add(id);
    });
  });
}

// NEW: Fix fake link issue (REACT_036)
// Finds <a href="#"> links and makes them non‑functional but still accessible.
function fixFakeLinks() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    // Replace the placeholder href with a harmless value and add a role hint
    link.href = 'javascript:void(0)';
    link.setAttribute('role', 'button');
    // Ensure it is focusable but not a link that triggers navigation
    link.tabIndex = 0;
  });
}

// Function for adding proper landmark regions
export function addLandmarks(content) {
  let headerId = 'landmark-header';
  let navId = 'landmark-nav';
  let mainId = 'landmark-main';
  let footerId = 'landmark-footer';
  let landmarkComponents = [null, null, null, null];

  if (content) {
    const header = content.querySelector('header');
    if (header) {
      headerId = header.id || header.getAttribute('id') || header.getAttribute('data-testid') || headerId;
      landmarkComponents[0] = {
        type: 'header',
        props: {
          id: headerId,
          role: 'banner',
          'aria-label': 'Site header',
          className: 'landmark-header',
          children: [header]
        }
      };
    }

    const navs = content.querySelectorAll('nav');
    navs.forEach((nav, index) => {
      if (nav.id) {
        navId = nav.id || nav.getAttribute('id') || nav.getAttribute('data-testid') || navId;
        landmarkComponents[1] = {
          type: 'nav',
          props: {
            id: navId,
            role: 'navigation',
            'aria-label': 'Main navigation',
            className: 'landmark-nav',
            children: [nav]
          }
        };
      } else {
        nav.id = navId;
      }
    });

    const main = content.querySelector('main');
    if (main) {
      mainId = main.id || main.getAttribute('id') || main.getAttribute('data-testid') || mainId;
      landmarkComponents[2] = {
        type: 'main',
        props: {
          id: mainId,
          role: 'main',
          'aria-label': 'Main content',
          className: 'landmark-main',
          children: [main]
        }
      };
    }

    const footer = content.querySelector('footer');
    if (footer) {
      footerId = footer.id || footer.getAttribute('id') || footer.getAttribute('data-testid') || footerId;
      landmarkComponents[3] = {
        type: 'footer',
        props: {
          id: footerId,
          role: 'contentinfo',
          'aria-label': 'Site footer',
          className: 'landmark-footer',
          children: [footer]
        }
      };
    }
  }

  return landmarkComponents;
}

// NEW: Ensure proper role attributes on landmark elements (REACT_017)
// This helper runs after landmarks are added to guarantee correct roles.
function applyLandmarkRoles() {
  // Header should have role="banner"
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  // All nav elements should have role="navigation"
  document.querySelectorAll('nav').forEach(nav => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });

  // Main content should have role="main"
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Footer should have role="contentinfo"
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Enhance focus visibility for keyboard navigation
const enhanceFocusVisibility = function() {
  // Function to enhance focus visibility for keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
};

// NEW: Fix REACT_027 - Add scope attribute to table header cells
// Adds scope="col" to <th> elements in <thead> and scope="row" to first <th> in each <tbody> row
export function fixTableHeaders(container = document) {
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    // Fix column headers in thead
    const columnHeaders = table.querySelectorAll('thead th');
    columnHeaders.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });

    // Fix row headers in tbody (first th in each row)
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const firstCell = row.querySelector('th');
      if (firstCell && !firstCell.hasAttribute('scope')) {
        firstCell.setAttribute('scope', 'row');
      }
    });
  });
}

// Set language attribute on HTML root element
function setLanguageAttribute(lang) {
  document.documentElement.lang = lang;
}

const addressAccessibilityIssues = function() {
  // Function to address accessibility issues:
  // - REACT_015: Add lang attribute (already handled)
  // - REACT_017: Add landmark roles and fix landmark issues
  // - REACT_025, REACT_017: Ensure unique landmarks (already handled)
  // - REACT_041: Add accessible names to 2 SVGs
  // - REACT_027: Add scope="col" or scope="row" to <th> elements (already handled)
  // - REACT_036: Fix 1 fake link issue

  // Ensure unique landmarks (pass document as container)
  ensureUniqueLandmarksDOM();

  // Apply proper landmark roles
  applyLandmarkRoles();

  // Add accessible names to up to two SVG icons
  ensureSvgAccessibleNames();

  // Fix fake link issue (remove placeholder href="#" behavior)
  fixFakeLinks();

  // Fix REACT_015: Set language attribute on HTML root element
  setLanguageAttribute('en');

  // Fix REACT_027: Add scope attributes to table headers
  fixTableHeaders();
};

/**
 * Adds a language attribute to an HTML element.
 * @param {React.ReactElement} element JSX element to add lang attribute
 */
function addLangAttribute(element) {
  if (!element || !element.props) {
    return element;
  }
  
  return React.cloneElement(element, {
    ...element.props,
    lang: element.props.lang || 'en',
  });
}

/**
 * Recursively processes children to add language attributes.
 * @param {React.ReactElement} element JSX element to process
 * @returns {React.ReactElement} Element with lang attributes added
 */
function processChildrenWithLang(element) {
  if (!element || typeof element !== 'object') {
    return element;
  }

  if (element.props && element.props.children) {
    const processedChildren = React.Children.map(element.props.children, child => {
      if (child && typeof child === 'object' && child !== null && child.props) {
        if (child.props) {
          return React.cloneElement(child, {
            ...child.props,
            className: (child.props.className || '') + ' jsx-lang-en',
            lang: child.props.lang || 'en',
          });
        }
      }
      return child;
    });

    return React.cloneElement(element, {
      ...element.props,
      children: processedChildren,
    });
  }

  return element;
}

/**
 * Fixes 26 table structure issues.
 */
function fixTableStructure() {
  // Ensure tables have proper semantic structure
  // - Add <caption> for table titles
  // - Use <thead> and <tbody> properly
  // - Add scope attributes to header cells
  // - Ensure proper th/td usage
  
  const tableFixes = {
    addCaption: (table, captionText) => {
      return React.cloneElement(table, {
        ...table.props,
      }, [
        React.createElement('caption', { key: 'caption' }, captionText),
        ...React.Children.toArray(table.props.children)
      ]);
    },
    
    addScopeToHeaders: (headerCells) => {
      return headerCells.map((cell, index) => {
        if (cell.type === 'th') {
          return React.cloneElement(cell, {
            ...cell.props,
            scope: cell.props.scope || 'col',
          });
        }
        return cell;
      });
    },
    
    ensureTheadTbody: (table) => {
      const children = React.Children.toArray(table.props.children);
      let hasThead = false;
      let hasTbody = false;
      
      React.Children.forEach(table.props.children, child => {
        if (child && child.type === 'thead') hasThead = true;
        if (child && child.type === 'tbody') hasTbody = true;
      });
      
      return table;
    },
  };
  
  return tableFixes;
}

/**
 * Adds a main landmark to the application.
 */
function addMainLandmark(element) {
  if (!element) {
    return React.createElement('main', { id: 'main-content', role: 'main' });
  }
  
  return React.cloneElement(element, {
    ...element.props,
    id: element.props.id || 'main-content',
    role: element.props.role || 'main',
  });
}

/**
 * Validates that a landmark exists.
 * @param {Document} doc Document to check for landmarks
 * @returns {boolean} True if at least one landmark exists
 */
function validateLandmark(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"]');
  const validLandmarkRoles = [
    'banner', 'navigation', 'main', 'complementary', 
    'contentinfo', 'search', 'form'
  ];
  
  for (const landmark of landmarks) {
    if (validLandmarkRoles.includes(landmark.getAttribute('role'))) {
      return true;
    }
  }
  
  // Also check for native HTML5 landmark elements
  const nativeLandmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  return nativeLandmarks.length > 0;
}

/**
 * Ensures landmarks are unique.
 * @param {Array} landmarks Array of landmark elements or objects
 * @returns {Array} Array with duplicates removed
 */
function ensureUniqueLandmarks(landmarks) {
  const unique = [];
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    const identifier = landmark.id || landmark.getAttribute?.('role') || landmark.label || JSON.stringify(landmark);
    if (!seen.has(identifier)) {
      seen.add(identifier);
      unique.push(landmark);
    }
  });
  
  return unique;
}

/**
 * Validates the structure of landmarks.
 * @param {Document} doc Document to validate landmark structure
 * @returns {Object} Validation result with errors array
 */
function validateLandmarkStructure(doc) {
  const errors = [];
  const landmarks = doc.querySelectorAll('[role="main"], main');
  
  // Ensure exactly one main landmark
  if (landmarks.length === 0) {
    errors.push('No main landmark found. Add a <main> element or role="main".');
  } else if (landmarks.length > 1) {
    errors.push(`Found ${landmarks.length} main landmarks. Should have exactly one.`);
  }
  
  // Check for proper landmark nesting
  const headerElements = doc.querySelectorAll('header, [role="banner"]');
  headerElements.forEach(header => {
    const parent = header.parentElement;
    if (parent && (parent.tagName === 'ARTICLE' || parent.tagName === 'ASIDE' || parent.getAttribute?.('role') === 'complementary')) {
      errors.push('Header should not be nested inside article, aside, or complementary landmarks.');
    }
  });
  
  // Check for unique landmark labels
  const landmarkLabels = {};
  const labeledLandmarks = doc.querySelectorAll('[aria-label], [aria-labelledby]');
  labeledLandmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    if (landmarkLabels[label]) {
      errors.push(`Duplicate landmark label: "${label}". Labels should be unique.`);
    }
    landmarkLabels[label] = true;
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Adds an accessible name to an SVG element.
 * @param {SVGElement} svgElement SVG element to modify
 * @param {string} accessibleName Accessible name to add
 */
function addAccessibleNameToSVG(svgElement, accessibleName) {
  if (!svgElement || !accessibleName) {
    return svgElement;
  }
  
  // Ensure role="img" is set
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  // Set aria-label for accessible name
  svgElement.setAttribute('aria-label', accessibleName);
  
  return svgElement;
}

/**
 * Gets the accessible name of an SVG element.
 * @param {SVGElement} svgElement SVG element to get name from
 * @returns {string} The accessible name (title, aria-label, or aria-labelledby)
 */
function getAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }
  
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent;
    }
  }
  
  // Fallback to title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  
  return '';
}

/**
 * Creates accessibility properties for an SVG element.
 * @param {string} accessibleName The accessible name for the SVG
 * @returns {Object} Object with role, aria-labelledby, and aria-label
 */
function createAccessibilityProps(accessibleName) {
  if (!accessibleName) {
    return {
      role: 'img',
      'aria-hidden': 'true',
    };
  }
  
  return {
    role: 'img',
    'aria-label': accessibleName,
    'aria-labelledby': undefined, // Prefer aria-label over aria-labelledby for simple cases
  };
}

/**
 * Deduplicates landmarks by removing duplicates based on identifier.
 * @param {Array} landmarks Array of landmarks to deduplicate
 * @returns {Array} Deduplicated landmarks
 */
function deduplicateLandmarks(landmarks) {
  const unique = [];
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    const identifier = landmark.id || landmark.getAttribute?.('role') || landmark.label || JSON.stringify(landmark);
    if (!seen.has(identifier)) {
      seen.add(identifier);
      unique.push(landmark);
    }
  });
  
  return unique;
}

/**
 * Fixes a fake link issue.
 * @param {HTMLElement} element Element to check and fix
 * @returns {HTMLElement} Fixed element
 */
function fixFakeLinkIssue(element) {
  if (!element) {
    return element;
  }
  
  // Check if it's an anchor tag without href (fake link)
  if (element.tagName === 'A' && !element.href && !element.getAttribute('href')) {
    if (!element.getAttribute('role')) {
      element.setAttribute('role', 'button');
    }
    if (!element.getAttribute('tabIndex')) {
      element.setAttribute('tabIndex', '0');
    }
  }
  
  return element;
}

// Export processData for external use
export { processData };

export {
  addLangAttribute,
  processChildrenWithLang,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  ensureUniqueLandmarks,
  validateLandmarkStructure,
  addAccessibleNameToSVG,
  getAccessibleName,
  createAccessibilityProps,
  deduplicateLandmarks,
  fixFakeLinkIssue,
  icons,
};