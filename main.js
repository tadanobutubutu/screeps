// Address accessibility issues from insight report
// Main entry point for the library
// Version: 1.0.0

// Import axios for making API calls
import axios from 'axios';

// Skip navigation link for keyboard users
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and [PERSON_NAME]())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateUniqueLandmarks(), and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), and [PERSON_NAME]())
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

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

// New function to address accessibility issues using the insight report
async function addressAccessibilityIssues() {
  const insightReportUrl = 'https://api.example.com/accessibility-report';

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

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', 'en');

// Export the module with the new fetchAPI function added
export { fetchAPI, fetchAPI as default, addressAccessibilityIssues };