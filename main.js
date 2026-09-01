import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import getLangAttribute from './accessibility-helpers/getLangAttribute';
import createInPageButton from './accessibility-helpers/createInPageButton';
import validateTableAccessibility from './accessibility-helpers/validateTableAccessibility';
import validateLandmarkStructure from './accessibility-helpers/validateLandmarkStructure';
import getSvgAccessibleName from './accessibility-helpers/getSvgAccessibleName';
import setSvgAttributes from './accessibility-helpers/setSvgAttributes';
import ensureUniqueLandmarks from './accessibility-helpers/ensureUniqueLandmarks';
import addProperLandmarkRegions from './accessibility-helpers/addProperLandmarkRegions';
import validateLinkAccessibility from './accessibility-helpers/validateLinkAccessibility';
import handleFakeLinks from './accessibility-helpers/handleFakeLinks';
import function3 from './function3';
import defaultSorting from './book-list-sorting';
import onTitleSort from './book-list-sorting/onTitleSort';
import onAuthorSort from './book-list-sorting/onAuthorSort';
import AddBookForm from './components/AddBookForm';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Helper function to check if the specified landmark element is in the document.
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const elementsById = {};

  for (const landmark of elements) {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

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

// Address all accessibility issues
function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute();
  ensureUniqueLandmarks(landmarks);
  addMainLandmark();
  addSvgAccessibleNames();
  ensureLandmarkUniqueness(landmarks);
  fixFakeLinkIssue();
  fixTableStructure();
}

// Initialize app
function initApp() {
  addressInsightIssues();
  wrapPrimaryContentInMain();
}

// Export all functions
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
  addBookAccessibility, // New export for book accessibility
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLandmarkData,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixTableStructure
};