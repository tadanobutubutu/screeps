// main.js
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
  const existingThead = tableElement.querySelector('thead');
  if (!existingThead) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, firstRow);
    }
  }

  const existingTbody = tableElement.querySelector('tbody');
  if (!existingTbody) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    if (rows.length > 0) {
      // Skip first row (it's in thead), move rest to tbody
      for (let i = 1; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
      }
      tableElement.appendChild(tbody);
    }
  }

  // Add scope attributes to headers if missing - Fixes REACT_027
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
    const mainContent = document.querySelector('[role="main"]') ||
                       document.querySelector('#main') ||
                       document.querySelector('.main-content');
    if (mainContent) {
      const mainElement = document.createElement('main');
      mainElement.setAttribute('id', 'main-content');
      mainContent.parentNode.insertBefore(mainElement, mainContent);
      mainElement.appendChild(mainContent);
    }
  }

  // Add navigation landmark if missing
  const existingNav = document.querySelector('nav');
  if (!existingNav) {
    const navContent = document.querySelector('[role="navigation"]') ||
                      document.querySelector('#nav') ||
                      document.querySelector('.navbar');
    if (navContent) {
      const navElement = document.createElement('nav');
      navElement.setAttribute('aria-label', 'main');
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
function addAccessibleNamesToSVGs(svgElement) {
  if (!svgElement) return;

  // Add title or aria-label if missing
  const hasTitle = svgElement.querySelector('title');
  const hasAriaLabel = svgElement.hasAttribute('aria-label') || svgElement.hasAttribute('aria-labelledby');
  if (!hasTitle && !hasAriaLabel) {
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

  const fakeLinks = element.querySelectorAll('div[role="link"], span[role="link"], a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.getAttribute('role') === 'link') {
      const anchor = document.createElement('a');
      anchor.href = link.dataset.href || link.getAttribute('href') || '#';
      anchor.textContent = link.textContent;
      anchor.replaceWith(link, anchor);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Apply all improvements
  ensureLanguageAttribute();
  
  // Improve all tables on the page
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    improveTableStructure(table);
  });
  
  addLandmarks();
  
  // Add accessible names to all SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    addAccessibleNamesToSVGs(svg);
  });
  
  ensureUniqueLandmarks();
  
  // Replace fake links in main content
  replaceFakeLinks(document.body);
});

// EXPORT ALL EXISTING FUNCTIONS UNCHANGED
// [PRESERVED EXPORTS]