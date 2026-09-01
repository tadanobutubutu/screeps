// TODO: This is the existing code that needs to be preserved

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

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          elementsById[landmark.id] = true;
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// TODO: Implement the required changes to improve accessibility for the addBook function or form
/**
 * Adds a book to the collection with accessibility enhancements
 * @param {Object} book - The book object to add
 * @param {string} book.title - The title of the book
 * @param {string} book.author - The author of the book
 * @param {string} book.isbn - The ISBN of the book
 * @param {string} [book.description] - Optional description of the book
 * @returns {boolean} True if the book was added successfully
 */
function addBook(book) {
  // Validate book object
  if (!book || typeof book !== 'object') {
    console.error('Invalid book object provided');
    return false;
  }

  // Validate required fields
  const requiredFields = ['title', 'author', 'isbn'];
  for (const field of requiredFields) {
    if (!book[field] || typeof book[field] !== 'string' || book[field].trim() === '') {
      console.error(`Book must have a valid ${field}`);
      return false;
    }
  }

  // Create accessible book element
  const bookElement = document.createElement('div');
  bookElement.className = 'book-item';
  bookElement.setAttribute('role', 'article');
  bookElement.setAttribute('aria-label', `Book: ${book.title} by ${book.author}`);

  // Add accessible title
  const titleElement = document.createElement('h3');
  titleElement.textContent = book.title;
  titleElement.setAttribute('aria-label', `Title: ${book.title}`);
  bookElement.appendChild(titleElement);

  // Add accessible author
  const authorElement = document.createElement('p');
  authorElement.textContent = `By ${book.author}`;
  authorElement.setAttribute('aria-label', `Author: ${book.author}`);
  bookElement.appendChild(authorElement);

  // Add accessible ISBN
  const isbnElement = document.createElement('p');
  isbnElement.textContent = `ISBN: ${book.isbn}`;
  isbnElement.setAttribute('aria-label', `ISBN: ${book.isbn}`);
  bookElement.appendChild(isbnElement);

  // Add description if available
  if (book.description && typeof book.description === 'string' && book.description.trim() !== '') {
    const descElement = document.createElement('p');
    descElement.textContent = book.description;
    descElement.setAttribute('aria-label', `Description: ${book.description}`);
    bookElement.appendChild(descElement);
  }

  // Add to the DOM
  const bookContainer = document.getElementById('book-container');
  if (bookContainer) {
    bookContainer.appendChild(bookElement);
    return true;
  }

  console.error('Book container not found in the DOM');
  return false;
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
  addBook
};