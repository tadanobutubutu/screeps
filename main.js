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
  if (!tableElement.querySelector('thead') && tableElement.rows.length > 0) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.rows[0];
    if (firstRow) {
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tableElement.querySelector('tbody') && tableElement.rows.length > 1) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(tableElement.rows);
    if (rows.length > 0) {
      rows.slice(1).forEach(row => {
        if (row.parentNode === tableElement) {
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
                       document.querySelector('#main-content');
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
                      document.querySelector('.navigation');
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
function ensureSvgAccessibleName(svgElement) {
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
      // Keep the first one, convert duplicates to sections
      for (let i = 1; i < elements.length; i++) {
        const element = elements[i];
        
        // Create a section element to replace duplicates
        const section = document.createElement('section');
        
        // Copy all attributes from the original element
        Array.from(element.attributes).forEach(attr => {
          section.setAttribute(attr.name, attr.value);
        });
        
        // Move all children to the new section element
        while (element.firstChild) {
          section.appendChild(element.firstChild);
        }
        
        // Add aria-label to section if there's no existing label
        if (!section.hasAttribute('aria-label') && !section.hasAttribute('aria-labelledby')) {
          section.setAttribute('aria-label', `${landmark} section ${i}`);
        }
        
        // Replace the duplicate landmark with the section
        element.parentNode.replaceChild(section, element);
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

  const fakeLinks = element.querySelectorAll('div[role="link"], span[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (link.getAttribute('role') === 'link' || link.tagName.toLowerCase() === 'span') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || '#';
      anchor.textContent = link.textContent;
      // Copy common attributes
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'role' && attr.name !== 'data-href') {
          anchor.setAttribute(attr.name, attr.value);
        }
      });
      link.parentNode.replaceChild(anchor, link);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply all improvements
  ensureLanguageAttribute();
  document.querySelectorAll('table').forEach(table => improveTableStructure(table));
  addLandmarks();
  document.querySelectorAll('svg').forEach(svg => ensureSvgAccessibleName(svg));
  ensureUniqueLandmarks();
  document.querySelectorAll('[role="link"]').forEach(el => replaceFakeLinks(el));
});

// EXPORT ALL EXISTING FUNCTIONS UNCHANGED
// [PRESERVED EXPORTS]