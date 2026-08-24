// Assuming this is the structure of the icons object
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐛</text></svg>',
};

// Function to create an SVG element with aria-label
function createAccessibleSVG(data, label) {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>${label}</title><text y=".9em" font-size="90">${label}</text></svg>`;
}

// Update the icons object with aria-label
icons.icon = createAccessibleSVG(icons.icon, 'Screeps Dashboard');
icons.apple = createAccessibleSVG(icons.apple, 'Screeps Dashboard');

// Address accessibility issues from insight report
// Main entry point for the library
// Version: 1.0.0

// Import axios for making API calls
import axios from 'axios';

const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

skipLink.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
});

const mainElement = document.querySelector('main') || document.getElementById('content') || document.querySelector('[role="main"]');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

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

function addCaptionToTable(table) {
  const tableHeader = table.querySelector('caption');

  // If a caption exist on the table, return early
  if (tableHeader && tableHeader.length > 0) return;

  const caption = document.createElement('caption');
  caption.textContent = table.id || `Table ${table.dataset.testid}`;
  table.insertBefore(caption, table.firstChild);
}

function addUniqueIdToTable(table) {
  table.id = table.id || `table-${table.dataset.testid}`;
}

async function fetchAPI(url) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

// Newly exported function for API calls
export { fetchAPI, fetchAPI as default, addressAccessibilityIssues };