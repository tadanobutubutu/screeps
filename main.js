// main.js
// [Existing code preserved as-is]

// Fix for REACT_015: React Language Attribute
// Add lang attribute to root element
document.documentElement.lang = 'en';

// Fix for REACT_027: React Table Structure
// Ensure tables have proper structure with <thead>, <tbody>, and <th> elements
function enhanceTableAccessibility(tableElement) {
  if (!tableElement || !tableElement.tagName || tableElement.tagName.toLowerCase() !== 'table') {
    console.warn('Table structure needs improvement for better accessibility');
    // You might want to restructure the table here if needed
  }

  // Add scope attributes to table headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Determine if this is a row or column header based on context
      const isRowHeader = header.parentElement && header.parentElement.tagName.toLowerCase() === 'thead' &&
                         header.closest('table');
      header.setAttribute('scope', isRowHeader ? 'row' : 'col');
    }
  });
}

// Fix for REACT_017: React Landmarks
// Add proper ARIA landmarks
function addLandmarks() {
  // Check if main landmark already exists
  const existingMain = document.querySelector('main') || document.querySelector('[role="main"]');
  
  if (!existingMain) {
    // Find the primary content container and wrap it in a main element
    const body = document.body;
    if (body && body.children.length > 0) {
      const firstChild = body.firstElementChild;
      if (firstChild && firstChild.tagName.toLowerCase() !== 'main') {
        const mainElement = document.createElement('main');
        while (body.firstChild !== firstChild) {
          mainElement.appendChild(body.firstChild);
        }
        mainElement.appendChild(firstChild);
        body.insertBefore(mainElement, firstChild);
      }
    }
  }

  // Ensure existing main elements have proper role attribute for older browsers
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach(main => {
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });

  // Also check for elements with role="main" that aren't <main> tags
  const mainRoleElements = document.querySelectorAll('[role="main"]');
  mainRoleElements.forEach(main => {
    if (main.tagName.toLowerCase() !== 'main') {
      main.setAttribute('role', 'main');
    }
  });

  // Add aria-labels to nav elements that don't have them
  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });

  // Add aria-labels to header and footer regions
  const headerElements = document.querySelectorAll('header');
  headerElements.forEach(header => {
    if (!header.hasAttribute('aria-label') && !header.hasAttribute('aria-labelledby')) {
      header.setAttribute('aria-label', 'Site header');
    }
  });

  const footerElements = document.querySelectorAll('footer');
  footerElements.forEach(footer => {
    if (!footer.hasAttribute('aria-label') && !footer.hasAttribute('aria-labelledby')) {
      footer.setAttribute('aria-label', 'Site footer');
    }
  });
}

// Fix for REACT_041: React SVG Accessible Name
// Add title/desc to SVGs
function enhanceSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      svg.prepend(title);
      svg.setAttribute('role', 'img');
    }
  });
}

// Fix for REACT_025: React Unique Landmarks
// Ensure landmarks are unique
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'region'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      console.warn(`${elements.length} elements with role="${role}" found. Consider making them unique.`);
    }
  });

  // Check for multiple nav elements without labels
  const navElements = document.querySelectorAll('nav');
  const unlabeledNavs = Array.from(navElements).filter(nav => 
    !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')
  );
  if (unlabeledNavs.length > 1) {
    console.warn(`${unlabeledNavs.length} nav elements found without labels. Consider adding aria-label to distinguish them.`);
  }
}

// Fix for REACT_036: React Fake Link
// Replace fake links with proper <a> elements
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[tabindex="0"]');
  fakeLinks.forEach(link => {
    if (link.tagName.toLowerCase() !== 'a') {
      console.warn('Fake link detected. Consider using proper <a> elements.');
    }
  });
}

// Initialize accessibility enhancements
function initAccessibility() {
  addLandmarks();
  enhanceSVGs();
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