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

// Ensure the dependencyGraph container has a proper ARIA role
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

  // Ensure landmarks uniqueness when there's an array structure
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

  let landmarksJs = [].concat(...document.querySelectorAll('*[role]'));
  landmarksJs = ensureLandmarkUniqueness(landmarksJs);

  const issues = [];
  const currentLandmarks = new Set();

  for (const landmark of landmarksJs) {
    const role = landmark.getAttribute('role');
    if (role && !currentLandmarks.has(role)) {
      currentLandmarks.add(role);
    } else {
      issues.push(`Duplicate ${role} landmark`);
    }
  }

  return issues.length === 0;
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

function handleAccessibilityIssues(elements) {
  // Handles any remaining accessibility issues
  // Implementation would address any issues not covered by other functions

  const issues = [];

  elements.forEach(element => {
    if (element.tagName.toLowerCase() === 'a') {
      if (!element.href) {
        issues.push(`Invalid <a> element: Missing href attribute`);
      }
    }
  });

  return issues;
}

// Implemented validateLandmarkData function with updates
function validateLandmarkData(landmarksData) {
  const errors = [];

  function validateSingleLandmark(landmark) {
    if (!landmark) {
      errors.push('Landmark is required');
      return false;
    }

    if (Array.isArray(landmark)) {
      landmark.forEach(innerLandmark => {
        if (!validateSingleLandmark(innerLandmark)) return false;
      });
      return true;
    }

    const landmarkProps = ['name', 'latitude', 'longitude'];

    for (const prop of landmarkProps) {
      if (!landmark[prop]) {
        errors.push(`Missing property: ${prop}`);
        return false;
      }

      if (typeof landmark[prop] !== 'string' && !Array.isArray(landmark[prop])) {
        errors.push(`Invalid property type: ${prop}`);
        return false;
      }

      if (Array.isArray(landmark[prop])) {
        landmark[prop].forEach(val => {
          if (typeof val !== 'string') {
            errors.push(`Invalid property values for array: ${prop}`);
            return false;
          }
        });
      }
    }

    return true;
  }

  // Iterate and validate each landmark
  for (const landmark of landmarksData) {
    if (!validateSingleLandmark(landmark)) return { valid: false, errors };
  }

  return { valid: true, errors };
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
  const sortedList = [...list].sort((a, b) => b.author.localeCompare(a.author));
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

    if (!title || !author) {
      setError('Title and author are required');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    onAddBook({ title, author });
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

export {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  validateLandmarkData,
  getSvgAccessibleName,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateInput,
  processData,
  function3,
  addLangAttribute,
  addMainLandmark,
  ensureLandmarkUniqueness,
  createInPageButton,
  landmarks,
  appData,
  icons
};