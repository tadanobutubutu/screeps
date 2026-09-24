// TODO: Identify and update specific functions that render dependency graphs or
// index views.

import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { createAccessibleButton } from './accessibility.js'; // Import the new function

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

    // Example implementation (would be replaced with actual visualization code)
    container.innerHTML = `
        <div class="dependency-graph">
            <h3>Dependency Graph</h3>
            <pre>${JSON.stringify(dependencies, null, 2)}</pre>
        </div>
    `;
}

/**
 * Renders an index view of dependencies
 * @param {Object} indexData - The index data to display
 * @param {string} containerId - The ID of the container element
 */
function renderDependencyIndex(indexData, containerId) {
    // Implementation for rendering dependency index
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container element with ID ${containerId} not found`);
        return;
    }

    // Example implementation (would be replaced with actual index view code)
    container.innerHTML = `
        <div class="dependency-index">
            <h3>Dependency Index</h3>
            <ul>
                ${Object.keys(indexData).map(key => `
                    <li>
                        <strong>${key}:</strong> ${indexData[key]}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
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

// New function to add landmark roles to elements
function addLandmarkRolesToElements() {
  const landmarkRoles = {
    main: 'main',
    navigation: 'navigation',
    search: 'search',
    contentinfo: 'contentinfo',
    complementary: 'complementary',
    form: 'form',
    region: 'region'
  };

  Object.keys(landmarkRoles).forEach(role => {
    const elements = document.querySelectorAll(`[data-landmark="${role}"]`);
    elements.forEach(element => {
      element.setAttribute('role', landmarkRoles[role]);
      element.setAttribute('aria-label', role);
    });
  });
}

// New function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
  });
}

// New function to ensure unique landmarks
function ensureUniqueLandmarksInDocument() {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const seenRoles = {};

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          element.setAttribute('role', `${role}-${index + 1}`);
        }
      });
    }
    seenRoles[role] = true;
  });
}

// New function to fix fake links
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
}

// New function to address all insight issues
function addressInsightIssues() {
  addLangAttribute(document, 'en');
  addLandmarkRolesToElements();
  addSvgAccessibleNames();
  ensureUniqueLandmarksInDocument();
  fixFakeLinks();
}

// Render the main component containing the book list, sorting controls, user safety checks, and authorization check
function Main({ checkAllowed }) {
  // ... previous code for state, dispatch, booksList, bookItems, handleSort, and handleAddBook
  const [language, setLanguage] = useState('en');
  useEffect(() => {
    addLangAttribute(document, language);
    setLanguageAttribute(document, language);
    addressInsightIssues();
  }, [language]);

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
  addLandmarkRolesToElements,
  addSvgAccessibleNames,
  ensureUniqueLandmarksInDocument,
  fixFakeLinks
};