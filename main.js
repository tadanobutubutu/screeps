// Address accessibility issues from insight report
// Main entry point for the library
// Version: 1.0.0

// Skip navigation link for keyboard users
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Handle skip link click
skipLink.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
});

// Mark the main content area as a primary region
const mainElement = document.querySelector('main');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

// Your new accessibility improvements
document.documentElement.lang = 'en';

// Ensure tables have proper structure and unique captions
document.querySelectorAll('table').forEach(table => {
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    table.setAttribute('role', 'presentation'); // Tables without headers are presentational
  } else {
    // Add border attribute for visual clarity if not present
    if (!table.getAttribute('border')) {
      table.setAttribute('border', '1');
    }
    // Ensure table headers have scope attributes for better screen reader context
    headers.forEach(header => {
      if (!header.getAttribute('scope')) {
        header.setAttribute('scope', 'col'); // default to column scope; adjust if needed
      }
    });
    // Add or update caption for table context
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
  }
});

// Improve SVG accessibility: add title and accessible name
document.querySelectorAll('svg').forEach(svg => {
  const title = svg.querySelector('title');
  if (!title && svg.textContent.trim()) {
    const titleElem = document.createElement('title');
    titleElem.textContent = 'SVG content description';
    svg.insertBefore(titleElem, svg.firstChild);
  }
  // If there is no accessible name, provide a generic one
  if (!title && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Illustration');
  }
});

// Ensure unique landmark roles and add descriptive aria-labels where missing
const landmarkElements = ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section'];
const landmarkCounter = {};

landmarkElements.forEach(landmark => {
  document.querySelectorAll(landmark).forEach(element => {
    // Add landmark roles if not already present
    if (!element.getAttribute('role')) {
      element.setAttribute('role', element.tagName.toLowerCase());
    }
    // Ensure elements have accessible name where appropriate
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'main' && !element.getAttribute('aria-label') && !element.id) {
      element.setAttribute('aria-label', 'Main content');
    }
    if (tagName === 'nav' && !element.getAttribute('aria-label') && !element.id) {
      element.setAttribute('aria-label', 'Navigation');
    }
    // Ensure each landmark element has a unique identifier for debugging and future styling
    if (!element.id) {
      const count = landmarkCounter[tagName] || 0;
      landmarkCounter[tagName] = count + 1;
      element.id = `${tagName}-${count + 1}`;
    }
  });
});

// Mark all links with the appropriate ARIA role
document.querySelectorAll('a').forEach(link => {
  link.setAttribute('role', 'link');
});

// Export the module (preserved from original code)
export {};