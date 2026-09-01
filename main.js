import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

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
function fixDependencyGraphAria() {
  const dependencyGraphContainer = document.getElementById('dependencyGraph');
  if (dependencyGraphContainer) {
    dependencyGraphContainer.setAttribute('role', 'region');
    dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

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

// Function to count dependencies in the module
function countDependencies() {
  const dependencies = new Set();

  // Check for common dependency patterns
  if (typeof require !== 'undefined') {
    // Node.js environment
    const modulePath = require('module').Module._cache;
    for (const path in modulePath) {
      if (path.includes('node_modules')) {
        const moduleName = path.split('node_modules/')[1].split('/')[0];
        dependencies.add(moduleName);
      }
    }
  } else if (typeof window !== 'undefined') {
    // Browser environment
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].getAttribute('src');
      if (src && src.includes('node_modules')) {
        const moduleName = src.split('node_modules/')[1].split('/')[0];
        dependencies.add(moduleName);
      }
    }
  }

  return {
    count: dependencies.size,
    dependencies: Array.from(dependencies)
  };
}

// Function to render a single book item
function BookItem({ book }) {
  return {
    key: generateKey(book),
    title: book.title,
    description: `by ${book.author}`
  };
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
  return {
    title: title,
    author: author,
    onTitleChange: handleTitleChange,
    onAuthorChange: handleAuthorChange,
    onSubmit: handleSubmit
  };
}

// Accessibility helper functions
// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonText, onClickHandler) {
  return {
    text: buttonText,
    onClick: onClickHandler,
    lang: getLangAttribute()
  };
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

// REACT_025: Ensure unique landmarks (DOM version)
function checkUniqueLandmarks() {
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

  return {
    title: title,
    author: author,
    error: error,
    onTitleChange: (e) => setTitle(e.target.value),
    onAuthorChange: (e) => setAuthor(e.target.value),
    onSubmit: handleSubmit
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

// Ensure unique landmarks by filtering duplicates (array version)
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

// Function to count dependencies (specific packages)
function getDependencyCount() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper caption if needed
    if (!table.querySelector('caption') && table.rows.length > 0) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      // Add headers if missing
      const firstRow = table.rows[0];
      if (firstRow) {
        Array.from(firstRow.cells).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        });
      }
    }

    // Ensure table has proper scope attributes for headers
    const headerRows = table.querySelectorAll('thead th');
    headerRows.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// Add/fix landmark issues
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.id = 'main-content';
    document.body.appendChild(main);
  }
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

const validateInput = (input) => input !== null && input !== undefined;

function main() {
  console.log('Main function executed');
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        svg.setAttribute('aria-labelledby', title.id);
      } else {
        svg.setAttribute('aria-label', 'graphic');
      }
    }
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"][href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'button');
    link.removeAttribute('href');
  });
}

// Address all accessibility issues from insight report
function addressInsightIssues() {
  fixDependencyGraphAria();
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Initialize the app with accessibility fixes
function initApp() {
  initializeApp();
  addressInsightIssues();
  registerSW();
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
  initializeApp,
  setupHandlers,
  validateInput,
  processData,
  makeApiCall,
  BookItem,
  BookForm,
  countDependencies,
  main,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  getDependencyCount,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixDependencyGraphAria,
  checkUniqueLandmarks,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  function3,
  defaultSorting,
  onTitleSort,
  onAuthorSort,
  AddBookForm
};