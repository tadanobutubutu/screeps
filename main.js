// Address accessibility issues from insight report
// Main entry point for the library
// Version: 1.0.0

// Import axios for making API calls
import axios from 'axios';

// Skip navigation link for keyboard users
// TODO: This is the existing code that needs to be preserved
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';

// Handle skip link click
skipLink.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.querySelector('[role="main"]') || document.getElementById('content');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
});
document.body.appendChild(skipLink);

// Mark the main content area as a primary region
const mainElement = document.querySelector('[role="main"]') || document.getElementById('content');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

// New function to address accessibility issues using the insight report
async function addressAccessibilityIssues() {
  const insightReportUrl = ''; // Replace this with the API endpoint for the insight report

  try {
    const response = await fetchAPI(insightReportUrl);
    const accessibilityIssues = response.data || response;

    accessibilityIssues.forEach((issue) => {
      switch (issue.type) {
        case 'missing-caption':
          addCaptionToTable(issue.element);
          break;
        case 'table-no-unique-id':
          addUniqueIdToTable(issue.element);
          break;
        default:
          console.warn(`Unhandled accessibility issue type: ${issue.type}`);
      }
    });
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

// New function to add a caption to a missing table
function addCaptionToTable(table) {
  const tableHeader = table.querySelector('thead') || table.querySelector('th');

  // If a caption exist on the table, return early
  if (tableHeader && tableHeader.length > 0) return;

  const caption = document.createElement('caption');
  caption.textContent = table.id || `Table ${table.dataset.testid}`;
  table.firstChild.insertBefore(caption, table.firstChild.firstChild);
}

// New function to assign a unique id to table
function addUniqueIdToTable(table) {
  table.id = table.id || `table-${table.dataset.testid}`;
}

// New function for API calls
function fetchAPI(url) {
  return axios.get(url);
}

// Add lang attribute to HTML element (REACT_015)
document.documentElement.lang = 'en';

// Export the module with the new addressAccessibilityIssues function added
export { addressAccessibilityIssues };