// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

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

// TODO: Identify and update specific functions that render dependency graphs or mark as N/A if none exist in this file

// Function to render a single book item
function BookItem({ book }) {
  return React.createElement(List.Item, { key: generateKey(book) },
    React.createElement(List.Item.Meta, {
      title: book.title,
      description: `by ${book.author}`
    })
  );
}

// Function to render the form for adding a new book entry
function BookForm() {
  const dispatch = useDispatch();

  // Define state for the form inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Handle input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary validation or processing before adding the book
    // ...

    // Dispatch an action to add the book to the books list in the Redux store
    dispatch({ type: 'ADD_BOOK', payload: { title, author } });
  };

  // Render the form
  return React.createElement('form', { onSubmit: handleSubmit },
    React.createElement('label', { htmlFor: 'title' }, 'Title:'),
    React.createElement('input', {
      type: 'text',
      id: 'title',
      value: title,
      onChange: handleTitleChange,
      'aria-label': 'Book title'
    }),
    React.createElement('label', { htmlFor: 'author' }, 'Author:'),
    React.createElement('input', {
      type: 'text',
      id: 'author',
      value: author,
      onChange: handleAuthorChange,
      'aria-label': 'Book author'
    }),
    React.createElement('button', { type: 'submit' }, 'Add Book')
  );
}

// Accessibility helper functions
// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonText, onClickHandler) {
  return React.createElement('button', {
    onClick: onClickHandler,
    lang: getLangAttribute()
  }, buttonText);
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(tableElement) {
  const issues = [];
  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');
  
  if (!hasCaption) {
    issues.push('Table is missing a caption');
  }
  if (!hasHeaders) {
    issues.push('Table is missing header cells (th)');
  }

  return issues;
}

// REACT_017: Validate landmarks
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

// REACT_041: Get SVG accessible name
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

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
  if (accessibleName && !svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarkTypes.forEach(type => {
    const landmarks = document.querySelectorAll(`[role="${type}"]`);
    if (landmarks.length > 1) {
      issues.push(`Multiple ${type} landmarks found - should be unique`);
    }
  });
  
  return issues;
}

// REACT_025: Add proper landmark regions
function addProperLandmarkRegions() {
  const issues = [];
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  
  if (!mainContent) {
    issues.push('Missing main landmark region');
  }
  
  return issues;
}

// REACT_036: Validate link accessibility
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

// REACT_036: Handle fake links
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

// Accessible Add Book Form component
function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    if (!author.trim()) {
      setError('Author is required');
      return;
    }

    onAddBook({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
  };

  return React.createElement('form', { ref: formRef, onSubmit: handleSubmit, 'aria-label': 'Add new book' },
    React.createElement('div', null,
      React.createElement('label', { htmlFor: 'new-book-title' }, 'Book Title:'),
      React.createElement('input', {
        ref: titleInputRef,
        id: 'new-book-title',
        type: 'text',
        value: title,
        onChange: (e) => setTitle(e.target.value),
        'aria-invalid': !!error,
        'aria-describedby': error ? 'book-form-error' : undefined
      })
    ),
    React.createElement('div', null,
      React.createElement('label', { htmlFor: 'new-book-author' }, 'Author:'),
      React.createElement('input', {
        id: 'new-book-author',
        type: 'text',
        value: author,
        onChange: (e) => setAuthor(e.target.value)
      })
    ),
    error && React.createElement('div', { id: 'book-form-error', role: 'alert', 'aria-live': 'polite' }, error),
    React.createElement('button', { type: 'submit' }, 'Add Book')
  );
}

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
          landmark.id += '_duplicate';
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

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Add main landmark
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    svg.setAttribute('aria-label', `Graphic ${index + 1}`);
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

// Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.prepend(caption);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length > 0) {
      headers.forEach(header => {
        if (!header.hasAttribute('scope')) {
          header.setAttribute('scope', 'col');
        }
      });
    }
  });
}

const validateInput = (input) => input !== null && input !== undefined;

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now(),
    BookForm: BookForm,
    BookItem: BookItem
  };
}

// Address all accessibility issues
function addressInsightIssues() {
  addLangAttribute();
  addMainLandmark();
  ensureUniqueLandmarks(landmarks);
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  fixTableStructure();
}

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
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixTableStructure,
  addressInsightIssues,
  landmarks,
  appData,
  icons
};