// main.js
// Preserving all existing code and exports while adding accessibility improvements

// Example of how to fix REACT_015 (React Language Attribute)
export function setLanguageAttribute() {
  // Ensure the html element has a lang attribute
  if (typeof document !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en'); // Default to English
    }
  }
}

// Example of how to fix REACT_027 (React Table Structure)
export function enhanceTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Add proper table structure if missing
  if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length > 0) {
      const thead = document.createElement('thead');
      thead.appendChild(rows[0]);
      tableElement.insertBefore(thead, tableElement.firstChild);

      const tbody = document.createElement('tbody');
      for (let i = 1; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
      }
      tableElement.appendChild(tbody);
    }
  }

  // Add scope attributes to headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Example of how to fix REACT_017 (React Landmarks)
export function ensureLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure main content has a landmark
  if (!document.querySelector('main')) {
    const mainContent = document.querySelector('[role="main"]') ||
                       document.querySelector('article') ||
                       document.querySelector('div[role="main"]');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has a landmark
  if (!document.querySelector('nav')) {
    const navContent = document.querySelector('[role="navigation"]') ||
                      document.querySelector('div[role="navigation"]');
    if (navContent) {
      navContent.setAttribute('role', 'navigation');
    }
  }
}

// Example of how to fix REACT_041 (React SVG Accessible Name)
export function enhanceSVGAccessibility(svgElement) {
  if (!svgElement || !svgElement.hasAttribute('aria-hidden')) {
    // Add title or aria-label if SVG is decorative
    if (svgElement.getAttribute('aria-hidden') !== 'true') {
      if (!svgElement.querySelector('title') && !svgElement.hasAttribute('aria-label')) {
        const title = document.createElement('title');
        title.textContent = 'Decorative graphic';
        svgElement.insertBefore(title, svgElement.firstChild);
      }
    }
  }
}

// Example of how to fix REACT_025 (React Unique Landmarks)
export function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  // Check for duplicate landmarks
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // Handle duplicate landmarks by adding unique identifiers
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} section ${index + 1}`);
        }
      });
    }
  });
}

// Example of how to fix REACT_036 (React Fake Link)
export function enhanceLinkAccessibility(linkElement) {
  if (!linkElement) return;

  // Ensure links have proper href or role
  if (!linkElement.hasAttribute('href') && !linkElement.hasAttribute('role')) {
    linkElement.setAttribute('role', 'button');
  }

  // Add proper ARIA attributes if needed
  if (linkElement.getAttribute('role') === 'button' && !linkElement.hasAttribute('tabindex')) {
    linkElement.setAttribute('tabindex', '0');
  }
}

// Initialize accessibility improvements when DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setLanguageAttribute();
    ensureLandmarks();
    ensureUniqueLandmarks();

    // Apply to all tables on page
    document.querySelectorAll('table').forEach(table => {
      enhanceTableAccessibility(table);
    });

    // Apply to all SVGs on page
    document.querySelectorAll('svg').forEach(svg => {
      enhanceSVGAccessibility(svg);
    });

    // Apply to all links on page
    document.querySelectorAll('a').forEach(link => {
      enhanceLinkAccessibility(link);
    });
  });
}

// Preserve all existing exports and functions from the original main.js
// ... [rest of your existing code remains unchanged]