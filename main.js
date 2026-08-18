// main.js
// [Existing code preserved as-is]

// Fix for REACT_015: React Language Attribute
// Add lang attribute to root element if missing
function ensureLanguageAttribute() {
  const rootElement = document.documentElement;
  if (!rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en'); // Default to English
  }
}

// Fix for REACT_027: React Table Structure
// Ensure tables have proper structure with thead, tbody, and scope attributes
function enhanceTableAccessibility(tableElement) {
  if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
    // Create proper table structure if missing
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Move existing rows to tbody
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    rows.forEach(row => {
      if (row.querySelector('th')) {
        thead.appendChild(row);
      } else {
        tbody.appendChild(row);
      }
    });

    tableElement.insertBefore(thead, tableElement.firstChild);
    tableElement.appendChild(tbody);
  }

  // Add scope attributes to headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Fix for REACT_017: React Landmarks
// Ensure proper ARIA landmarks are used
function ensureLandmarks() {
  const mainContent = document.querySelector('main');
  if (!mainContent) {
    const content = document.querySelector('div[role="main"]') ||
                   document.querySelector('article') ||
                   document.querySelector('section');
    if (content) {
      content.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has proper landmark
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }
}

// Fix for REACT_041: React SVG Accessible Name
// Add accessible names to SVGs
function makeSVGsAccessible() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      // Try to find a title or description
      const title = svg.querySelector('title');
      if (title && title.textContent.trim()) {
        svg.setAttribute('aria-labelledby', title.id || `svg-title-${Math.random().toString(36).substr(2, 9)}`);
      } else {
        // Add a generic label if none exists
        svg.setAttribute('aria-label', 'Decorative image');
      }
    }
  });
}

// Fix for REACT_025: React Unique Landmarks
// Ensure landmarks are unique
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'nav', 'search', 'region', 'complementary', 'contentinfo', 'form'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
}

// Fix for REACT_036: React Fake Link
// Replace fake links with proper anchor tags
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (!link.tagName.toLowerCase() === 'a') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || '#';
      anchor.innerHTML = link.innerHTML;
      link.parentNode.replaceChild(anchor, link);
    }
  });
}

// Initialize accessibility fixes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  document.querySelectorAll('table').forEach(enhanceTableAccessibility);
  ensureLandmarks();
  makeSVGsAccessible();
  ensureUniqueLandmarks();
  replaceFakeLinks();
});

// [All existing exports and functions preserved as-is]