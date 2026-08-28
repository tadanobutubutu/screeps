// main.js

import { requiredModule } from './required-module.js';

const fs = require('fs');
const path = require('path');

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: This is the existing code that needs to be preserved
// ...

// ----- END ORIGINAL CODE -------
// ... existing code above ...

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.lang = lang;
  }
}

/**
 * REACT_027: Fix table structure issues
 * @param {HTMLElement} table - Table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;

  // Ensure proper table structure with thead, tbody, tfoot
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }

  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (row.parentElement !== tbody) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
}

/**
 * REACT_017: Add main landmark
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  if (!doc) return;

  // Check if main element already exists
  let main = doc.querySelector('main');

  if (!main) {
    main = doc.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');

    // Try to find the content to wrap
    const body = doc.body;
    if (body && body.firstChild) {
      body.insertBefore(main, body.firstChild);
    }
  }

  return main;
}

/**
 * REACT_025: Ensure unique landmarks
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  if (!doc) return;

  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];

  landmarkTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);

    // Make <header> and <footer> unique by only having one non-nested version
    if (tag === 'header' || tag === 'footer') {
      let mainLandmark = null;
      elements.forEach((el, index) => {
        // Keep the first one that's a direct child of body
        if (!mainLandmark && el.parentElement === doc.body) {
          mainLandmark = el;
        } else if (index > 0) {
          // Remove duplicate role attributes or add aria-label
          if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
            el.setAttribute('aria-label', `${tag}-${index + 1}`);
          }
        }
      });
    }
  });
}

// ... Previous code up to applyAccessibilityFixes function & exports

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

  const accessibleName = getSvgAccessibleName(svgElement);
  if (accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;

  if (role && !svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', role);
  }

  if (ariaLabel && !svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', ariaLabel);
  }

  if (ariaLabelledby && !svgElement.getAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-labelledby', ariaLabelledby);
  }

  if (ariaDescribedby && !svgElement.getAttribute('aria-describedby')) {
    svgElement.setAttribute('aria-describedby', ariaDescribedby);
  }

  if (typeof focusable === 'boolean' && !svgElement.hasAttribute('focusable')) {
    svgElement.setAttribute('focusable', focusable.toString());
  }

  if (tabIndex !== undefined && !svgElement.hasAttribute('tabindex')) {
    svgElement.setAttribute('tabindex', tabIndex);
  }

  return svgElement;
}

/**
 * Add accessible names to SVG elements.
 * @param {Document|HTMLElement} context - The document or element to search within
 */
function addSvgAccessibleNames(context = document) {
  if (!context) return;
  const svgs = context.querySelectorAll ? context.querySelectorAll('svg') : [];
  svgs.forEach(svg => {
    if (!getSvgAccessibleName(svg)) {
      setSvgAccessibilityProps(svg);
    }
  });
}

/**
 * Fix issues with elements that have role="link" but are not actual links.
 * @param {Document|HTMLElement} context - The document or element to search within
 */
function fixFakeLinkIssue(context = document) {
  if (!context || !context.querySelectorAll) return;
  const fakeLinks = context.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(el => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Applies all accessibility fixes to a document.
 * @param {Document} doc - The document object
 */
function applyAccessibilityFixes(doc) {
  if (!doc) return;

  addLangAttribute(doc);
  addMainLandmark(doc);
  ensureUniqueLandmarks(doc);

  const tables = doc.querySelectorAll('table');
  tables.forEach(fixTableStructure);

  addSvgAccessibleNames(doc);
  fixFakeLinkIssue(doc);
}

// Export affected functions and new function to make them accessible
// ... existing code below ...
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  applyAccessibilityFixes,
  getSvgAccessibleName,
  countDependencies,
  addSvgAccessibilityProps
};

module.exports = {
    countDependencies,
    addSvgAccessibilityProps
};