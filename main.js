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
document.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
});

// Mark the main content area as a primary region
const mainElement = document.querySelector('main') || document.getElementById('content') || document.body;
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

// New function to address accessibility issues using the insight report
async function addressAccessibilityIssues() {
  const insightReportUrl = 'https://api.example.com/accessibility-report';

  const response = await axios.get(insightReportUrl);
  const accessibilityIssues = response.data || response;

  accessibilityIssues.forEach((issue) => {
    switch (issue.type) {
      case 'missing-caption':
        const table = document.getElementById(issue.elementId);
        if (table) {
          addCaptionToTable(table);
        }
        break;
      case 'table-no-unique-id':
        const tableElement = document.getElementById(issue.elementId);
        if (tableElement) {
          addUniqueIdToTable(tableElement);
        }
        break;
      default:
        console.warn(`Unhandled accessibility issue type: ${issue.type}`);
    }
  });
}

// New function to add a caption to a missing table
function addCaptionToTable(table) {
  const tableHeader = table.querySelector('thead');

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
export { fetchAPI as default, addressAccessibilityIssues };