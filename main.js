// addressed accessibility issues from insight report
import { getLangAttribute } from './utils/language';
import { personName } from './utils/utilities';
import { validateTableAccessibility } from './utils/table';
import { validateTableStructure } from './utils/table';
import { validateLandmark, validateLandmarkStructure, getUniqueLandmarkId } from './utils/landmarks';
import { getSvgAccessibleName, setSvgAccessibleName } from './utils/svg';
import { validateFakeLink, fixFakeLink } from './utils/links';

// ensuring unique landmarks (2 issues)
function ensureUniqueLandmarks(landmarkElements) {
  const usedIds = new Set();
  landmarkElements.forEach((element, index) => {
    const landmark = validateLandmark(element);
    if (landmark && landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = getUniqueLandmarkId(landmark.id, usedIds);
        element.setAttribute('id', newId);
        usedIds.add(newId);
      } else {
        usedIds.add(landmark.id);
      }
    }
  });
}

// Creating accessible names for 2 SVGs
function createSvgAccessibleNames(svgElements) {
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      // Try to get name from title or desc within SVG
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');
      if (title) {
        setSvgAccessibleName(svg, title.textContent);
      } else if (desc) {
        setSvgAccessibleName(svg, desc.textContent);
      }
    }
  });
}

// fixing 1 fake link issue
function fixFakeLinks(elements) {
  elements.forEach((element) => {
    if (validateFakeLink(element)) {
      fixFakeLink(element);
    }
  });
}

// ADD: Addressing new accessibility issues from insight report

function fixAccessibilityIssues() {
  const langAttribute = getLangAttribute(document.documentElement);

  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    validateTableStructure(table);
    validateTableAccessibility(table);
  });

  const landmarkElements = document.querySelectorAll('[role="region"], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  landmarkElements.forEach((element) => {
    validateLandmark(element);
    validateLandmarkStructure(element);
  });
  ensureUniqueLandmarks(landmarkElements);

  const svgElements = document.querySelectorAll('svg');
  createSvgAccessibleNames(svgElements);

  const potentialFakeLinks = document.querySelectorAll('span[role="link"], div[role="link"], a:not([href])');
  fixFakeLinks(potentialFakeLinks);

  const persons = document.querySelectorAll('[itemtype*="Person"]');
  persons.forEach((person) => personName(person));
}

// PRESERVING existing code, exports, and functions

// ... (rest of the main.js content)

// EXPORTING the updated main.js content
module.exports = {
  // ... (existing exports)
  fixAccessibilityIssues,
  ensureUniqueLandmarks,
  createSvgAccessibleNames,
  fixFakeLinks,
};