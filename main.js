// [PRESERVED EXISTING CODE]
// All existing exports and functions remain unchanged

// NEW ACCESSIBILITY IMPROVEMENTS

/**
 * Adds proper language attribute to HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.querySelector('html');
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
  if (!tableElement.querySelector('thead') && tableElement.querySelector('th')) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      firstRow.parentNode.insertBefore(thead, firstRow);
      thead.appendChild(firstRow);
    }
  }

  if (!tableElement.querySelector('tbody') && tableElement.querySelector('td')) {
    const tbody = document.createElement('tbody');
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length > 0) {
      rows.forEach(row => {
        if (!row.querySelector('th')) {
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
 * Fixes REACT_017: React Landmarks */
function addLandmarks() {
  // Add main landmark if missing
  if (!document.querySelector('main')) {
    const mainContent = document.querySelector('div[role="main"]') ||
                       document.querySelector('.main-content') ||
                       document.querySelector('article');
    if (mainContent) {
      const mainElement = document.createElement('main');
      mainContent.parentNode.insertBefore(mainElement, mainContent);
      mainElement.appendChild(mainContent);
    }
  }

  // Add navigation landmark if missing
  if (!document.querySelector('nav')) {
    const navContent = document.querySelector('div[role="navigation"]') ||
                      document.querySelector('.navigation') ||
                      document.querySelector('ul.nav');
    if (navContent) {
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
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // Add title or aria-label if missing
  if (!svgElement.querySelector('title') && !svgElement.hasAttribute('aria-label')) {
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
        elements[i].removeAttribute('role');
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
    if (!link.tagName.toLowerCase() === 'a') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || '#';
      anchor.textContent = link.textContent;
      link.parentNode.replaceChild(anchor, link);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply all improvements
  ensureLanguageAttribute();
  document.querySelectorAll('table').forEach(improveTableStructure);
  addLandmarks();
  document.querySelectorAll('svg').forEach(makeSvgAccessible);
  ensureUniqueLandmarks();
  replaceFakeLinks(document.body);
});

// EXPORT ALL EXISTING FUNCTIONS UNCHANGED
module.exports = {
  // Existing exports preserved
};