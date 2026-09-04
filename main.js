let dependencyGraph = {};

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
}

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice, Needs Caution";

import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';
import { addFixLandmarkIssues, fixFakeLinkIssues, ensureUniqueLandmarks, addProperLandmarkRegions, addAriaToFormControls, wrapPrimaryContentInMain } from './utils/landmarkUtils';
import { renderDependencyGraph, renderIndexView } from './utils/renderUtils';
import { loadLandmarks } from './utils/landmarkUtils';
import { processLandmarks, sortLandmarks, getLandmarkById } from './utils/landmarkUtils';

export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (UserSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (SafetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

export const visualizeDependencyTree = (dependencies) => {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  // Fix fake links by converting them to proper buttons
  handleFakeLinks();
  fixFakeLinkIssues();

  // Validate and fix table accessibility issues
  validateTableAccessibility();

  // Validate and fix table structure issues
  validateTableStructure();

  // Validate and fix landmark issues
  validateLandmark();
  validateLandmarkStructure();
  addFixLandmarkIssues();

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Add proper landmark regions
  addProperLandmarkRegions();

  // Validate and fix SVG accessibility issues
  getSvgAccessibleName();
  setSvgAttributes();

  // Validate and fix link accessibility issues
  validateLinkAccessibility();
  checkLinkAccessibility();

  // Add ARIA to form controls
  addAriaToFormControls();

  // Set language attributes
  getLangAttribute();
  getFullLangAttribute();

  // Wrap primary content in main landmark
  wrapPrimaryContentInMain();
}

export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },

  addBook: function(title, author, isbn) {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-labelledby', 'add-book-form-title');

    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    form.appendChild(titleInput);
    form.appendChild(authorInput);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Book added:', {
        title: titleInput.value,
        author: authorInput.value,
        isbn: isbnInput.value
      });
    });

    return form;
  }
};

/**
 * Ensure that all interactive elements have proper keyboard support and ARIA attributes.
 */
const interactiveElements = document.querySelectorAll('button, input, textarea, select');
if (interactiveElements.length > 0) {
  interactiveElements.forEach(element => {
    element.setAttribute('aria-label', element.textContent.trim() || '');
    if (element.id) {
      element.setAttribute('aria-labelledby', element.id);
    }
    if (element.required) {
      element.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Load landmarks from file and ensure their uniqueness.
 */
const landmarksFile = './data/landmarks.json';
if (landmarksFile) {
  const landmarks = loadLandmarks(landmarksFile);
  if (Array.isArray(landmarks)) {
    const uniqueLandmarks = processLandmarks(landmarks);
    sortLandmarks(uniqueLandmarks);
  }
}

/**
 * Render the dependency graph and index view.
 */
renderDependencyGraph(dependencyGraph);
renderIndexView();