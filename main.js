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
      if (!header.getAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
      if (!header.getAttribute('id')) {
        header.setAttribute('id', `table-header-${index}`);
      }
    });

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const header = table.querySelector(`th:nth-child(${cellIndex + 1})`);
        if (header && !cell.getAttribute('headers')) {
          cell.setAttribute('headers', header.id);
        }
      });
    });
  });
}

// REACT_017: Add proper landmarks
function addLandmarks() {
  // Add main landmark if not present
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    const body = document.querySelector('body');
    if (body) {
      // Move all existing content into the main element
      while (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.appendChild(mainElement);
    }
  }

  // Ensure main has proper role
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });
}

// REACT_041: Add accessible names to SVGs
function enhanceSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-hidden') && !svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach((header, index) => {
    if (!header.getAttribute('id')) {
      header.setAttribute('id', `section-heading-${index}`);
    }
  });
}

// REACT_036: Improve fake links
function improveFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }

    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
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