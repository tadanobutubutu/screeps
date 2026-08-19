// main.js
// [Preserve all existing imports and code above this section]

// Add accessibility improvements for tables (REACT_027)
function enhanceTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Add scope attributes to table headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Add summary if missing
  if (!tableElement.querySelector('caption') && tableElement.rows.length > 0) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table data';
    tableElement.insertBefore(caption, tableElement.firstChild);
  }
}

// Add landmark elements (REACT_017)
function ensureLandmarks() {
  // Ensure main content has a role="main" landmark
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  // Ensure navigation has a role="navigation" landmark
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

// Add accessible SVG names (REACT_041)
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // Add title and description if missing
  if (!svgElement.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Graphic';
    svgElement.insertBefore(title, svgElement.firstChild);
  }

  if (!svgElement.querySelector('desc')) {
    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Description of the graphic';
    svgElement.insertBefore(desc, svgElement.firstChild);
  }
}

// Prevent fake links from being announced as links (REACT_036)
function preventFakeLinks() {
  document.querySelectorAll('[role="button"], [role="link"]').forEach(element => {
    if (element.tagName === 'A' && !element.hasAttribute('href')) {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add language attribute to HTML element (REACT_015)
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  // Apply accessibility enhancements
  ensureLandmarks();
  preventFakeLinks();

  // Apply to all tables on the page
  document.querySelectorAll('table').forEach(table => {
    enhanceTableAccessibility(table);
  });

  // Apply to all SVGs on the page
  document.querySelectorAll('svg').forEach(svg => {
    makeSvgAccessible(svg);
  });
});

// [Preserve all existing exports and code below this section]