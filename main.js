// main.js
// Preserve all existing imports and functions

// Add these accessibility improvements
/**
 * Adds proper ARIA attributes to tables for better screen reader support
 * @param {HTMLElement} tableElement - The table element to enhance
 */
function enhanceTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Add ARIA attributes
  tableElement.setAttribute('role', 'table');
  tableElement.setAttribute('aria-describedby', 'table-description');

  // Enhance table headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((header, index) => {
    header.setAttribute('scope', 'col');
    header.setAttribute('id', `col-header-${index}`);
  });

  // Enhance table cells
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) return; // Skip header row

    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
      const headerId = `col-header-${cellIndex}`;
      cell.setAttribute('headers', headerId);
    });
  });
}

/**
 * Adds proper landmark roles to page sections
 */
function addLandmarkRoles() {
  // Add main content landmark
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
  }

  // Add navigation landmark
  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }

  // Add search landmark if present
  const search = document.querySelector('[role="search"]');
  if (search) {
    search.setAttribute('role', 'search');
  }
}

/**
 * Adds proper language attribute to HTML element
 */
function setLanguageAttribute() {
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en'); // Default to English
  }
}

/**
 * Initializes accessibility enhancements
 */
function initAccessibility() {
  // Set language attribute
  setLanguageAttribute();

  // Add landmark roles
  addLandmarkRoles();

  // Enhance all tables on the page
  const tables = document.querySelectorAll('table');
  tables.forEach(enhanceTableAccessibility);

  // Add event listeners for fake links
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN' && e.target.classList.contains('fake-link')) {
      e.preventDefault();
      const href = e.target.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    }
  });
}

// Initialize accessibility when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Preserve all existing exports and functions
// ... rest of your existing code ...