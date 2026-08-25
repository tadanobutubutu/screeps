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

// Function to address accessibility issues using the insight report
async function addressAccessibilityIssues() {
  const insightReportUrl = 'https://api.example.com/insights/accessibility';

  const response = await fetchAPI(insightReportUrl);
  const accessibilityIssues = response.data || response;

  accessibilityIssues.forEach((issue) => {
    switch (issue.type) {
      case 'missing-caption':
        const table = document.querySelector(`#${issue.elementId}`);
        if (table) {
          addCaptionToTable(table);
        }
        break;
      case 'table-no-unique-id':
        const tableElement = document.querySelector(`#${issue.elementId}`);
        if (tableElement) {
          addUniqueIdToTable(tableElement);
        }
        break;
      case 'REACT_015': // Added from one branch
        const htmlElement = document.querySelector(issue.selector) || document.body;
        if (htmlElement) {
          htmlElement.setAttribute('lang', issue.getAttribute);
        }
        break;
      case 'REACT_027': // Added from another branch (assuming this covers the 26 table structure issues)
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
          // Assuming this is the check for table structure issues
          if (table.tHead && table.tHead.rows.length > 0 && table.tbody && table.tbody.rows.length > 0) {
            // Adjust the table structure here based on the specific insight report requirements
          }
        });
        break;
      case 'REACT_017': // Added from one branch (landmark issue)
        const mainLandmark = document.querySelector(issue.selector);
        if (mainLandmark) {
          addLandmark(mainLandmark, issue.landmarkType);
        }
        break;
      case 'REACT_025': // Added from one branch (unique landmarks)
        const landmarks = document.querySelectorAll(`[landmark]`);
        let uniqueLandmarks = new Set();
        landmarks.forEach((landmark) => {
          const landmarkType = landmark.getAttribute('landmark');
          if (uniqueLandmarks.has(landmarkType)) {
            landmark.setAttribute('aria-describedby', issue.id);
          } else {
            uniqueLandmarks.add(landmarkType);
          }
        });
        break;
      case 'REACT_041': // Added from one branch (SVG accessible names)
        const svgs = document.querySelectorAll(`[src*="${issue.svg]}"`);
        svgs.forEach((svg) => {
          // Ensure accessible name for the SVG based on the insight report requirements
        });
        break;
      case 'REACT_036': // Added from another branch (fake link issue)
        const fakeLinks = document.querySelectorAll(`a[href='${issue.href}']`);
        fakeLinks.forEach((link) => {
          // Modify the fake link here based on the specific insight report requirements
        });
        break;
      default:
        console.warn(`Unhandled accessibility issue type: ${issue.type}`);
    }
  });
}

// Function to add a caption to a missing table
function addCaptionToTable(table) {
  const tableHeader = table.querySelector('caption');

  // If a caption exist on the table, return early
  if (tableHeader && tableHeader.length > 0) return;

  const caption = document.createElement('caption');
  caption.textContent = table.id || `Table ${table.dataset.testid}`;
  table.insertBefore(caption, table.firstChild);
}

// Function to assign a unique id to table
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

// Function to add a landmark to an element
function addLandmark(element, landmarkType) {
  element.setAttribute('landmark', landmarkType);
}

// Export the module with the new fetchAPI and addressAccessibilityIssues functions added
export { fetchAPI as default, addressAccessibilityIssues };