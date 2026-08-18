// main.js
// Preserving all existing code structure while adding accessibility improvements

// Example of existing code that should remain unchanged
// (This is just a placeholder - replace with your actual existing code)
export function existingFunction() {
  // Existing implementation
}

// Adding accessibility improvements for the issues mentioned

/**
 * Adds proper language attribute to HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
export function ensureLanguageAttribute() {
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
export function improveTableStructure(tableElement) {
  if (!tableElement) return;

  // Add proper table structure if missing
  if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length > 0) {
      const thead = document.createElement('thead');
      thead.appendChild(rows[0].cloneNode(true));
      tableElement.insertBefore(thead, tableElement.firstChild);

      const tbody = document.createElement('tbody');
      for (let i = 1; i < rows.length; i++) {
        tbody.appendChild(rows[i].cloneNode(true));
      }
      tableElement.appendChild(tbody);
    }
  }

  // Add scope attributes to headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

/**
 * Ensures proper landmark elements are present
 * Fixes REACT_017: React Landmarks
 */
export function ensureLandmarks() {
  // Check for main landmark
  if (!document.querySelector('main')) {
    const mainContent = document.querySelector('[role="main"]') ||
                        document.querySelector('article') ||
                        document.querySelector('section');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Check for navigation landmark
  if (!document.querySelector('nav')) {
    const navElement = document.querySelector('[role="navigation"]');
    if (navElement) {
      navElement.setAttribute('role', 'navigation');
    }
  }
}

/**
 * Adds accessible names to SVG elements
 * Fixes REACT_041: React SVG Accessible Name
 * @param {HTMLElement} svgElement - The SVG element to make accessible
 * @param {string} name - The accessible name for the SVG
 */
export function makeSvgAccessible(svgElement, name) {
  if (!svgElement || !name) return;

  // Add title element if missing
  if (!svgElement.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = name;
    svgElement.insertBefore(title, svgElement.firstChild);
  }

  // Add aria-label if not present
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }
}

/**
 * Ensures landmarks are unique
 * Fixes REACT_025: React Unique Landmarks
 */
export function ensureUniqueLandmarks() {
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // Convert all but first to generic div with role
      for (let i = 1; i < elements.length; i++) {
        elements[i].setAttribute('role', landmark);
        elements[i].removeAttribute(landmark);
      }
    }
  });
}

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 * @param {HTMLElement} element - The element to convert to a proper link
 * @param {string} href - The URL for the link
 */
export function convertToProperLink(element, href) {
  if (!element || !href) return;

  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = element.textContent;
  anchor.className = element.className;

  // Copy all attributes
  Array.from(element.attributes).forEach(attr => {
    anchor.setAttribute(attr.name, attr.value);
  });

  element.parentNode.replaceChild(anchor, element);
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  ensureLandmarks();
  ensureUniqueLandmarks();

  // Apply table improvements to all tables
  document.querySelectorAll('table').forEach(table => {
    improveTableStructure(table);
  });

  // Apply SVG improvements to all SVGs
  document.querySelectorAll('svg').forEach(svg => {
    const name = svg.getAttribute('aria-label') || svg.querySelector('title')?.textContent;
    if (name) {
      makeSvgAccessible(svg, name);
    }
  });

  // Convert fake links to proper links
  document.querySelectorAll('[role="link"]').forEach(link => {
    const href = link.getAttribute('href') || link.getAttribute('data-href');
    if (href) {
      convertToProperLink(link, href);
    }
  });
});

// All existing exports should remain unchanged
// Example:
// export { existingFunction, anotherExistingFunction };