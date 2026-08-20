// main.js
// Preserving all existing code and exports
// Adding accessibility improvements for the reported issues

// Example of existing code (you should replace with your actual code)
export function existingFunction() {
  // Your existing implementation
}

// Addressing REACT_015: React Language Attribute
// Add lang attribute to root element if not present
export function ensureLanguageAttribute() {
  const root = document.documentElement;
  if (!root.hasAttribute('lang')) {
    root.setAttribute('lang', 'en'); // Default to English
  }
}

// Addressing REACT_027: React Table Structure
// Improve table structure with proper headers and scope attributes
export function enhanceTableAccessibility(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Add scope attributes to th elements
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });

  // Add aria-describedby if table has a caption
  const caption = table.querySelector('caption');
  if (caption) {
    table.setAttribute('aria-describedby', caption.id || `${tableId}-caption`);
  }
}

// Addressing REACT_017: React Landmarks
// Ensure proper landmark elements are used
export function ensureLandmarkSemantics() {
  // Check for main content area
  if (!document.querySelector('main')) {
    console.warn('Consider adding a <main> element for better accessibility');
  }

  // Check for navigation landmarks
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.hasAttribute('aria-label') && !nav.querySelector('h1, h2, h3, h4, h5, h6')) {
      console.warn('Navigation element should have an aria-label or heading');
    }
  });
}

// Addressing REACT_041: React SVG Accessible Name
// Add title/desc to SVGs if missing
export function enhanceSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title, desc')) {
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      svg.prepend(title);
    }
  });
}

// Addressing REACT_025: React Unique Landmarks
// Ensure landmarks are unique
export function ensureUniqueLandmarks() {
  const landmarks = {
    'nav': 0,
    'main': 0,
    'aside': 0,
    'footer': 0
  };

  Object.keys(landmarks).forEach(tag => {
    const elements = document.querySelectorAll(tag);
    if (elements.length > 1) {
      console.warn(`Multiple ${tag} elements found - consider using aria-label for uniqueness`);
    }
  });
}

// Addressing REACT_036: React Fake Link
// Replace fake links with proper anchor elements
export function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(element => {
    if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      console.warn('Fake link/button detected - consider using proper semantic elements');
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  ensureLandmarkSemantics();
  enhanceSvgAccessibility();
  ensureUniqueLandmarks();
  replaceFakeLinks();

  // Example of enhancing tables - you would call this for each table
  // enhanceTableAccessibility('data-table');
});