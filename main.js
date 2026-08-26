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

// New function to address accessibility issues using the insight report
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

// ----- BEGIN NEW CODE (REACT_025 fix) -----

/**
 * New function to enforce a single <main> landmark in the DOM.
 * REACT_025 — React Unique Landmarks.
 *
 * If multiple <main> elements exist, convert all but the first
 * into <section> elements (with an appropriate aria-label) so that
 * only one main landmark is exposed to assistive technologies.
 *
 * @returns {number} the number of extra <main> elements that were
 *                   demoted to <section>.
 */
function enforceUniqueMainLandmark() {
  if (typeof document === 'undefined') return 0;

  const mainElements = Array.from(document.querySelectorAll('main'));
  if (mainElements.length <= 1) return 0;

  // Keep the first <main> as the primary landmark; convert the rest to <section>.
  const extras = mainElements.slice(1);
  let demoted = 0;

  extras.forEach((el) => {
    // Skip if already a section (defensive)
    if (el.tagName.toLowerCase() === 'section') return;

    const section = document.createElement('section');

    // Copy all attributes (except ones that are invalid on <section>)
    for (const attr of Array.from(el.attributes)) {
      try {
        section.setAttribute(attr.name, attr.value);
      } catch (e) {
        // ignore attribute copy failures
      }
    }

    // Ensure the demoted region is labeled for screen readers
    if (!section.hasAttribute('aria-label') && !section.hasAttribute('aria-labelledby')) {
      section.setAttribute('aria-label', 'Additional content region');
    }
    // Make sure it is not exposed as a main landmark
    section.setAttribute('role', 'region');

    // Move all children over to the new <section>
    while (el.firstChild) {
      section.appendChild(el.firstChild);
    }

    // Replace the original <main> with the new <section>
    if (el.parentNode) {
      el.parentNode.replaceChild(section, el);
      demoted += 1;
    }
  });

  return demoted;
}

// ----- END NEW CODE (REACT_025 fix) -----

// Export the module with the new fetchAPI function added
export { fetchAPI, fetchAPI as default, addressAccessibilityIssues, enforceUniqueMainLandmark };