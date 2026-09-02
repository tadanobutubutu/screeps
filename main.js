// Dependency imports
const { dependencyGraphContent } = require('./dependency-graph');
const { indexContent } = require('./index-template');

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Import necessary dependencies
import React, { useRef } from 'react';
import { render } from 'react-dom';
import { addLangAttribute, fixTableStructure, fixLandmarkIssues, addMainLandmark, addLandmarkRegions, ensureUniqueLandmarks, uniqueLandmarks, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, googleSignIn, decodeJwtResponse, fixButtonIdentifiers, ensureElementHasId, addAriaLabel, renderDependencyGraphs } from './AccessibilityHelpers';

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// Assuming that the `addBook` function or form is within the scope of the file and that the
// changes needed are related to adding ARIA roles and labels to improve accessibility.

/**
 * Accessible addBook form component with proper ARIA roles and labels
 * @param {Object} options - Configuration options for the addBook form
 * @param {HTMLElement} options.container - DOM element to render the form into
 * @param {Function} options.onSubmit - Callback function when form is submitted
 * @param {Function} options.onCancel - Callback function when form is cancelled
 * @param {string} options.formTitle - Title for the form (default: 'Add Book')
 * @returns {Object} Object with methods to interact with the form
 */
function addBook(options = {}) {
  const {
    container = null,
    onSubmit = () => {},
    onCancel = () => {},
    formTitle = 'Add Book'
  } = options;

  // Generate unique IDs for accessibility associations
  const formId = 'add-book-form';
  const titleId = 'add-book-title';
  const titleInputId = 'add-book-title-input';
  const authorInputId = 'add-book-author-input';
  const isbnInputId = 'add-book-isbn-input';
  const descriptionId = 'add-book-description';
  const submitBtnId = 'add-book-submit';
  const cancelBtnId = 'add-book-cancel';
  const errorMsgId = 'add-book-error';
  const successMsgId = 'add-book-success';

  /**
   * Creates the accessible HTML for the addBook form
   * @returns {string} HTML string with proper ARIA attributes
   */
  function createFormHTML() {
    return `
      <div role="region" aria-labelledby="${titleId}" class="add-book-container">
        <h2 id="${titleId}">${formTitle}</h2>
        <form 
          id="${formId}" 
          role="form" 
          aria-describedby="${descriptionId}"
          novalidate
        >
          <div id="${descriptionId}" class="sr-only">
            Fill in the book details below and submit to add a new book to your library.
          </div>
          
          <div class="form-group">
            <label for="${titleInputId}" class="form-label">
              Book Title <span aria-hidden="true">*</span>
              <span class="sr-only">(required)</span>
            </label>
            <input 
              type="text" 
              id="${titleInputId}" 
              name="title" 
              required
              aria-required="true"
              aria-describedby="${titleInputId}-help ${titleInputId}-error"
              class="form-input"
              placeholder="Enter book title"
              autocomplete="off"
            />
            <small id="${titleInputId}-help" class="form-help">Enter the full title of the book</small>
            <span id="${titleInputId}-error" class="form-error" role="alert" aria-live="polite"></span>
          </div>

          <div class="form-group">
            <label for="${authorInputId}" class="form-label">
              Author <span aria-hidden="true">*</span>
              <span class="sr-only">(required)</span>
            </label>
            <input 
              type="text" 
              id="${authorInputId}" 
              name="author" 
              required
              aria-required="true"
              aria-describedby="${authorInputId}-help ${authorInputId}-error"
              class="form-input"
              placeholder="Enter author name"
              autocomplete="off"
            />
            <small id="${authorInputId}-help" class="form-help">Enter the author's full name</small>
            <span id="${authorInputId}-error" class="form-error" role="alert" aria-live="polite"></span>
          </div>

          <div class="form-group">
            <label for="${isbnInputId}" class="form-label">
              ISBN
            </label>
            <input 
              type="text" 
              id="${isbnInputId}" 
              name="isbn" 
              aria-describedby="${isbnInputId}-help"
              class="form-input"
              placeholder="Enter ISBN (optional)"
              autocomplete="off"
              pattern="[0-9\-]{10,17}"
            />
            <small id="${isbnInputId}-help" class="form-help">Enter a 10 or 13 digit ISBN number</small>
          </div>

          <div role="status" aria-live="polite" aria-atomic="true" id="${errorMsgId}" class="form-messages" hidden></div>
          <div role="status" aria-live="polite" aria-atomic="true" id="${successMsgId}" class="form-success" hidden></div>

          <div class="form-actions" role="group" aria-label="Form actions">
            <button 
              type="submit" 
              id="${submitBtnId}"
              class="btn btn-primary"
              aria-describedby="${submitBtnId}-description"
            >
              <span>Add Book</span>
              <span id="${submitBtnId}-description" class="sr-only">Submit the form to add a new book</span>
            </button>
            <button 
              type="button" 
              id="${cancelBtnId}"
              class="btn btn-secondary"
              aria-describedby="${cancelBtnId}-description"
            >
              <span>Cancel</span>
              <span id="${cancelBtnId}-description" class="sr-only">Cancel and close the form</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * Validates the form data
   * @param {FormData} formData - The form data to validate
   * @returns {Object} Validation result with isValid boolean and errors object
   */
  function validateForm(formData) {
    const errors = {};
    let isValid = true;

    const title = formData.get('title')?.trim();
    const author = formData.get('author')?.trim();
    const isbn = formData.get('isbn')?.trim();

    if (!title) {
      errors.title = 'Book title is required';
      isValid = false;
    }

    if (!author) {
      errors.author = 'Author name is required';
      isValid = false;
    }

    if (isbn && !/^[0-9\-]{10,17}$/.test(isbn)) {
      errors.isbn = 'Please enter a valid ISBN (10 or 13 digits)';
      isValid = false;
    }

    return { isValid, errors };
  }

  /**
   * Displays validation errors for each field
   * @param {Object} errors - Object containing field-specific errors
   */
  function displayErrors(errors) {
    const errorContainer = document.getElementById(errorMsgId);
    const errorMessages = [];

    Object.entries(errors).forEach(([field, message]) => {
      const inputMap = {
        title: titleInputId,
        author: authorInputId,
        isbn: isbnInputId
      };
      const inputId = inputMap[field];
      const errorSpan = document.getElementById(`${inputId}-error`);
      
      if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.setAttribute('aria-invalid', 'true');
      }

      const input = document.getElementById(inputId);
      if (input) {
        input.setAttribute('aria-invalid', 'true');
      }

      errorMessages.push(message);
    });

    if (errorContainer && errorMessages.length > 0) {
      errorContainer.textContent = `Please correct the following errors: ${errorMessages.join('. ')}`;
      errorContainer.hidden = false;
      errorContainer.focus();
    }
  }

  /**
   * Clears all validation errors
   */
  function clearErrors() {
    const errorContainer = document.getElementById(errorMsgId);
    if (errorContainer) {
      errorContainer.hidden = true;
      errorContainer.textContent = '';
    }

    [titleInputId, authorInputId, isbnInputId].forEach(inputId => {
      const errorSpan = document.getElementById(`${inputId}-error`);
      const input = document.getElementById(inputId);

      if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.removeAttribute('aria-invalid');
      }

      if (input) {
        input.removeAttribute('aria-invalid');
      }
    });
  }

  /**
   * Shows a success message
   * @param {string} message - The success message to display
   */
  function showSuccess(message) {
    const successContainer = document.getElementById(successMsgId);
    if (successContainer) {
      successContainer.textContent = message;
      successContainer.hidden = false;
      successContainer.setAttribute('role', 'alert');
    }
  }

  /**
   * Hides the success message
   */
  function hideSuccess() {
    const successContainer = document.getElementById(successMsgId);
    if (successContainer) {
      successContainer.hidden = true;
      successContainer.textContent = '';
    }
  }

  /**
   * Renders the form to the specified container
   */
  function render() {
    const targetContainer = container || document.getElementById('add-book-container') || document.body;
    targetContainer.innerHTML = createFormHTML();
    
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById(submitBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);

    if (form) {
      form.addEventListener('submit', handleSubmit);
      form.addEventListener('reset', handleReset);
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        submitBtn.setAttribute('aria-busy', 'true');
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', handleCancel);
      cancelBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCancel();
        }
      });
    }

    // Set focus to the first input for accessibility
    const firstInput = document.getElementById(titleInputId);
    if (firstInput) {
      firstInput.focus();
    }

    // Announce form opening to screen readers
    announceToScreenReader(`${formTitle} form opened. Please fill in the required fields.`);
  }

  /**
   * Handles form submission
   * @param {Event} event - The submit event
   */
  function handleSubmit(event) {
    event.preventDefault();
    clearErrors();
    hideSuccess();

    const form = event.target;
    const formData = new FormData(form);
    const { isValid, errors } = validateForm(formData);

    if (!isValid) {
      displayErrors(errors);
      return;
    }

    const bookData = {
      title: formData.get('title')?.trim(),
      author: formData.get('author')?.trim(),
      isbn: formData.get('isbn')?.trim() || null
    };

    // Disable submit button during processing
    const submitBtn = document.getElementById(submitBtnId);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    try {
      onSubmit(bookData);
      showSuccess(`Successfully added "${bookData.title}" to your library.`);
      form.reset();
      announceToScreenReader(`Book "${bookData.title}" has been successfully added.`);

      // Clear success message after 5 seconds
      setTimeout(() => {
        hideSuccess();
      }, 5000);
    } catch (error) {
      const errorContainer = document.getElementById(errorMsgId);
      if (errorContainer) {
        errorContainer.textContent = `Error adding book: ${error.message}`;
        errorContainer.hidden = false;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
    }
  }

  /**
   * Handles form reset
   * @param {Event} event - The reset event
   */
  function handleReset(event) {
    clearErrors();
    hideSuccess();
    announceToScreenReader('Form has been cleared.');
  }

  /**
   * Handles cancel action
   */
  function handleCancel() {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
    }
    clearErrors();
    hideSuccess();
    onCancel();
    announceToScreenReader('Add book form cancelled.');
  }

  /**
   * Announces a message to screen readers
   * @param {string} message - The message to announce
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Removes the form from the DOM and cleans up event listeners
   */
  function destroy() {
    const form = document.getElementById(formId);
    const container = form?.parentElement;
    
    if (form) {
      form.removeEventListener('submit', handleSubmit);
      form.removeEventListener('reset', handleReset);
    }

    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * Sets focus to a specific field
   * @param {string} fieldName - Name of the field to focus ('title', 'author', 'isbn')
   */
  function focusField(fieldName) {
    const fieldMap = {
      title: titleInputId,
      author: authorInputId,
      isbn: isbnInputId
    };
    
    const inputId = fieldMap[fieldName];
    if (inputId) {
      const input = document.getElementById(inputId);
      if (input) {
        input.focus();
      }
    }
  }

  /**
   * Gets the current form values
   * @returns {Object} Current form values
   */
  function getValues() {
    const form = document.getElementById(formId);
    if (!form) return {};

    const formData = new FormData(form);
    return {
      title: formData.get('title')?.trim() || '',
      author: formData.get('author')?.trim() || '',
      isbn: formData.get('isbn')?.trim() || ''
    };
  }

  // Auto-render if container is provided
  if (container) {
    render();
  }

  // Return public API
  return {
    render,
    destroy,
    validateForm,
    focusField,
    getValues,
    clearErrors,
    hideSuccess
  };
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

// Example usage of the function
const originalSvgString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

function renderIndexView(data, options = {}) {
  const {
    container = null,
    template = null,
    itemRenderer = null,
    emptyMessage = 'No items to display',
    className = 'index-view',
    ariaLabel = 'Index view'
  } = options;

  if (!data || !Array.isArray(data) || data.length === 0) {
    if (container) {
      container.innerHTML = `<div class="${className}-empty" aria-live="polite">${emptyMessage}</div>`;
    }
    return `<div class="${className}-empty" aria-live="polite">${emptyMessage}</div>`;
  }

  const renderItem = itemRenderer || ((item) => {
    if (typeof item === 'object' && item !== null) {
      return `<div class="${className}-item" data-id="${item.id || ''}">${JSON.stringify(item)}</div>`;
    }
    return `<div class="${className}-item">${String(item)}</div>`;
  });

  const itemsHtml = data.map(renderItem).join('');
  const html = `
    <div class="${className}" role="list" aria-label="${ariaLabel}">
      ${itemsHtml}
    </div>
  `;

  if (container) {
    container.innerHTML = html;
    // Announce to screen readers
    accessibilityUtils.announceToScreenReader(`Index view rendered with ${data.length} items`);
  }

  return html;
}

// New function to handle accessibility issues
function handleAccessibilityIssues() {
  // Code to handle accessibility issues as per the insight report
  getLangAttribute();
  getFullLangAttribute();
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
  getSvgAccessibleName();
  createInPageButton();
  createAccessibleLink();
}

// New utility functions

/**
 * Formats a dependency version string for display
 * @param {string} version - Version string
 * @returns {string} Formatted version
 */
function formatVersion(version) {
  if (!version) return 'latest';
  return version.startsWith('v') ? version : `v${version}`;
}

/**
 * Sanitizes a string for safe HTML rendering
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const App = () => {
  const landmarkRef = useRef();

  return (
    <div>
      {/* Add a designated landmark for accessibility - replace 'My Application' with an appropriate name for your app */}
      <div id="landmark" ref={landmarkRef} aria-live="polite" aria-label="My Application"></div>
      {/* The rest of your existing markup here */}
    </div>
  );
};

// Export all utility functions
module.exports = {
  renderDependencyGraph,
  renderIndex,
  handleAccessibilityIssues,
  formatVersion,
  sanitizeHtml,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createInPageButton,
  fixFakeLinks,
  personName,
  addressAccessibilityIssues,
  newFocusTrap,
  renderIndexView,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addBook
};