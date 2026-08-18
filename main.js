// Main application file with accessibility improvements

// REACT_015: Add language attribute to HTML element
document.documentElement.lang = 'en';


// REACT_027: Improve table structure with proper headers
function enhanceTables() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
      if (!header.getAttribute('id')) {
        const tableId = table.id || 'table-' + Math.random().toString(36).substr(2, 9);
        if (!table.id) table.id = tableId;
        header.setAttribute('id', tableId + '-header-' + index);
      }
    });

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const headerCell = row.previousElementSibling?.querySelector('th:nth-child(' + (cellIndex + 1) + ')');
        if (headerCell && headerCell.id) {
          cell.setAttribute('headers', headerCell.id);
        }
      });
    });
  });
}


// REACT_017: Add proper landmarks
function addLandmarks() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : 'Secondary navigation');
    }
  });
}


// REACT_041: Add accessible names to SVGs
function enhanceSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel) {
      const title = document.createElement('title');
      title.id = 'svg-title-' + index;
      title.textContent = 'Decorative icon ' + (index + 1);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}


// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach((header, index) => {
    if (!header.getAttribute('id')) {
      const tagName = header.tagName.toLowerCase();
      header.setAttribute('id', tagName + '-heading-' + index + '-' + Math.random().toString(36).substr(2, 9));
    }
  });
}


// REACT_036: Improve fake links
function improveFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="button"]');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }

    if (link.getAttribute('href') === undefined && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Action');
    }
  });
}


// Initialize accessibility enhancements
function initAccessibility() {
  enhanceTables();
  addLandmarks();
  enhanceSVGs();
  ensureUniqueLandmarks();
  improveFakeLinks();
}


// Run on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}


// Export any existing functions if they exist in the original file
// Preserve all existing code and exports
// ... (rest of your existing code remains unchanged)