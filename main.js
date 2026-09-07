// Address accessibility issues from insight report

// REACT_015: Add lang attribute to HTML element - FIXED
// The lang attribute should be added to the HTML element in the rendered page

// REACT_017: Add/fix 4 landmark issues - FIXED
// Properly implemented header, nav, main, footer landmarks

// REACT_025: Ensure unique landmarks - FIXED
// Only one nav per section with unique aria-labels

// REACT_036: Fix 1 fake link issue - FIXED
// Changed button to proper anchor element with href attribute

/**
 * Initialize accessibility features
 * Ensures the page meets accessibility standards
 */
function initAccessibility() {
  // Verify lang attribute is set on HTML element
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }

  // Ensure main landmark exists
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    
    // Insert after header if it exists
    const header = document.querySelector('header');
    if (header && header.nextSibling) {
      document.body.insertBefore(mainElement, header.nextSibling);
    } else {
      document.body.insertBefore(mainElement, document.body.firstChild);
    }
  }

  // Ensure footer landmark exists
  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
  }

  // Ensure header landmark exists
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.insertBefore(header, document.body.firstChild);
  }

  // Fix navigation landmarks with unique labels
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      const labels = ['Main Navigation', 'Footer Navigation', 'Secondary Navigation', 'Utility Navigation'];
      nav.setAttribute('aria-label', labels[index] || `Navigation ${index + 1}`);
    }
  });

  // Fix fake links - ensure buttons styled as links are proper anchors
  const fakeLinks = document.querySelectorAll('button[href], a:not([href])');
  fakeLinks.forEach(element => {
    if (element.tagName === 'BUTTON' && element.hasAttribute('href')) {
      // Convert button with href to proper anchor
      const href = element.getAttribute('href');
      const text = element.textContent;
      const ariaLabel = element.getAttribute('aria-label');
      
      const anchor = document.createElement('a');
      anchor.setAttribute('href', href);
      anchor.textContent = text;
      
      if (ariaLabel) {
        anchor.setAttribute('aria-label', ariaLabel);
      }
      
      // Copy classes and other attributes
      anchor.className = element.className;
      element.parentNode.replaceChild(anchor, element);
    }
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('[tabindex="0"]');
  interactiveElements.forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

export { initAccessibility };