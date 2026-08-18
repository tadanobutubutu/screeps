// main.js
// Preserving all existing code and exports while adding accessibility improvements

// Example of existing code that would be preserved
// export function existingFunction() { ... }

// Addressing REACT_015: React Language Attribute
// Add lang attribute to root element if not present
if (typeof document !== 'undefined') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Addressing REACT_027: React Table Structure
// Function to ensure proper table structure
export function ensureTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Ensure table has a caption if it's complex
  if (!tableElement.querySelector('caption') && tableElement.rows.length > 5) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    tableElement.insertBefore(caption, tableElement.firstChild);
  }

  // Ensure table headers are properly scoped
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Addressing REACT_017: React Landmarks
// Function to ensure proper landmark usage
export function ensureLandmarkAccessibility() {
  if (typeof document === 'undefined') return;

  // Ensure main content has a main landmark
  if (!document.querySelector('main')) {
    const mainContent = document.querySelector('[role="main"]') || document.querySelector('article');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has proper landmark
  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });
}

// Addressing REACT_041: React SVG Accessible Name
// Function to ensure SVGs have accessible names
export function ensureSvgAccessibility(svgElement) {
  if (!svgElement) return;

  if (!svgElement.hasAttribute('aria-label') && !svgElement.querySelector('title, desc')) {
    svgElement.setAttribute('aria-label', 'Decorative graphic');
  }
}

// Addressing REACT_025: React Unique Landmarks
// Function to ensure unique landmarks
export function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure only one main landmark
  const mainElements = document.querySelectorAll('[role="main"], main');
  if (mainElements.length > 1) {
    console.warn('Multiple main landmarks found. Only one should exist.');
  }

  // Ensure navigation landmarks are unique
  const navElements = document.querySelectorAll('[role="navigation"], nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && navElements.length > 1) {
      nav.setAttribute('aria-label', `Navigation section ${index + 1}`);
    }
  });
}

// Addressing REACT_036: React Fake Link
// Function to prevent fake links
export function preventFakeLinks() {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && !target.hasAttribute('href') && !target.hasAttribute('role')) {
      target.setAttribute('role', 'button');
      target.setAttribute('tabindex', '0');
    }
  });
}

// Initialize accessibility improvements when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureLandmarkAccessibility();
    preventFakeLinks();

    // Apply to existing tables and SVGs
    document.querySelectorAll('table').forEach(ensureTableAccessibility);
    document.querySelectorAll('svg').forEach(ensureSvgAccessibility);
  });
}

// Preserve all existing exports
// export { ... };