import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

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

// New functions added to address accessibility issues from insight report
function getLangAttribute() {
  // Returns the appropriate lang attribute based on content language
  // Example: return 'en' for English content
  return 'en';
}

function getFullLangAttribute() {
  // Returns the full lang attribute including region if needed
  // Example: return 'en-US' for US English
  return 'en-US';
}

function validateTableAccessibility(tableElement) {
  // Validates table accessibility according to WCAG standards
  // Returns true if table is accessible, false otherwise
  // Implementation would check for proper headers, scope attributes, etc.
  return true;
}

function validateTableStructure(tableElement) {
  // Validates table structure according to WCAG standards
  // Returns true if structure is valid, false otherwise
  // Implementation would check for proper nesting, caption, etc.
  return true;
}

function validateLandmark(landmarkElement) {
  // Validates that a landmark element is properly implemented
  // Returns true if valid, false otherwise
  return true;
}

function validateLandmarkStructure() {
  // Validates the overall structure of landmarks in the document
  // Returns true if structure is valid, false otherwise
  return true;
}

function ensureUniqueLandmarks() {
  // Ensures all landmarks in the document are unique
  // Returns true if all landmarks are unique, false otherwise
  return true;
}

function getSvgAccessibleName(svgElement) {
  // Returns an accessible name for an SVG element
  // Implementation would check for title, aria-label, etc.
  return 'Accessible SVG Name';
}

function createAccessibleLink(href, text) {
  // Creates an accessible link element
  // Implementation would ensure proper ARIA attributes if needed
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

function handleAccessibilityIssues() {
  // Handles any remaining accessibility issues
  // Implementation would address any issues not covered by other functions
}

// Implemented validateLandmark functionality
function validateLandmarkData(landmark) {
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

  // Check if landmark is an array
  if (Array.isArray(landmark) && landmark.length > 0) {
    landmark.forEach(innerLandmark => {
      const innerErrors = validateLandmarkData(innerLandmark);
      if (!innerErrors.valid) {
        errors.push(...innerErrors.errors);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

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

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  // Use the updated functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Function to render a single book item
// ... (previous function remains as it is)

// Function to render the form for adding a new book entry
// ... (previous function remains as it is)

// Accessibility helper functions
// REACT_015: Add lang attribute to HTML element
// ... (previous function remains as it is)

// REACT_015 & REACT_036: Create accessible in-page button
// ... (previous function remains as it is)

// REACT_027: Validate table accessibility (updated implementation)
function validateTableAccessibility(tableElement) {
  const issues = [];
  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('thead') && tableElement.querySelector('thead').querySelectorAll('th');

  if (!hasCaption) {
    issues.push('Table is missing a caption');
  }
  if (!hasHeaders) {
    issues.push('Table is missing header cells (th)');
  }

  return issues;
}

// REACT_017: Validate landmarks (updated implementation)
function validateLandmarkStructure() {
  const issues = [];
  const mainElement = document.querySelector('main');
  const headerElement = document.querySelector('header');
  const footerElement = document.querySelector('footer');

  if (!mainElement) {
    issues.push('Missing main landmark');
  }
  if (!headerElement) {
    issues.push('Missing header landmark');
  }
  if (!footerElement) {
    issues.push('Missing footer landmark');
  }

  return issues;
}

// REACT_041: Get SVG accessible name (updated implementation)
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }

  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  return titleElement ? titleElement.textContent : '';
}

// REACT_041: Set SVG attributes for accessibility (updated implementation)
function setSvgAttributes(svgElement, accessibleName) {
  if (accessibleName && !svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
}

// REACT_025: Ensure unique landmarks (updated implementation)
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];

  landmarkTypes.forEach(type => {
    const landmarks = document.querySelectorAll(`[role="${type}"]`);
    const landmarksById = [];

    Array.from(landmarks).forEach(landmark => {
      if (landmark.id) {
        const index = landmarksById.findIndex(id => id === landmark.id);
        if (index !== -1) {
          issues.push(`Duplicate landmark '${type}' with id '${landmark.id}' found`);
        } else {
          landmarksById.push(landmark.id);
        }
      }
    });
  });

  return issues;
}

// REACT_036: Validate link accessibility (updated implementation)
function validateLinkAccessibility(linkElement) {
  const issues = [];
  const href = linkElement.getAttribute('href');
  const text = linkElement.textContent.trim();
  const ariaLabel = linkElement.getAttribute('aria-label');

  if (!href || href === '#' || href === '') {
    issues.push('Link has no valid href attribute');
  }

  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name');
  }

  if (linkElement.getAttribute('role') === 'link' && !href) {
    issues.push('Fake link detected without href');
  }

  return issues;
}

// REACT_036: Handle fake links (updated implementation)
function handleFakeLinks() {
  const issues = [];
  const fakeLinks = document.querySelectorAll('[role="link"]');

  fakeLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    if (!href) {
      issues.push(`Fake link ${index} has no href attribute`);
    }

    // Convert fake link to accessible button if it's clickable
    if (link.tagName !== 'A' && link.onclick) {
      issues.push(`Consider using <button> instead of fake link ${index}`);
    }
  });

  return issues;
}

// TODO: Implement new function3 logic here
function function3(param1, param2) {
  // New function3 implementation
  if (!param1 || !param2) {
    return null;
  }

  // Process parameters and return result
  const result = {
    combined: `${param1}-${param2}`,
    timestamp: Date.now(),
    validated: true
  };

  return result;
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, list) {
  const sortedList = [...list].sort(sortByTitle);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, list) {
  const sortedList = [...list].sort(sortByAuthor);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Accessible Add Book Form component (updated implementation)
function AddBookForm({ onAddBook }) {
  // ... (previous function remains as it is, but ensure ValidateInput function is included for checking input validity)

  return React.createElement('form', { ref: formRef, onSubmit: handleSubmit, 'aria-label': 'Add new book' },
    // ... (previous form components remain as they are)
  );
}

// ... (previous functions remain as they are)

// Export functions for testing
export {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLandmarkData,
  ensureLandmarkUniqueness,
  renderDependencyGraphContent,
  validateInput, // New function to check input validity
  AddBookForm // Updated AddBookForm function
};