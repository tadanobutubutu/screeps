import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } from './accessibility';

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
          landmark.id += '_duplicate';
          elementsById[landmark.id] = true;
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

/**
 * Harvests landmark data from the DOM
 * Collects landmark information from semantic HTML elements and ARIA landmarks
 * @returns {Array} Array of harvested landmark data objects
 */
function harvestLandmarks() {
  const harvestedLandmarks = [];
  
  // Select all potential landmark elements
  const landmarkSelectors = [
    '[role="main"]', '[role="navigation"]', '[role="search"]', 
    '[role="contentinfo"]', '[role="complementary"]', '[role="form"]', 
    '[role="region"]', '[role="banner"]', '[role="navigation"]',
    'main', 'nav', 'aside', 'form', 'section', 'header', 'footer', 'address'
  ];
  
  const allLandmarkElements = document.querySelectorAll(landmarkSelectors.join(', '));
  
  allLandmarkElements.forEach(element => {
    const landmarkData = {
      id: element.id || null,
      tagName: element.tagName ? element.tagName.toLowerCase() : null,
      role: element.getAttribute('role') || null,
      ariaLabel: element.getAttribute('aria-label') || null,
      ariaLabelledby: element.getAttribute('aria-labelledby') || null,
      className: element.className || '',
      hasHeading: element.querySelector('h1, h2, h3, h4, h5, h6') !== null,
      childCount: element.children ? element.children.length : 0,
      isVisible: element.offsetParent !== null,
      isSecure: isSecureContext
    };
    
    harvestedLandmarks.push(landmarkData);
  });
  
  return harvestedLandmarks;
}

/**
 * Upgrades landmark elements with enhanced accessibility attributes
 * @param {Array} landmarksToUpgrade - Array of landmark data objects to upgrade
 * @returns {Array} Array of upgraded landmarks
 */
function upgradeLandmarks(landmarksToUpgrade) {
  const upgradedLandmarks = [];
  
  if (!Array.isArray(landmarksToUpgrade)) {
    return upgradedLandmarks;
  }
  
  landmarksToUpgrade.forEach(landmark => {
    // Skip if no valid data
    if (!landmark || typeof landmark !== 'object') {
      return;
    }
    
    const elementId = landmark.id;
    const element = elementId ? document.getElementById(elementId) : null;
    
    if (!element) {
      return;
    }
    
    const upgradeLog = {
      id: elementId,
      originalRole: landmark.role,
      originalTag: landmark.tagName,
      upgrades: []
    };
    
    // Ensure element has a unique ID
    if (!element.id) {
      const generatedId = `landmark_${landmark.role || landmark.tagName || 'element'}_${Date.now()}`;
      element.id = generatedId;
      upgradeLog.upgrades.push('assigned_unique_id');
    }
    
    // Ensure element has an ARIA role if it's a semantic element
    if (!element.getAttribute('role')) {
      const semanticRoleMap = {
        'main': 'main',
        'nav': 'navigation',
        'aside': 'complementary',
        'form': 'form',
        'section': 'region',
        'header': 'banner',
        'footer': 'contentinfo'
      };
      
      const tagName = element.tagName ? element.tagName.toLowerCase() : null;
      if (tagName && semanticRoleMap[tagName]) {
        element.setAttribute('role', semanticRoleMap[tagName]);
        upgradeLog.upgrades.push('assigned_role_from_semantics');
      }
    }
    
    // Ensure element has an accessible name
    if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.hasHeading) {
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && heading.textContent.trim()) {
        element.setAttribute('aria-label', heading.textContent.trim());
        upgradeLog.upgrades.push('assigned_aria_label_from_heading');
      }
    }
    
    // Add landmark to the upgraded landmarks array
    upgradedLandmarks.push(landmark);
  });
  
  return upgradedLandmarks;
}

/**
 * Main App Component
 * @returns {JSX.Element} React component
 */
function App() {
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const dependencyGraph = useSelector(state => state.dependencyGraph);

  useEffect(() => {
    const initialBooks = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { title: '1984', author: 'George Orwell' }
    ];
    setBooks(initialBooks);
  }, []);

  const handleAddBook = (book) => {
    const enhancedBook = enhanceAccessibilityForAddBook(book);
    dispatch(addBook(enhancedBook));
    setBooks(prevBooks => [...prevBooks, book]);
  };

  return (
    <div className="App" role="application">
      <h1>Book List</h1>
      <List
        className="book-list"
        itemLayout="horizontal"
        dataSource={books}
        renderItem={(book) => (
          <BookItem
            book={book}
            onEdit={(updatedBook) => {
              const enhancedBook = enhanceAccessibilityForAddBook(updatedBook);
              dispatch(addBook(enhancedBook));
              setBooks(prevBooks => prevBooks.map(b => b.id === book.id ? updatedBook : b));
            }}
          />
        )}
      />
      <Button 
        type="primary" 
        onClick={() => {
          const newBook = { title: 'New Book', author: 'Author Name' };
          handleAddBook(newBook);
        }}
        aria-label="Add new book"
      >
        Add Book
      </Button>
    </div>
  );
}

export default App;