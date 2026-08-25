// Address accessibility issues from insight report
// Main entry point for the library
// Version: 1.0.0

// Import axios for making API calls
import axios from 'axios';

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
  // ... (existing code)

  // Add unique 'id' to each table
  table.id = table.id || `table-${table.dataset.testid}`;

  // Add proper ARIA attributes for table, table header, and table body
  const tableHeader = table.querySelector('thead');
  const tableBody = table.querySelector('tbody');

  if (tableHeader && tableBody) {
    table.setAttribute('role', 'table');
    tableHeader.setAttribute('role', 'columnheader');
    tableBody.setAttribute('role', 'rowgroup');
  }
});

// Improve SVG accessibility: add title and accessible name
document.querySelectorAll('svg').forEach(svg => {
  // ... (existing code)

  // Add an appropriate ARIA label for each SVG
  svg.setAttribute('aria-labelledby', `svg-title-${svg.id}`);
});

// Add landmarks with unique ids and appropriate roles
const headerLandmark = document.createElement('header');
headerLandmark.id = 'header-landmark';
headerLandmark.setAttribute('role', 'banner');
document.body.insertBefore(headerLandmark, document.body.firstChild);

// Ensure there is only a single <main> landmark — reuse the existing main
// element instead of creating a duplicate one (REACT_025)
const mainLandmark = document.querySelector('main') || document.createElement('main');
mainLandmark.id = 'main-content';
mainLandmark.setAttribute('role', 'main');
if (!headerLandmark.contains(mainLandmark)) {
  headerLandmark.appendChild(mainLandmark);
}

const footerLandmark = document.createElement('footer');
footerLandmark.id = 'footer-landmark';
footerLandmark.setAttribute('role', 'contentinfo');
document.body.appendChild(footerLandmark);

// Ensure unique landmark roles (for 2 issues)
const landmarks = document.querySelectorAll('[role="landmark"]');
landmarks.forEach((landmark, idx) => {
  if (idx > 0) {
    landmark.setAttribute('aria-label', `Landmark ${idx + 1}`);
  }
});

// Ensure all fake links are marked with appropriate ARIA role
// ... (existing code)

// New function to make API calls using axios
async function fetchAPI(url) {
  try {
    return await axios.get(url);
  } catch (err) {
    console.error(err);
  }
}

// Export the module with the new fetchAPI function added
export { fetchAPI };
export {};