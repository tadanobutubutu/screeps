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
const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

// Your new accessibility improvements
document.documentElement.lang = 'en';

// Ensure tables have proper structure and unique captions
document.querySelectorAll('table').forEach((table) => {
  // ... (existing code)

  // Add unique 'id' to each table
  table.id = table.id || `table-${table.dataset.testid}`;

  // Add proper ARIA attributes for table, table header, and table body
  const tableHeader = table.querySelector('thead');
  const tableBody = table.querySelector('tbody');

  if (tableHeader && tableBody) {
    table.setAttribute('role', 'table');
    tableHeader.setAttribute('role', 'rowgroup');
    tableBody.setAttribute('role', 'rowgroup');
    
    // Add role="columnheader" to all th elements in the header
    tableHeader.querySelectorAll('th').forEach((th) => {
      th.setAttribute('role', 'columnheader');
    });
    
    // Add role="cell" to all td elements in the body
    tableBody.querySelectorAll('td').forEach((td) => {
      td.setAttribute('role', 'cell');
    });
  }
});

// Improve SVG accessibility: add title and accessible name
document.querySelectorAll('svg').forEach((svg) => {
  // ... (existing code)

  // Add an appropriate ARIA label for each SVG
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    const title = document.createElement('title');
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    title.textContent = svg.getAttribute('alt') || 'Decorative graphic';
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('aria-labelledby', title.id);
  }
});

// Add landmarks with unique ids and appropriate roles
const headerLandmark = document.createElement('header');
headerLandmark.id = 'header-landmark';
headerLandmark.setAttribute('role', 'banner');
document.body.insertBefore(headerLandmark, document.body.firstChild);

const mainLandmark = document.createElement('main');
mainLandmark.id = 'main-content';
mainLandmark.setAttribute('role', 'main');
headerLandmark.appendChild(mainLandmark);

const footerLandmark = document.createElement('footer');
footerLandmark.id = 'footer-landmark';
footerLandmark.setAttribute('role', 'contentinfo');
document.body.appendChild(footerLandmark);

// Ensure unique landmark roles (for 2 issues)
const landmarks = document.querySelectorAll('header, footer, nav, main, aside, section[aria-label], section[aria-labelledby]');
landmarks.forEach((landmark, idx) => {
  if (idx > 0) {
    const currentRole = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmark.setAttribute('aria-label', `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} ${idx + 1}`);
  }
});

// Ensure all fake links are marked with appropriate ARIA role
document.querySelectorAll('[onclick], a[href="#"], [role="button"]').forEach((element) => {
  if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
  }
});

// Fix REACT_027: Add scope attributes to all <th> elements
document.querySelectorAll('th').forEach((th) => {
  if (!th.hasAttribute('scope')) {
    // Default to 'col' for column headers, but could be 'row' if needed
    // Based on the issue, these are column headers
    th.setAttribute('scope', 'col');
  }
});

// New function to make API calls using axios
async function fetchAPI(url) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

// Export the module with the new fetchAPI function added
export { fetchAPI, fetchAPI as default };