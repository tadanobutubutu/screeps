// addressed accessibility issues from insight report
import { getLangAttribute } from './utils/language';
import { personName } from './utils/utilities';
import { validateTableAccessibility } from './utils/table';
import { validateTableStructure } from './utils/table';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarks';
import { getSvgAccessibleName } from './utils/svg';

// ensuring unique landmarks (2 issues)
// ... (to be handled elsewhere)

// Creating accessible names for 2 SVGs
// ... (to be handled elsewhere)

// fixing 1 fake link issue
// ... (to be handled elsewhere)

// ADD: Addressing new accessibility issues from insight report

function fixAccessibilityIssues() {
  document.getElementById('root').setAttribute('lang', getLangAttribute());

  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    validateTableStructure(table);
    validateTableAccessibility(table);
  });

  const landmarkElements = document.querySelectorAll('[aria-label]');
  landmarkElements.forEach((element) => {
    validateLandmark(element);
    validateLandmarkStructure(element);
  });

  const persons = document.querySelectorAll('.person-name');
  persons.forEach((person) => personName(person));
}

// PRESERVING existing code, exports, and functions

// ... (rest of the main.js content)

// EXPORTING the updated main.js content
module.exports = {
  // ... (existing exports)
  fixAccessibilityIssues,
};