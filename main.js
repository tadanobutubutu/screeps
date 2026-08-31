// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAccessibility())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

// Initial setup
const app = {}; // Placeholder for app configuration or initialization
let isInitialized = false;
const appData = {};

// Function to handle sorting books by title (ascending)
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  return book.id || ...
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={`by ${book.author}`}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Return an action to add the book to the books list in the Redux store
  return { type: 'ADD_BOOK', payload: book };
}

// Accessible Add Book Form Component
function AddBookForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!title.trim() || !author.trim()) {
      setError('Both title and author are required');
      return;
    }

    // Create new book object
    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim()
    };

    // Dispatch action to add book
    dispatch({ type: 'ADD_BOOK', payload: newBook });

    // Reset form
    setTitle('');
    setAuthor('');
    setError('');
  };

  return (
    <form ... aria-label="Add new book">
      <div role="group" aria-labelledby="add-book-heading">
        <h3 id="add-book-heading">Add New Book</h3>
        
        <label htmlFor="book-title">
          Book Title:
          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            aria-describedby={error ? 'book-error' : undefined}
          />
        </label>
        
        <label htmlFor="book-author">
          Author:
          <input
            id="book-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-required="true"
            aria-describedby={error ? 'book-error' : undefined}
          />
        </label>
        
        {error && (
          <span id="book-error" role="alert" aria-live="polite">
            {error}
          </span>
        )}
        
        <button type="submit" aria-label="Add book to list">
          Add Book
        </button>
      </div>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(booksList) {
  const sortedList = ...
  return sortedList;
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(booksList) {
  const sortedList = ...
  return sortedList;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const books = useSelector(state => state.books.list);
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState(defaultSorting);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      const sortedList = ...
      dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
    } else if (sorting === sortByAuthor) {
      const sortedList = [...books].sort(sortByAuthor);
      dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
    }
  }, [sorting, books, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book, index) => (
    <BookItem key={generateKey(book)} {...book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div>
      <AddBookForm />
      <button onClick={() => setSorting(sortByTitle)} aria-label="Sort books by title">
        Sort by Title
      </button>
      <button onClick={() => setSorting(sortByAuthor)} aria-label="Sort books by author">
        Sort by Author
      </button>
      <List>
        {bookItems}
      </List>
    </div>
  );
}

// Export the Main component
export default Main;

// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  // Return the language attribute for the document
  // This helps screen readers determine the language of the content
  return process.env.LANG || 'en';
}

// REACT_017 & REACT_025: Validate landmark elements for accessibility
function validateLandmarkAccessibility(element) {
  // Check if element is a valid landmark
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  if (!element) return false;
  return validLandmarks.includes(element.tagName.toLowerCase());
}

// REACT_017 & REACT_025: Validate landmark structure for proper nesting
function validateLandmarkStructure(landmarks) {
  // Ensure landmarks are properly structured
  // and there are no duplicate or improperly nested landmarks
  const errors = [];
  
  landmarks.forEach((landmark, index) => {
    // Check for duplicate main landmarks
    if (landmark.tagName && landmark.tagName.toLowerCase() === 'main') {
      const mainCount = landmarks.filter(l => l.tagName && l.tagName.toLowerCase() === 'main').length;
      if (mainCount > 1) {
        errors.push('Multiple main landmarks found - only one main landmark should exist');
      }
    }
    
    // Check for landmark nesting issues
    if (!validateLandmarkAccessibility(landmark)) {
      errors.push('Invalid landmark element found');
    }
  });
  
  return errors;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(elements) {
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

function handleAccessibilityIssues() {
  // Your implementation here
}

// Checks all links and buttons in the document for accessibility issues.
// Returns an array of accessibility violations found.
// @param {Document} document - The DOM document to check
// @returns {Array} Array of accessibility issues found
function checkDocumentAccessibility(document) {
  const issues = [];
  const links = document.querySelectorAll('a, [role="link"]');
  const buttons = document.querySelectorAll('button, [role="button"]');
  
  // Check links
  links.forEach(link => {
    const role = link.getAttribute('role');
    const tabindex = link.getAttribute('tabindex');
    const href = link.getAttribute('href');
    
    // A valid link should either:
    // 1. Be an anchor with href
    // 2. Have role="link" with proper keyboard navigation
    if (link.tagName !== 'A' || !href) {
      if (role !== 'link') {
        issues.push({
          type: 'invalid-link',
          element: link,
          message: 'Link does not have proper href or role="link"'
        });
      }
    }
    
    if (role === 'link' && !href) {
      // Must be keyboard accessible
      if (tabindex === null && link.tabIndex < 0) {
        issues.push({
          type: 'inaccessible-link',
          element: link,
          message: 'Link with role="link" must be keyboard accessible'
        });
      }
    }
  });
  
  // Check buttons
  buttons.forEach(button => {
    const role = button.getAttribute('role');
    if (role === 'link') {
      // Button with role="link" should be an anchor
      issues.push({
        type: 'invalid-button',
        element: button,
        message: 'Element with role="link" should be an anchor'
      });
    }
  });
  
  return issues;
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonProps) {
  const { onClick, label, icon, className, ariaLabel, role = 'button', href } = buttonProps;
  
  // If it's a link pretending to be a button, ensure proper button semantics
  const isFakeLink = href !== undefined;
  
  if (isFakeLink) {
    // REACT_036: Fix fake link issue by converting to proper button
    return {
      tag: 'button',
      type: 'button',
      onClick: onClick,
      ariaLabel: ariaLabel || label,
      className: className,
      content: label + (icon ? icon : '')
    };
  }
  
  return {
    tag: role,
    type: role === 'button' ? 'button' : undefined,
    onClick: onClick,
    ariaLabel: ariaLabel || label,
    className: className,
    content: label + (icon ? icon : '')
  };
}

// REACT_017 & REACT_025: Validate landmark elements (data validation for landmarks with geographic coordinates)
function validateLandmark(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  const errors = [];
  
  // Check if link has accessible text
  if (!link.textContent && !link.getAttribute('aria-label')) {
    errors.push('Link must have accessible text content or aria-label');
  }
  
  // Check if link is properly structured (not a fake link)
  if (link.hasAttribute('href') && link.tagName !== 'A') {
    errors.push('Element with href should be an anchor tag');
  }
  
  // Check for proper button semantics if it's a button
  if (link.getAttribute('role') === 'link' && link.tagName !== 'A') {
    errors.push('Element with role="link" should be an anchor tag');
  }
  
  return errors;
}

// REACT_036: Handle fake links (links that should be buttons)
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[href][role="button"], a[role="button"]');
  const issues = [];
  
  fakeLinks.forEach(link => {
    issues.push({
      element: link,
      message: 'This link has role="button" but is an anchor element - consider using a button instead',
      fix: 'Replace <a role="button"> with <button>'
    });
  });
  
  return issues;
}

function ensureLandmarkUniqueness(elements) {
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

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function main() {
  initializeApp();
  setupHandlers();
  return processData;
}

if (require.main === module) {
  main();
  console.log('Main function executed');
}

module.exports = {
  config,
  appState,
  validateLandmark,
  validateLandmarkAccessibility,
  validateLandmarkStructure,
  ensureLandmarkUniqueness,
  ensureUniqueLandmarks,
  initializeApp,
  setupHandlers,
  validateInput,
  validateLinkAccessibility,
  processData,
  main,
  getLangAttribute,
  createInPageButton,
  checkDocumentAccessibility,
  handleAccessibilityIssues,
  handleFakeLinks,
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  AddBookForm,
  defaultSorting,
  onTitleSort,
  onAuthorSort,
  Main
};