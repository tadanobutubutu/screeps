// Existing code from main.js before conflict markers
// <<<<<<< HEAD
// ... existing code ...
// ========

// Required change to add the lang attribute to the root HTML element
document.documentElement.lang = 'en';

// Add ARIA attributes for better accessibility
function enhanceAccessibility() {
  // Ensure all tables have proper structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      table.insertAdjacentHTML('afterbegin', '<caption>Table description</caption>');
    }
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertAdjacentElement('afterbegin', thead);
      }
    }
  });

  // Add proper landmarks
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  // Ensure SVGs have accessible names
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });

  // Replace fake links with proper anchor elements
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.getAttribute('data-href') || '#';
    anchor.innerHTML = link.innerHTML;
    link.replaceWith(anchor);
  });
}

// Initialize accessibility enhancements when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceAccessibility);
} else {
  enhanceAccessibility();
}

// ... existing code ...
// >>>>>>> origin/main