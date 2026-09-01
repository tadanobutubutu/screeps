// TODO: This is the existing code that needs to be preserved
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import UserSafety from './UserSafety';
import { addLangAttribute, setLanguageAttribute, fixTableStructureIssues, landmarkStructureCheck, addMainLandmark, addProperLandmarkRegions, addLandmarkRoles, addSvgAccessibleNames, validateSvgAccessibility, ensureUniqueLandmarks, ensureLandmarkUniqueness, processUniqueElements } from './accessibilityFunctions';

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

// User Safety checks
function checkSafety(book) {
  const safetyIssues = [];
  if (book.isPrivate) {
    safetyIssues.push('PII/Privacy');
  }
  if (book.longitude === undefined || book.longitude === null) {
    safetyIssues.push('Landmark must have a longitude');
  } else if (typeof book.longitude !== 'number' || isNaN(book.longitude)) {
    safetyIssues.push('Landmark longitude must be a number');
  } else if (book.longitude < -180 || book.longitude > 180) {
    safetyIssues.push('Landmark longitude must be between -180 and 180');
  }
  // Validate landmark array, if present
  if (Array.isArray(book.landmarks) && book.landmarks.length > 0) {
    // Filter duplicates and missing landmarks
    book.landmarks = ensureLandmarkUniqueness(book.landmarks);
    book.landmarks = processUniqueElements(book.landmarks);
  }
  return safetyIssues.length ? safetyIssues : undefined;
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

// Add lang attribute to HTML element
function addLangAttribute(doc, lang) {
  if (doc && doc.documentElement) {
    doc.documentElement.setAttribute('lang', lang);
  }
}

// Fix table structure issues
function fixTableStructure(doc) {
  if (!doc) return;

  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper structure
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      // Create proper structure if missing
      const thead = doc.createElement('thead');
      const tbody = doc.createElement('tbody');

      // Move existing rows to tbody
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        tbody.appendChild(row);
      });

      // Add thead with empty row if needed
      if (thead.children.length === 0) {
        const headerRow = doc.createElement('tr');
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
          headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);
      }

      table.appendChild(thead);
      table.appendChild(tbody);
    }

    // Ensure table has proper ARIA attributes
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    // Ensure cells have proper ARIA roles
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      if (!cell.getAttribute('role')) {
        cell.setAttribute('role', cell.tagName.toLowerCase() === 'th' ? 'columnheader' : 'cell');
      }
    });
  });
}

// Fix landmark issues
function fixLandmarkIssues(doc) {
  if (!doc) return;

  // Ensure main landmark exists
  if (!doc.querySelector('main')) {
    const main = doc.createElement('main');
    main.setAttribute('role', 'main');
    doc.body.appendChild(main);
  }

  // Ensure navigation landmark exists
  if (!doc.querySelector('nav')) {
    const nav = doc.createElement('nav');
    nav.setAttribute('role', 'navigation');
    doc.body.appendChild(nav);
  }

  // Ensure contentinfo landmark exists
  if (!doc.querySelector('footer')) {
    const footer = doc.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    doc.body.appendChild(footer);
  }
}

// Add main landmark
function addMainLandmark(doc) {
  if (!doc) return;

  if (!doc.querySelector('main')) {
    const main = doc.createElement('main');
    main.setAttribute('role', 'main');
    doc.body.appendChild(main);
  }
}

// Add landmark regions
function addLandmarkRegions(doc) {
  if (!doc) return;

  // Add navigation landmark if missing
  if (!doc.querySelector('nav')) {
    const nav = doc.createElement('nav');
    nav.setAttribute('role', 'navigation');
    doc.body.appendChild(nav);
  }

  // Add search landmark if missing
  if (!doc.querySelector('[role="search"]')) {
    const search = doc.createElement('div');
    search.setAttribute('role', 'search');
    doc.body.appendChild(search);
  }

  // Add contentinfo landmark if missing
  if (!doc.querySelector('footer')) {
    const footer = doc.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    doc.body.appendChild(footer);
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
    return [];
  }

  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Add accessible names to SVGs
function addSvgAccessibleNames(doc) {
  if (!doc) return;

  const svgs = doc.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'Graphic element');
    }
  });
}

// Fix fake link issues
function fixFakeLinkIssues(doc) {
  if (!doc) return;

  const elements = doc.querySelectorAll('[role="link"]');
  elements.forEach(element => {
    if (!element.getAttribute('href') && !element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

// Google sign-in logic
function googleSignIn() {
  // Implementation would go here
  console.log('Google sign-in initiated');
}

// Fix button identifiers
function fixButtonIdentifiers(doc) {
  if (!doc) return;

  const buttons = doc.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
    }
  });
}

// Ensure dependency graph container has proper ARIA role
function ensureDependencyGraphAriaRole(doc) {
  if (!doc) return;

  const graphContainer = doc.querySelector('.dependency-graph-container');
  if (graphContainer && !graphContainer.getAttribute('role')) {
    graphContainer.setAttribute('role', 'region');
    graphContainer.setAttribute('aria-label', 'Dependency Graph');
  }
}

// Render the main component containing the book list, sorting controls, user safety checks, and authorization check
function Main({ checkAllowed }) {
  // ... previous code for state, dispatch, booksList, bookItems, handleSort, and handleAddBook
  const [language, setLanguage] = useState('en');
  useEffect(() => {
    addLangAttribute(document, language);
    setLanguageAttribute(document, language);
  }, [language]);

  // Wrap the AddBookForm component with an authorization check
  const AuthorizedAddBookForm = (props) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    useEffect(() => {
      authorizeUser(() => setIsAuthorized(true));
    }, []);
    return isAuthorized ? <AddBookForm {...props} checkAllowed={checkAllowed} /> : <div>Access denied - please login to add books.</div>;
  };

  // Validate and add landmarks to the book object
  const booksListWithLandmarks = booksList.map((book) => {
    const landmarks = addProperLandmarkRegions(book.container);
    book.landmarks = landmarkStructureCheck(landmarks.landmarks);
    return book;
  });

  // Render the list of book items, sorting controls, user safety checks, and authorized AddBookForm
  return (
    <main {...getLandmarkProps('main', 'Main content')}>
      {landmarkStructureCheck(booksListWithLandmarks.map(book => book.landmarks)).valid ? (
        <>
          <button onClick={handleSort(sortByTitle)}>Sort by Title</button>
          <button onClick={handleSort(sortByAuthor)}>Sort by Author</button>
          <List
            itemLayout="vertical"
            dataSource={booksListWithLandmarks}
            renderItem={book => (
              <List.Item key={generateKey(book)}>
                <BookItem book={book} />
              </List.Item>
            )}
          />
          {fixTableStructureIssues(book.container)}
          {booksListWithLandmarks[0].landmarks.errors.length > 0 && (
            <div>Error(s) encountered initializing landmarks: {booksListWithLandmarks[0].landmarks.errors.join(', ')}</div>
          )}
          <AuthorizedAddBookForm onAdd={handleAddBook} />
        </>
      ) : (
        <div>There was an issue initializing the main landmarks. Please review the attached error codes.</div>
      )}
    </main>
  );
}

// Export the Main component with the optional checkAllowed prop
export default Main;

// Export the checkAllowed function from UserSafety
export { checkAllowed } from './UserSafety';

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
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  addSvgAccessibleNames,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole
};