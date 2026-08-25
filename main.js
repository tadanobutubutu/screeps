// Address accessibility issues from insight report
// Main entry point for the library
// Version: 1.0.0

// Import axios for making API calls
import axios from 'axios';

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Skip navigation link for keyboard users
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';

// Handle skip link click
skipLink.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
});

// Mark the main content area as a primary region
const mainElement = document.getElementById('main') || document.getElementById('content') || document.querySelector('main');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

// New function to address accessibility issues using the insight report
async function addressAccessibilityIssues() {
  const insightReportUrl = './insight-report.json';

  try {
    const response = await fetchAPI(insightReportUrl);
    const accessibilityIssues = response.data || response;

    accessibilityIssues.forEach((issue) => {
      switch (issue.type) {
        case 'missing-caption':
          if (issue.selector) {
            const table = document.querySelector(issue.selector);
            if (table) {
              addCaptionToTable(table);
            }
          }
          break;
        case 'table-no-unique-id':
          if (issue.selector) {
            const table = document.querySelector(issue.selector);
            if (table) {
              addUniqueIdToTable(table);
            }
          }
          break;
        default:
          console.warn(`Unhandled accessibility issue type: ${issue.type}`);
      }
    });
  } catch (err) {
    console.error('Error addressing accessibility issues:', err);
  }
}

// New function to add a caption to a missing table
function addCaptionToTable(table) {
  const tableHeader = table.querySelector('caption');

  // If a caption exist on the table, return early
  if (tableHeader && tableHeader.length > 0) return;

  const caption = document.createElement('caption');
  caption.textContent = table.id || `Table ${table.dataset.testid}`;
  table.insertBefore(caption, table.firstChild);
}

// New function to assign a unique id to table
function addUniqueIdToTable(table) {
  table.id = table.id || `table-${table.dataset.testid}`;
}

// New function for API calls
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
export { fetchAPI, fetchAPI as default, addressAccessibilityIssues };