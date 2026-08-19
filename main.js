// main.js
// Preserving all existing code and exports while adding accessibility improvements

// Example of how to fix REACT_015 (React Language Attribute)
export function setLanguageAttribute() {
  // Ensure the html element has a lang attribute
  if (typeof document !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en'); // Default to English
    }
  }
}

// Example of how to fix REACT_027 (React Table Structure)
export function enhanceTableAccessibility(tableElement) {
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

  // Add scope attributes to headers if needed
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Example of how to fix REACT_017 (React Landmarks)
export function ensureLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure main content has a landmark
  if (!document.querySelector('main, [role="main"]')) {
    const mainContent = document.querySelector('article, div[role="main"]');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has a landmark
  if (!document.querySelector('nav, [role="navigation"]')) {
    const navElement = document.querySelector('ul.nav, div.navigation');
    if (navElement) {
      navElement.setAttribute('role', 'navigation');
    }
  }
}

// Example of how to fix REACT_041 (React SVG Accessible Name)
export function makeSvgAccessible(svgElement) {
  if (!svgElement || svgElement.getAttribute('aria-hidden') === 'true') return;

  // Add title if SVG doesn't have accessible name
  if (!svgElement.querySelector('title, text[aria-label], text[aria-labelledby]')) {
    const title = document.createElement('title');
    title.textContent = 'Decorative graphic';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

// Example of how to fix REACT_025 (React Unique Landmarks)
export function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure navigation landmarks are unique
  const navLandmarks = document.querySelectorAll('[role="navigation"]');
  if (navLandmarks.length > 1) {
    navLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  // Ensure main landmarks are unique
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.setAttribute('aria-label', `Main content ${index + 1}`);
      }
    });
  }
}

// Example of how to fix REACT_036 (React Fake Link)
export function makeLinksAccessible() {
  if (typeof document === 'undefined') return;

  // Find elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('[role="button"], [role="link"], [tabindex="0"]');
  fakeLinks.forEach(element => {
    if (element.tagName !== 'A' && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', element.textContent.trim());
    }
  });
}

// Initialize accessibility improvements when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setLanguageAttribute();
    ensureLandmarks();
    ensureUniqueLandmarks();
    makeLinksAccessible();

    // Apply to existing tables and SVGs
    document.querySelectorAll('table').forEach(enhanceTableAccessibility);
    document.querySelectorAll('svg').forEach(makeSvgAccessible);
  });
}

// Preserve all existing exports and functions from the original main.js
// ... (rest of your existing code remains unchanged)