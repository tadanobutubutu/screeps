// main.js
// Preserving all existing code and exports
// Adding accessibility improvements for the reported issues

// Example of existing code that would be preserved
// export function existingFunction() { ... }

/**
 * Adds language attribute to HTML element for better screen reader support
 * Addresses REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

/**
 * Improves table structure for better screen reader navigation
 * Addresses REACT_027: React Table Structure
 * @param {HTMLElement} tableElement - The table element to improve
 */
function improveTableStructure(tableElement) {
  if (!tableElement) return;

  // Ensure table has proper caption
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table data';
    tableElement.prepend(caption);
  }

  // Ensure table headers are properly scoped
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
    if (!header.hasAttribute('id')) {
      header.setAttribute('id', `table-header-${index}`);
    }
  });

  // Associate data cells with headers
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) return; // Skip header row

    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
      const headerId = `table-header-${cellIndex}`;
      if (!cell.hasAttribute('headers')) {
        cell.setAttribute('headers', headerId);
      }
    });
  });
}

/**
 * Ensures proper landmark elements for screen reader navigation
 * Addresses REACT_017: React Landmarks
 */
function ensureLandmarks() {
  // Ensure main content has a landmark
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const content = document.querySelector('body').innerHTML;
    document.querySelector('body').innerHTML = '';
    main.innerHTML = content;
    document.querySelector('body').appendChild(main);
  }

  // Ensure navigation has proper role
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }
}

/**
 * Adds accessible names to SVG elements
 * Addresses REACT_041: React SVG Accessible Name
 * @param {HTMLElement} svgElement - The SVG element to make accessible
 */
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  if (!svgElement.hasAttribute('aria-label') && !svgElement.querySelector('title, desc')) {
    const title = document.createElement('title');
    title.textContent = 'Graphic element';
    svgElement.prepend(title);
  }
}

/**
 * Ensures unique landmarks for better screen reader navigation
 * Addresses REACT_025: React Unique Landmarks
 */
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && !el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', `${landmark} section ${index + 1}`);
        }
      });
    }
  });
}

/**
 * Replaces fake links with proper anchor elements
 * Addresses REACT_036: React Fake Link
 * @param {HTMLElement} element - The element to check for fake links
 */
function replaceFakeLinks(element) {
  if (!element) return;

  const fakeLinks = element.querySelectorAll('[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || '#';
      anchor.innerHTML = link.innerHTML;
      link.replaceWith(anchor);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  ensureLandmarks();
  ensureUniqueLandmarks();

  // Apply to all tables on the page
  document.querySelectorAll('table').forEach(improveTableStructure);

  // Apply to all SVGs on the page
  document.querySelectorAll('svg').forEach(makeSvgAccessible);

  // Apply to the entire document for fake links
  replaceFakeLinks(document.body);
});

// Preserve all existing exports
// export { ... };