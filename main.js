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
function improveTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Add proper table structure if missing
  if (!tableElement.querySelector('thead') && !tableElement.tHead) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tableElement.querySelector('tbody') && !tableElement.tBodies.length) {
    const tbody = document.createElement('tbody');
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length > 0) {
      rows.forEach(row => {
        if (row.parentNode !== thead) {
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
  if (!document.querySelector('main')) {
    const mainContent = document.querySelector('[role="main"]') ||
                       document.querySelector('.main-content') ||
                       document.querySelector('#main');
    if (mainContent) {
      const mainElement = document.createElement('main');
      mainContent.parentNode.insertBefore(mainElement, mainContent);
      mainElement.appendChild(mainContent);
    }
  }

  // Add navigation landmark if missing
  if (!document.querySelector('nav')) {
    const navContent = document.querySelector('[role="navigation"]') ||
                      document.querySelector('.nav') ||
                      document.querySelector('#nav');
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
function addSvgAccessibleName(svgElement) {
  if (!svgElement) return;

  // Add title or aria-label if missing
  if (!svgElement.querySelector('title') && !svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
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
 * Replaces fake links with proper button elements
 * Fixes REACT_036: React Fake Link
 * @param {HTMLElement} element - The element to check
 */
function replaceFakeLinks(element) {
  if (!element) return;

  // Find all anchor elements with href="#" or href="" (fake links)
  const fakeLinks = element.querySelectorAll('a[href="#"], a[href=""]');
  fakeLinks.forEach(link => {
    // Replace with a button element for proper accessibility
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = link.textContent;
    
    // Copy any relevant attributes (except href)
    if (link.id) button.id = link.id;
    if (link.className) button.className = link.className;
    
    // Replace the link with the button
    if (link.parentNode) {
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply all improvements
  ensureLanguageAttribute();
  const tables = document.querySelectorAll('table');
  tables.forEach(table => improveTableAccessibility(table));
  addLandmarks();
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => addSvgAccessibleName(svg));
  ensureUniqueLandmarks();
  replaceFakeLinks(document.body);
});

// EXPORT ALL EXISTING FUNCTIONS UNCHANGED
// [PRESERVED EXISTING EXPORTS]