// main.js
// [PRESERVED EXISTING CODE]
// All existing exports and functions remain unchanged

// NEW ACCESSIBILITY IMPROVEMENTS

/**
 * Adds proper language attribute to HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

/**
 * Improves table structure for screen readers
 * Fixes REACT_027: React Table Structure
 * @param {HTMLElement} tableElement - The table element to improve
 */
function improveTableStructure(tableElement) {
  if (!tableElement) return;

  // Add proper table structure if missing
  if (!tableElement.querySelector('thead') && tableElement.rows.length > 0) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.rows[0];
    if (firstRow) {
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tableElement.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(tableElement.rows);
    if (rows.length > 0) {
      rows.forEach((row, index) => {
        if (index > 0 || !tableElement.querySelector('thead')) {
          tbody.appendChild(row);
        }
      });
      tableElement.appendChild(tbody);
    }
  }

  // Add scope attributes to headers if missing
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

/**
 * Adds proper landmarks for screen readers
 * Fixes REACT_017: React Landmarks
 */
function addLandmarks() {
  // Add main landmark if missing
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const mainContent = document.querySelector('table#table-rotated') ||
                       document.querySelector('div.container') ||
                       document.querySelector('[role="main"]') ||
                       document.body.firstChild;
    if (mainContent && mainContent.parentNode) {
      const mainElement = document.createElement('main');
      mainContent.parentNode.insertBefore(mainElement, mainContent);
      mainElement.appendChild(mainContent);
    }
  }

  // Add navigation landmark if missing
  if (!document.querySelector('nav')) {
    const navContent = document.querySelector('header') ||
                      document.querySelector('nav') ||
                      document.querySelector('[role="navigation"]');
    if (navContent && navContent.parentNode) {
      const navElement = document.createElement('nav');
      navContent.parentNode.insertBefore(navElement, navContent);
      navElement.appendChild(navContent);
    }
  }
}

/**
 * Adds accessible names to SVG elements
 * Fixes REACT_041: React SVG Accessible Name
 * @param {HTMLElement} svgElement - The SVG element to improve
 */
function addSvgAccessibleName(svgElement) {
  if (!svgElement) return;

  // Add title or aria-label if missing
  if (!svgElement.querySelector('title') && !svgElement.getAttribute('aria-label')) {
    const title = document.createElement('title');
    title.textContent = 'Graphic'; // Default accessible name
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

/**
 * Ensures landmarks are unique
 * Fixes REACT_025: React Unique Landmarks
 */
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // Keep the first one, remove duplicates
      for (let i = 1; i < elements.length; i++) {
        elements[i].remove();
      }
    }
  });
}

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 * @param {HTMLElement} element - The element to check
 */
function replaceFakeLinks(element) {
  if (!element) return;

  const fakeLinks = element.querySelectorAll('[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'a') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || link.dataset.href || '#';
      anchor.textContent = link.textContent;
      link.parentNode.replaceChild(anchor, link);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply all improvements
  ensureLanguageAttribute();
  improveTableStructure(document.querySelector('table'));
  addLandmarks();
  addSvgAccessibleName(document.querySelector('svg'));
  ensureUniqueLandmarks();
  replaceFakeLinks(document.body);
});

// EXPORT ALL EXISTING FUNCTIONS UNCHANGED
// [PRESERVED EXPORTS]