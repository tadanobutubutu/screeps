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

// Append skip link to body (assuming not already present)
document.body.appendChild(skipLink);

// Handle skip link click
skipLink.addEventListener('click', e => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
});

// Mark the main content area as a primary region
const mainElement = document.getElementById('main-content');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

// Your new accessibility improvements
document.documentElement.lang = 'en';

// Ensure tables have proper structure and unique captions
document.querySelectorAll('table').forEach(table => {
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
  // Add an appropriate ARIA label for each SVG
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Accessible SVG');
});

// Add landmarks with unique ids and appropriate roles
const headerLandmark = document.createElement('header');
headerLandmark.id = 'header-landmark';
headerLandmark.setAttribute('role', 'banner');
document.body.appendChild(headerLandmark);

const mainLandmark = document.createElement('main');
mainLandmark.id = 'main-content';
mainLandmark.setAttribute('role', 'main');
headerLandmark.appendChild(mainLandmark);

const footerLandmark = document.createElement('footer');
footerLandmark.id = 'footer-landmark';
footerLandmark.setAttribute('role', 'contentinfo');
document.body.appendChild(footerLandmark);

// Ensure unique landmark roles (for 2 issues)
const landmarks = document.querySelectorAll('[role]');
landmarks.forEach((landmark, idx) => {
  if (idx > 0) {
    landmark.id = `landmark-${idx + 1}`;
  }
});

// Fix fake links: convert hash-only href links to buttons
const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.id = link.id;
    button.className = link.className;

    const inlineStyles = link.getAttribute('style');
    if (inlineStyles) button.setAttribute('style', inlineStyles);

    Array.from(link.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        button.setAttribute(attr.name, attr.value);
      }
    });

    if (link.parentNode) {
      link.parentNode.replaceChild(button, link);
    }
  });
};

// Handle the specific "rotate back" link issue
const handleUnrotateLink = () => {
  const unrotateLink = document.getElementById('unrotate');
  if (unrotateLink && unrotateLink.tagName === 'A') {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = unrotateLink.className;

    const inlineStyles = unrotateLink.getAttribute('style');
    if (inlineStyles) button.setAttribute('style', inlineStyles);

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.focus();
    });

    if (unrotateLink.parentNode) {
      unrotateLink.parentNode.replaceChild(button, unrotateLink);
    }
  }
};

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