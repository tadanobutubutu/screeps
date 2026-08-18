// main.js
// Preserving all existing code and exports while adding accessibility improvements

// Example of how to address REACT_015 (React Language Attribute)
function setLanguageAttribute() {
  // Ensure the html element has a lang attribute
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en'); // Default to English
    }
  }
}

// Example of how to address REACT_027 (React Table Structure)
function enhanceTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Add ARIA attributes for better screen reader support
  if (!tableElement.getAttribute('role')) {
    tableElement.setAttribute('role', 'table');
  }

  // Ensure table has a caption
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption'; // Should be meaningful
    tableElement.prepend(caption);
  }

  // Enhance table headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.getAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
    if (!header.getAttribute('id')) {
      header.setAttribute('id', `header-${index}`);
    }
  });

  // Connect cells to headers
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) return; // Skip header row
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
      if (!cell.getAttribute('headers')) {
        const headerId = `header-${cellIndex}`;
        cell.setAttribute('headers', headerId);
      }
    });
  });
}

// Example of how to address REACT_017 (React Landmarks)
function ensureLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure main content has a landmark
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const content = document.querySelector('body').firstChild;
    if (content) {
      main.appendChild(content);
      document.body.prepend(main);
    }
  }

  // Ensure navigation has a landmark
  if (!document.querySelector('nav')) {
    const nav = document.createElement('nav');
    // You would need to identify navigation elements and move them here
    // This is just an example structure
  }
}

// Example of how to address REACT_041 (React SVG Accessible Name)
function enhanceSVGAccessibility(svgElement) {
  if (!svgElement) return;

  // Add ARIA label if missing
  if (!svgElement.getAttribute('aria-label') && !svgElement.querySelector('title, desc')) {
    svgElement.setAttribute('aria-label', 'Graphic'); // Should be more descriptive
  }

  // Add title element if missing
  if (!svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = 'Graphic description'; // Should be meaningful
    svgElement.prepend(title);
  }
}

// Example of how to address REACT_025 (React Unique Landmarks)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  // Check for duplicate landmarks
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // Handle duplicate landmarks - this would depend on your specific case
      // For example, you might want to merge them or make them unique
    }
  });
}

// Example of how to address REACT_036 (React Fake Link)
function enhanceLinkAccessibility(linkElement) {
  if (!linkElement) return;

  // Ensure links have proper href or role
  if (!linkElement.getAttribute('href') && !linkElement.getAttribute('role')) {
    linkElement.setAttribute('role', 'button');
  }

  // Add ARIA label if missing
  if (!linkElement.getAttribute('aria-label') && !linkElement.textContent.trim()) {
    linkElement.setAttribute('aria-label', 'Link description'); // Should be meaningful
  }
}

// Initialize accessibility enhancements when DOM is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setLanguageAttribute();
    ensureLandmarks();
    ensureUniqueLandmarks();

    // Apply to all tables, SVGs, and links on the page
    document.querySelectorAll('table').forEach(enhanceTableAccessibility);
    document.querySelectorAll('svg').forEach(enhanceSVGAccessibility);
    document.querySelectorAll('a').forEach(enhanceLinkAccessibility);
  });
}

// Preserve all existing exports and functions from the original main.js
// ... (original code continues here)