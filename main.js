import { requiredModule } from './required-module.js';

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

// ... New code after applyAccessibilityFixes function & exports

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  applyAccessibilityFixes,
  getSvgAccessibleName
};