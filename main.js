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
  countDependencies
};