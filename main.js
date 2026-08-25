// main.js - Entry point for the application with accessibility fixes for React components

// Import content modules for dependency graphs and index views
import { dependencyGraphContent, indexContent } from ...
import { indexContent } from './content/indexContent.js';

// New functions requested by the issue

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  // Incorporate both implementations and only return true if both pass
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    // Use the first implementation
    headers.forEach(th => {
      const scope = th.getAttribute('scope');
      if (!scope) {
        hasIssues = true;
      }
      // Incorporate the second implementation to validate scope values
      if (!scope || !['row', 'col', 'rowgroup', 'colgroup'].includes(scope)) {
        hasIssues = true;
      }
    });
  });

  return !hasIssues;
}

function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg');
  let accessibleName = '';

  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    // Use the first method if aria-label is present
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    // Use the second method if not
    const { ariaLabelledBy, title } = svg;
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl) accessibleName = labelEl.textContent.trim();
    } else if (title) {
      accessibleName = title.textContent.trim();
    }
    // If neither method provided an accessible name, use a default value
    if (!accessibleName) accessibleName = `SVG graphic ${i + 1}`;
  }

  return accessibleName;
}

// The rest of the functions and their implementations remain unchanged.

// ...

// REACT_025: Ensure unique landmarks
// Both implementations deal with different aspects of this issue; ensure unique landmark IDs and validate that only one main landmark exists.
function ensureUniqueLandmarkIdsAndMain() {
  // Collapse both implementations into a single function
  const landmarks = document.querySelectorAll('header, footer, aside, main, nav, [role="banner"], [role="contentinfo"], [role="complementary"], [role="main"], [role="navigation"], [role="search"]');
  const landmarkRoles = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (role && landmark.id) {
      if (landmarkRoles.has(role)) {
        landmark.id = role + '-' + (landmarkRoles.get(role) + 1);
        landmarkRoles.set(role, landmarkRoles.get(role) + 1);
      } else {
        landmarkRoles.set(role, 1);
      }
    }
  });

  // Validate that only one main landmark exists
  const mainElements = document.querySelectorAll('main');
  const issues = [];

  if (mainElements.length === 0) {
    issues.push('No main landmark found');
  } else if (mainElements.length > 1) {
    issues.push(`Multiple main landmarks found (${mainElements.length}). Only one <main> element should exist per page.`);
  }

  return {
    valid: issues.length === 0,
    issues,
    mainCount: mainElements.length
  };
}

// The rest of the functions remain unchanged.

// ...