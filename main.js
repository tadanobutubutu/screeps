// main.js
// [Existing code preserved as-is]

// Fix for REACT_015: React Language Attribute
// Add lang attribute to root element
document.documentElement.lang = 'en';

// Fix for REACT_027: React Table Structure
// Ensure tables have proper structure with <thead>, <tbody>, and <th> elements
function enhanceTableAccessibility(tableElement) {
  if (!tableElement) {
    console.warn('Table structure needs improvement for better accessibility');
    return;
  }

  // Add scope attributes to table headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Determine if this is a row or column header based on context
      const parentRow = header.closest('tr');
      const parentTable = header.closest('table');
      const isRowHeader = parentRow && parentTable && parentRow.parentElement.tagName === 'THEAD';
      header.setAttribute('scope', isRowHeader ? 'col' : 'row');
    }
  });

  // Ensure table has proper structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  
  if (!thead) {
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      const newThead = document.createElement('thead');
      newThead.appendChild(firstRow);
      tableElement.insertBefore(newThead, tableElement.firstChild);
    }
  }

  if (!tbody) {
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    const existingThead = tableElement.querySelector('thead');
    const rowsToMove = existingThead ? rows.filter(r => r.parentElement !== existingThead) : rows;
    
    if (rowsToMove.length > 0) {
      const newTbody = document.createElement('tbody');
      rowsToMove.forEach(row => newTbody.appendChild(row));
      tableElement.appendChild(newTbody);
    }
  }
}

// Fix for REACT_017: React Landmarks
// Add proper ARIA landmarks
function addLandmarks() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });

  // Add landmark to footer if present
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Fix for REACT_041: React SVG Accessible Name
// Add title/desc to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const hasTitle = svg.querySelector('title');
    if (!hasTitle) {
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      svg.prepend(title);
      
      // Link title to SVG with aria-labelledby
      const existingLabel = svg.getAttribute('aria-labelledby');
      const newLabel = existingLabel ? `${existingLabel} ${title.id}` : title.id;
      svg.setAttribute('aria-labelledby', newLabel);
    }
  });
}

// Fix for REACT_025: React Unique Landmarks
// Ensure landmarks are unique
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'region', 'complementary', 'banner', 'contentinfo'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
      console.warn(`Multiple elements with role="${role}" found. Consider making them unique.`);
    }
  });
}

// Fix for REACT_036: React Fake Link
// Replace fake links with proper <a> elements
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [data-href], [tabindex="0"]:not(button):not(a):not(input):not(select):not(textarea)');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      const href = link.getAttribute('data-href') || link.getAttribute('href');
      const text = link.textContent;
      const ariaLabel = link.getAttribute('aria-label') || text;
      
      if (href) {
        const newLink = document.createElement('a');
        newLink.href = href;
        newLink.textContent = text;
        newLink.setAttribute('aria-label', ariaLabel);
        
        // Copy over common attributes
        ['className', 'id'].forEach(attr => {
          if (link[attr]) newLink[attr] = link[attr];
        });
        
        // Copy styles
        if (link.style) {
          newLink.style.cssText = link.style.cssText;
        }
        
        // Replace the fake link
        if (link.parentNode) {
          link.parentNode.replaceChild(newLink, link);
        }
      } else {
        console.warn('Fake link detected. Consider using proper <a> elements.');
      }
    }
  });
}

// Initialize accessibility enhancements
function initAccessibility() {
  addLandmarks();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  replaceFakeLinks();

  // Enhance all tables on the page
  document.querySelectorAll('table').forEach(table => {
    enhanceTableAccessibility(table);
  });
}

// Run on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// [Existing exports preserved as-is]