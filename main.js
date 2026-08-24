// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue
//

// Main initialization function that sets up accessibility features
function initializeAccessibility() {
  // REACT_015: Add lang attribute to HTML element
  document.documentElement.lang = 'en';
  document.documentElement.setAttribute('lang', 'en');
  
  // REACT_017: Fix landmark issues
  ensureLandmarks();
  
  // REACT_041: Add accessible names to SVGs
  addSvgAccessibleNames();
  
  // REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks();
  
  // REACT_036: Fix fake link issues
  fixFakeLinks();
  
  // Additional integration: fix table structure accessibility where applicable
  fixTableAccessibility();
}

// Function to ensure proper landmark structure
function ensureLandmarks() {
  // Add main landmark if missing
  const mainContent = document.querySelector('main') || document.querySelector('.main-content');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
    if (!mainContent.id) {
      mainContent.id = 'main-content';
    }
  }
  
  // Add navigation landmarks
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      const labels = ['Primary navigation', 'Secondary navigation', 'Footer navigation'];
      nav.setAttribute('aria-label', labels[index] || 'Navigation');
    }
    if (!nav.id) {
      nav.id = `navigation-${index + 1}`;
    }
  });
  
  // Add banner landmark
  const header = document.querySelector('header') || document.querySelector('.header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  if (header && !header.id) {
    header.id = 'banner-landmark';
  }
  
  // Add contentinfo landmark
  const footer = document.querySelector('footer') || document.querySelector('.footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  if (footer && !footer.id) {
    footer.id = 'contentinfo-landmark';
  }
}

// Function to add accessible names to SVG elements
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      // Integrate title element pattern for robust accessible naming
      const titleId = `svg-title-${index + 1}`;
      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleEl.id = titleId;
      const labels = ['Search icon', 'Menu icon'];
      titleEl.textContent = labels[index] || `Icon ${index + 1}`;
      svg.insertBefore(titleEl, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
    }
    
    // Ensure SVG has role
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
  // Handle elements with landmark roles, ensuring unique IDs and names
  const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo'];
  
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `unique-landmark-${role}-${index + 1}`;
      }
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', `${role} ${index + 1}`);
      }
    });
  });
}

// Function to fix table accessibility structure
function fixTableAccessibility() {
  document.querySelectorAll('table').forEach((table, tableIndex) => {
    const headers = table.querySelectorAll('th');
    headers.forEach((th, idx) => {
      if (!th.id) {
        th.id = `table-${tableIndex}-header-${idx}`;
      }
    });
  });
}

// Function to fix fake link issues
function fixFakeLinks() {
  // Find elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('[onclick*="location"], [tabindex]:not(a):not(button):not(input)');
  
  fakeLinks.forEach(element => {
    const onClick = element.getAttribute('onclick');
    if (onClick && onClick.includes('location')) {
      // Convert to proper anchor element
      const hrefMatch = onClick.match(/['"]([^'"]*)['"]/);
      if (hrefMatch && hrefMatch[1]) {
        const href = hrefMatch[1];
        const anchor = document.createElement('a');
        anchor.href = href;
        
        // Copy attributes and content
        Array.from(element.attributes).forEach(attr => {
          if (attr.name !== 'onclick' && attr.name !== 'tabindex') {
            anchor.setAttribute(attr.name, attr.value);
          }
        });
        
        anchor.innerHTML = element.innerHTML;
        anchor.style.cssText = element.style.cssText;
        
        element.parentNode.replaceChild(anchor, element);
      }
    } else {
      // Apply button roles and pressed state for non-anchor interactive elements
      if (element.getAttribute('tabindex') === '0' || element.getAttribute('tabindex') === '') {
        if (!element.hasAttribute('role')) {
          element.setAttribute('role', 'button');
        }
        if (!element.hasAttribute('aria-pressed')) {
          element.setAttribute('aria-pressed', 'false');
        }
      }
    }
  });
}

// Export functions for use in application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    ensureLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    fixTableAccessibility
  };
}

// Initialize accessibility when DOM is loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}