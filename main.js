import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// New function for creating in-page buttons
function createInPageButtons(buttonsData) {
  const buttonsContainer = document.getElementById('in-page-buttons-container');

  if (!buttonsContainer) {
    console.error('In-page buttons container not found');
    return;
  }

  buttonsData.forEach(buttonData => {
    const button = document.createElement('button');
    button.id = buttonData.id;
    button.textContent = buttonData.text;
    button.setAttribute('data-role', buttonData.role);

    button.addEventListener('click', () => {
      location.hash = buttonData.href;
    });

    buttonsContainer.appendChild(button);
  });
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// New function to add a book with accessibility features
function addBookAccessibility(bookData) {
  const bookForm = document.getElementById('add-book-form');
  if (!bookForm) {
    console.error('Book form not found');
    return;
  }

  // Create form elements with proper ARIA attributes
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'book-title';
  titleInput.setAttribute('aria-label', 'Book title');
  titleInput.setAttribute('aria-required', 'true');

  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.id = 'book-author';
  authorInput.setAttribute('aria-label', 'Book author');
  authorInput.setAttribute('aria-required', 'true');

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Book';
  submitButton.setAttribute('aria-label', 'Submit new book');

  // Add labels for better accessibility
  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = 'book-title';
  titleLabel.textContent = 'Title:';

  const authorLabel = document.createElement('label');
  authorLabel.htmlFor = 'book-author';
  authorLabel.textContent = 'Author:';

  // Append elements to form
  bookForm.appendChild(titleLabel);
  bookForm.appendChild(titleInput);
  bookForm.appendChild(authorLabel);
  bookForm.appendChild(authorInput);
  bookForm.appendChild(submitButton);

  // Add event listener for form submission
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically add the book to your data structure
    console.log('Book added:', { title, author });

    // Clear form after submission
    bookForm.reset();
  });
}

// Export functions for testing
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies,
  createInPageButtons, // Added new export
  addBookAccessibility // New export for book accessibility
};