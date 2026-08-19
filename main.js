// main.js
// ... (existing imports and code above)

/**
 * Handles the rotation back functionality for the dependency graph
 */
function handleRotateBack() {
  // Implement the actual rotation logic here
  console.log('Rotating back to original view');
  // You might want to add actual rotation logic or state management here
}

// Add accessibility improvements
function ensureAccessibility() {
  // Ensure language attribute is set for screen readers
  document.documentElement.lang = 'en';

  // Add ARIA attributes to tables if they exist
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    if (!table.getAttribute('aria-describedby')) {
      table.setAttribute('aria-describedby', 'table-description');
    }
  });

  // Add landmarks for better navigation
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  // Ensure SVGs have accessible names
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'Graphical element');
    }
  });

  // Ensure unique landmarks
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });

  // Replace fake links with proper anchor tags
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(link => {
    if (link.getAttribute('role') === 'link' && !link.tagName.match(/^A$/i)) {
      const newLink = document.createElement('a');
      newLink.href = link.getAttribute('data-href') || '#';
      newLink.innerHTML = link.innerHTML;
      link.parentNode.replaceChild(newLink, link);
    }
  });
}

// Call the accessibility function when the DOM is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', ensureAccessibility);
}

// ... (existing code below)

// Example of how you might use this in a React component
// <button id="unrotate" onClick={handleRotateBack}>rotate back</button>