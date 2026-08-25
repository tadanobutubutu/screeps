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
// Append skip link to the body
document.body.appendChild(skipLink);

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
const mainElement = document.querySelector('main') || document.getElementById('content') || document.querySelector('[role="main"]');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}
// ----- END ORIGINAL CODE -----

// New function to address accessibility issues using the insight report
async function addressAccessibilityIssues() {
  const insightReportUrl = 'https://example.com/api/accessibility-report';
  try {
    const response = await fetchAPI(insightReportUrl);
    const accessibilityIssues = response.data || response;
    accessibilityIssues.forEach((issue) => {
      switch (issue.type) {
        case 'missing-caption':
          if (issue.element) {
            addCaptionToTable(issue.element);
          }
          break;
        case 'table-no-unique-id':
          if (issue.element) {
            addUniqueIdToTable(issue.element);
          }
          break;
        default:
          console.warn(`Unhandled accessibility issue type: ${issue.type}`);
      }
    });
  } catch (error) {
    console.error('Error addressing accessibility issues:', error);
  }
}

// New function to add a caption to a missing table
function addCaptionToTable(table) {
  const tableHeader = table.getElementsByTagName('caption');
  // If a caption exist on the table, return early
  if (tableHeader && tableHeader.length > 0) return;
  
  const caption = document.createElement('caption');
  caption.textContent = table.id || `Table ${table.dataset.testid}`;
  
  // Insert caption as the first child of the table
  if (table.firstChild) {
    table.insertBefore(caption, table.firstChild);
  } else {
    table.appendChild(caption);
  }
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
export { fetchAPI, addressAccessibilityIssues };
export { fetchAPI as default };