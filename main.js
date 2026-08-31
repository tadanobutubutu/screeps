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

// Books data structure (added for addBook functionality)
const books = [];

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
        if (!elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Accessibility improvements for addBook function/form:
// - Added ARIA live region updates for screen reader feedback
// - Form includes proper labels, fieldset, and legend for accessibility
// - Input validation with clear error messages
// - Focus management handled by natural form flow

/**
 * Adds a book to the collection with accessibility features.
 * Updates an ARIA live region to announce additions to screen readers.
 * @param {Object} book - The book object to add.
 * @param {string} book.title - The title of the book (required).
 * @param {string} book.author - The author of the book (optional).
 * @param {string} book.isbn - The ISBN of the book (optional).
 * @returns {boolean} Returns true if book was added successfully.
 * @throws {Error} If book data is invalid.
 */
function addBook(book) {
  // Input validation with accessible error messages
  if (!book || typeof book !== 'object') {
    throw new Error('Invalid book data provided. Please provide a valid book object.');
  }
  
  if (!book.title || typeof book.title !== 'string' || book.title.trim() === '') {
    throw new Error('Book title is required. Please enter a valid title.');
  }

  // Create a sanitized book object
  const newBook = {
    id: Date.now() + Math.random(), // Simple unique ID generation
    title: book.title.trim(),
    author: book.author ? book.author.trim() : 'Unknown Author',
    isbn: book.isbn ? book.isbn.trim() : null,
    dateAdded: new Date().toISOString()
  };

  // Add to books array
  books.push(newBook);

  // Update ARIA live region for screen reader announcements
  const liveRegion = document.getElementById('book-announcements');
  if (liveRegion) {
    liveRegion.textContent = `Book "${newBook.title}" has been added successfully.`;
  }

  // Dispatch custom event for other components to react
  const event = new CustomEvent('bookAdded', { 
    detail: newBook,
    bubbles: true 
  });
  document.dispatchEvent(event);

  return true;
}

/**
 * Renders an accessible form for adding books.
 * Includes proper semantic HTML, labels, and ARIA attributes.
 * @param {Function} onSubmit - Callback function to handle form submission.
 * @returns {HTMLElement} The accessible form element.
 */
function renderAddBookForm(onSubmit) {
  const form = document.createElement('form');
  form.setAttribute('aria-labelledby', 'add-book-form-title');
  form.setAttribute('novalidate', 'novalidate'); // We'll handle validation manually
  
  form.innerHTML = `
    <fieldset>
      <legend id="add-book-form-title">Add New Book</legend>
      <div>
        <label for="book-title-input">Title: <span aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="book-title-input" 
          name="title" 
          required 
          aria-required="true"
          aria-describedby="title-help"
          placeholder="Enter book title">
        <small id="title-help" class="sr-only">Required field</small>
      </div>
      <div>
        <label for="book-author-input">Author:</label>
        <input 
          type="text" 
          id="book-author-input" 
          name="author" 
          placeholder="Enter author name">
      </div>
      <div>
        <label for="book-isbn-input">ISBN:</label>
        <input 
          type="text" 
          id="book-isbn-input" 
          name="isbn" 
          placeholder="Enter ISBN (optional)">
      </div>
      <div>
        <button type="submit" id="submit-book-btn">Add Book</button>
        <button type="reset" id="reset-book-btn">Clear Form</button>
      </div>
    </fieldset>
  `;

  // Form submission handler with accessibility focus
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const bookData = {
      title: formData.get('title'),
      author: formData.get('author'),
      isbn: formData.get('isbn')
    };

    try {
      addBook(bookData);
      
      // Reset form on success
      form.reset();
      
      // Move focus to the title input for next entry (accessibility best practice)
      const titleInput = form.querySelector('#book-title-input');
      if (titleInput) titleInput.focus();
      
      // Call additional callback if provided
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(bookData);
      }
    } catch (error) {
      // Display error in an accessible way
      const errorElement = document.createElement('div');
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'assertive');
      errorElement.className = 'error-message';
      errorElement.textContent = error.message;
      
      // Insert error after the form legend
      const legend = form.querySelector('legend');
      if (legend) {
        legend.insertAdjacentElement('afterend', errorElement);
      }
      
      // Remove error after a few seconds
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 5000);
    }
  });

  return form;
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
  // Added exports for addBook functionality
  addBook,
  renderAddBookForm,
  books
};