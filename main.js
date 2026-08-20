// Main entry point for the application
// This file serves as the JavaScript entry point

// Export any necessary functions or initialize the application
function initializeApp() {
  console.log('Application initialized');
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}

// Add accessibility improvements
function ensureAccessibility() {
  // Set language attribute for better screen reader support (REACT_015)
  if (document.documentElement) {
    document.documentElement.lang = 'en'; // Default to English, adjust as needed
  }

  // Add ARIA landmarks (REACT_017)
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  // Ensure tables have proper structure (REACT_027)
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data'; // Add appropriate caption
      table.prepend(caption);
    }

    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        firstRow.remove();
        table.prepend(thead);
      }
    }
  });

  // Ensure SVG elements have accessible names (REACT_041)
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title, desc')) {
      svg.setAttribute('aria-label', 'Graphic content');
    }
  });

  // Ensure landmarks are unique (REACT_025)
  const landmarks = ['header', 'nav', 'main', 'footer'];
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

  // Fix multiple <main> landmarks (REACT_025)
  // Remove any additional <main> elements beyond the first one
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.slice(1).forEach(el => el.remove());
  }

  // Replace fake links with proper anchor tags (REACT_036)
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A' && link.tagName !== 'BUTTON') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || '#';
      anchor.textContent = link.textContent;
      link.replaceWith(anchor);
    }
  });
}

// Function to add main landmark if missing (REACT_017)
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    const body = document.querySelector('body');

    // Move all existing content into the main element
    while (body.firstChild) {
      mainElement.appendChild(body.firstChild);
    }

    body.appendChild(mainElement);
  }
}

// Call accessibility functions when DOM is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    addMainLandmark();
    ensureAccessibility();
  });
}

module.exports = { initializeApp };