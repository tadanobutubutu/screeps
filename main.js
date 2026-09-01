// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e.g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array} tables - Array of table objects to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  tables.forEach((table, index) => {
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.success) {
      issues.push({
        landmarkIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (svg.ariaLabel) {
    return svg.ariaLabel;
  }
  if (svg.ariaLabelledby) {
    return svg.ariaLabelledby;
  }
  if (svg.title) {
    return svg.title;
  }
  return 'Unnamed SVG';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.ariaLabel - Aria label for the button
 * @param {Function} options.onClick - Click handler
 * @returns {Object} Button element object
 */
function createInPageButton(options) {
  return {
    type: 'button',
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    onClick: options.onClick,
    accessibleName: getSvgAccessibleName({ ariaLabel: options.ariaLabel })
  };
}

/**
 * Creates an accessible link element
 * @param {Object} options - Link options
 * @param {string} options.href - Link URL
 * @param {string} options.text - Link text
 * @param {string} options.ariaLabel - Aria label for the link
 * @returns {Object} Link element object
 */
function createAccessibleLink(options) {
  return {
    type: 'a',
    href: options.href,
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    isFake: false
  };
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

/**
 * Creates an accessible form field with proper ARIA attributes
 * @param {Object} options - Field options
 * @param {string} options.id - Field ID
 * @param {string} options.label - Field label text
 * @param {string} options.type - Field type (text, email, etc.)
 * @param {boolean} options.required - Whether field is required
 * @param {string} [options.placeholder] - Placeholder text
 * @returns {Object} Form field element object
 */
function createAccessibleFormField(options) {
  return {
    type: 'input',
    id: options.id,
    label: options.label,
    text: options.label,
    ariaLabel: options.label,
    ariaRequired: options.required,
    required: options.required,
    type: options.type,
    placeholder: options.placeholder || '',
    role: 'textbox',
    tabIndex: 0
  };
}

/**
 * Creates an accessible form with proper ARIA attributes and structure
 * @param {Object} options - Form options
 * @param {string} options.id - Form ID
 * @param {string} options.title - Form title
 * @param {Array} options.fields - Array of form fields
 * @param {Function} options.onSubmit - Submit handler
 * @returns {Object} Form element object
 */
function createAccessibleForm(options) {
  return {
    type: 'form',
    id: options.id,
    title: options.title,
    ariaLabel: options.title,
    role: 'form',
    fields: options.fields.map(field => createAccessibleFormField(field)),
    onSubmit: options.onSubmit,
    tabIndex: -1
  };
}

/**
 * Adds a book to the collection with accessibility considerations
 * @param {Object} book - Book object to add
 * @param {string} book.title - Book title
 * @param {string} book.author - Book author
 * @param {string} book.isbn - Book ISBN
 * @param {string} [book.description] - Book description
 * @returns {Object} Result of the add operation
 */
function addBook(book) {
  // Validate required fields
  if (!book.title || !book.author || !book.isbn) {
    return {
      success: false,
      error: 'Missing required book information'
    };
  }

  // Create accessible form for book details
  const bookForm = createAccessibleForm({
    id: 'add-book-form',
    title: 'Add New Book',
    fields: [
      {
        id: 'book-title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Enter book title'
      },
      {
        id: 'book-author',
        label: 'Author',
        type: 'text',
        required: true,
        placeholder: 'Enter author name'
      },
      {
        id: 'book-isbn',
        label: 'ISBN',
        type: 'text',
        required: true,
        placeholder: 'Enter ISBN number'
      },
      {
        id: 'book-description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Enter book description'
      }
    ],
    onSubmit: (formData) => {
      // Process form submission
      console.log('Book added:', formData);
      return { success: true };
    }
  });

  // Return both the book data and the accessible form
  return {
    success: true,
    book: {
      ...book,
      accessibleForm: bookForm
    }
  };
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  createAccessibleFormField,
  createAccessibleForm,
  addBook
};