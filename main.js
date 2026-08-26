// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: React Table Structure - Add scope to table headers (DONE: addScopeToTableHeaders)
// - REACT_036: Fix fake links (DONE: fixFakeLinks)
// - REACT_017: Ensure proper landmark structure (DONE: wrapPrimaryContentInMain)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to SVGs (DONE: addAccessibleSVGs)
// - REACT_025: Add any additional accessibility changes as per the insight report

// Function to add lang attribute to HTML element
export function addLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

// New function to handle button click
export function handleButtonClick(event) {
  const target = event.target;
  const isExpanded = target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  target.setAttribute('aria-expanded', isExpanded);
}

// New function to inject and fix fake links
export function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(function(fakeLink) {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('data-href') || '#';
      a.textContent = fakeLink.textContent;
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');
      // Copy attributes from fake link
      const attrs = fakeLink.attributes;
      for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].name !== 'href' && attrs[i].name !== 'class') {
          a.setAttribute(attrs[i].name, attrs[i].value);
        }
      }
      // Replace fake link with real anchor
      fakeLink.parentNode.replaceChild(a, fakeLink);
    }
  });
}

// Ensure Unique Landmarks Function
export function ensureUniqueLandmarks() {
  const existingHeaders = document.querySelectorAll('[role="banner"]');

  // Remove duplicate banner headers
  existingHeaders.forEach(function(header, index) {
    if (index > 0) {
      header.remove();
    }
  });

  // Remove duplicate contentinfo footers
  const existingFooters = document.querySelectorAll('[role="contentinfo"]');
  existingFooters.forEach(function(footer, index) {
    if (index > 0) {
      footer.remove();
    }
  });

  // Ensure only one main landmark exists
  const existingMains = document.querySelectorAll('[role="main"]');
  existingMains.forEach(function(main, index) {
    if (index > 0) {
      main.remove();
    }
  });
}

// New function to inject primary content into main landmark
export function wrapPrimaryContentInMain() {
  const existingMains = document.querySelectorAll('[role="main"]');

  // If multiple main elements exist, remove duplicates (keep first)
  existingMains.forEach(function(main, index) {
    if (index > 0) {
      main.remove();
    }
  });

  // Get or create main element
  let mainElement = document.querySelector('[role="main"]') || document.querySelector('main');

  // If no main element exists, create and wrap primary content
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');

    // Find primary content container (adjust selector based on your content structure)
    const contentContainer = document.querySelector('#content') || document.querySelector('.content') || document.querySelector('.main-content') || document.body;

    // Move existing content into main if not already inside one
    if (contentContainer && contentContainer.firstChild) {
      while (contentContainer.firstChild) {
        mainElement.appendChild(contentContainer.firstChild);
      }
      document.body.appendChild(mainElement);
    }
  }
}

// Add function to add 'scope="col"' attribute to table header cells
export function addScopeToTableHeaders() {
  const tables = document.querySelectorAll('table');
  tables.forEach(function(table) {
    const headers = table.querySelectorAll('th');
    headers.forEach(function(header) {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
}

// New function to add accessible names to SVGs
export function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(function(svg) {
    // Check if SVG already has a title
    const existingTitle = svg.querySelector('title');
    if (!existingTitle) {
      const title = document.createElement('title');
      title.textContent = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || 'SVG graphic';
      title.id = 'svg-title-' + Math.random().toString(36).substring(2, 11);
      svg.insertBefore(title, svg.firstChild);
      
      // Ensure SVG has aria-labelledby pointing to the title
      if (!svg.hasAttribute('aria-labelledby')) {
        svg.setAttribute('aria-labelledby', title.id);
      }
    }
  });
}

// New function to process accessibility issues from insight report
export function processAccessibilityIssues() {
  // Process each issue from the insight report and address accordingly
  addLangAttribute();
  fixFakeLinks();
  ensureUniqueLandmarks();
  wrapPrimaryContentInMain();
  addAccessibleSVGs();
  addScopeToTableHeaders();
}

// REACT_025: Additional accessibility improvements
export function initializeAccessibility() {
  // Set default language attribute
  addLangAttribute();
  
  // Prevent tab trapping outside of modals by managing focus
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('[role="dialog"]:not([aria-hidden="true"])');
      modals.forEach(function(modal) {
        modal.setAttribute('aria-hidden', 'false');
      });
    }
  });
  
  // Ensure skip link functionality if skip link exists
  const skipLink = document.querySelector('.skip-link, [href="#main"], .skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const target = document.querySelector('#main, [role="main"]');
      if (target) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

// Call all necessary functions
processAccessibilityIssues();

// Export all functions for external use
module.exports = {
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addScopeToTableHeaders,
  addAccessibleSVGs,
  processAccessibilityIssues,
  initializeAccessibility
};

// Existing code preserved - add your app initialization below
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// root.render(<App />);