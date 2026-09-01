// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';

// Accessibility helper functions
const getRootHtmlAccessibilityProps = (lang = 'en') => {
  return { lang };
};

const getLandmarkProps = (role, label, id) => {
  const props = {
    role,
    'aria-label': label,
  };
  if (id) {
    props.id = id;
  }
  return props;
};

const getSvgAccessibilityProps = (label, labelledById) => {
  const props = {
    role: 'img',
    focusable: 'false',
  };
  if (label) {
    props['aria-label'] = label;
  } else if (labelledById) {
    props['aria-labelledby'] = labelledById;
  } else {
    // Fallback so the SVG is still considered decorative but explicitly marked.
    props['aria-hidden'] = 'true';
  }
  return props;
};

const getAccessibleLinkProps = (href, label) => {
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
};

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
};

// Function to generate a key for each book item
function generateKey(book) {
  if (book.id) {
    return book.id;
  }
  return `${book.title}-${book.author}-${Math.random().toString(36).substr(2, 9)}`;
};

// Function to fetch book dependencies and update the Redux store
async function fetchBookDependencies(bookId) {
  try {
    const response = await fetch(`https://api.example.com/books/${bookId}/dependencies`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dependencies = await response.json();
    dispatch(setDependencyGraph({ bookId, dependencies }));
  } catch (error) {
    console.error('Error fetching book dependencies:', error);
  }
}

// Function to handle updating book dependencies
function updateBookDependencies(bookId, newDependencies) {
  // Perform any necessary validation or processing before updating the book's dependencies
  // ...

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
};

// Accessibility: AddBookForm component with proper labels and ARIA attributes
function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      onAdd({ title: title.trim(), author: author.trim() });
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book">
      <div>
        <label htmlFor="book-title" aria-required="true">Book Title:</label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
        />
      </div>
      <div>
        <label htmlFor="book-author" aria-required="true">Author:</label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
        />
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
};

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
};

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.sort(sortByAuthor).reverse();
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
};

// REACT_015: Helper to provide the lang attribute for the HTML element.
// Returns an object containing props to spread onto the root <html> element.
function getRootHtmlAccessibilityProps(lang = 'en') {
  return { lang };
};

// REACT_017 / REACT_025: Helper to build landmark region props with a unique
// label so each landmark has a distinct accessible name (fixes duplicate
// landmarks and ensures proper landmark roles are used).
function getLandmarkProps(role, label, id) {
  const props = {
    role,
    'aria-label': label,
  };
  if (id) {
    props.id = id;
  }
  return props;
};

// REACT_041: Helper to return props that provide an accessible name for an
// <svg> element (via aria-label) so screen readers can announce it.
function getSvgAccessibilityProps(label, labelledById) {
  const props = {
    role: 'img',
    focusable: 'false',
  };
  if (label) {
    props['aria-label'] = label;
  } else if (labelledById) {
    props['aria-labelledby'] = labelledById;
  } else {
    // Fallback so the SVG is still considered decorative but explicitly marked.
    props['aria-hidden'] = 'true';
  }
  return props;
};

// REACT_036: Helper that returns props for converting a non-semantic element
// that is being used as a link into a real, accessible anchor.
function getAccessibleLinkProps(href, label) {
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
};

// REACT_027: Validate table structure and accessibility
function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption') !== null;
  const hasThead = tableElement.querySelector('thead') !== null;
  const hasTbody = tableElement.querySelector('tbody') !== null;

  // Check for proper headers
  const headers = tableElement.querySelectorAll('th');
  const hasScope = Array.from(headers).every(th => th.hasAttribute('scope'));

  // Check for proper data cells
  const dataCells = tableElement.querySelectorAll('td');
  const hasHeaders = Array.from(dataCells).every(td => td.hasAttribute('headers'));

  return hasCaption && hasThead && hasTbody && hasScope && hasHeaders;
}

// REACT_027: Validate table structure
function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption') !== null;
  const hasThead = tableElement.querySelector('thead') !== null;
  const hasTbody = tableElement.querySelector('tbody') !== null;

  // Check for proper headers
  const headers = tableElement.querySelectorAll('th');
  const hasScope = Array.from(headers).every(th => th.hasAttribute('scope'));

  return hasCaption && hasThead && hasTbody && hasScope;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
  const landmarkRoles = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarkRoles[role]) {
      landmark.setAttribute('aria-label', `${role} ${Object.keys(landmarkRoles).filter(r => r === role).length + 1}`);
    } else {
      landmarkRoles[role] = true;
    }
  });
}

// REACT_025: Ensure unique landmarks from string
function ensureUniqueLandmarksFromString(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const landmarks = doc.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
  const landmarkRoles = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarkRoles[role]) {
      landmark.setAttribute('aria-label', `${role} ${Object.keys(landmarkRoles).filter(r => r === role).length + 1}`);
    } else {
      landmarkRoles[role] = true;
    }
  });

  return doc.documentElement.outerHTML;
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(linkElement) {
  if (!linkElement) return false;

  // Check if link has proper ARIA attributes
  const hasRole = linkElement.hasAttribute('role') && linkElement.getAttribute('role') === 'link';
  const hasLabel = linkElement.hasAttribute('aria-label') || linkElement.hasAttribute('aria-labelledby');

  // Check if link has proper href
  const hasHref = linkElement.hasAttribute('href') && linkElement.getAttribute('href').trim() !== '';

  return hasRole && hasLabel && hasHref;
}

// REACT_036: Handle fake links
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not([href])');

  fakeLinks.forEach(link => {
    // Convert to real link if it has proper ARIA attributes
    if (link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby')) {
      link.setAttribute('href', '#');
      link.setAttribute('tabindex', '0');
    } else {
      // Remove role if it's not properly labeled
      link.removeAttribute('role');
    }
  });
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
    mainContent.setAttribute('aria-label', 'Main content');
  }

  const navigation = document.querySelector('nav');
  if (navigation && !navigation.hasAttribute('role')) {
    navigation.setAttribute('role', 'navigation');
    navigation.setAttribute('aria-label', 'Site navigation');
  }

  const search = document.querySelector('[role="search"]');
  if (search && !search.hasAttribute('aria-label')) {
    search.setAttribute('aria-label', 'Search');
  }
}

// REACT_037: Validate landmark
function validateLandmark(landmarkElement) {
  if (!landmarkElement) return false;

  const role = landmarkElement.getAttribute('role');
  const hasLabel = landmarkElement.hasAttribute('aria-label') || landmarkElement.hasAttribute('aria-labelledby');

  return role && hasLabel;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(() => {
    const sortFunction = addBook.length > 0 ? sortByTitle : sortByTitle; // Use sortByTitle if the 'addBook' function is present, otherwise use default
    return sortFunction;
  });
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map(book => BookItem(book));

  const handleAddBook = () => {
    // Implement the accessibility improvements
    enhanceAccessibilityForAddBook();
    // Add the new book as before
    addBook();
  };

  const handleSort = (sortFunction) => () => {
    const sortedList = [...booksList].sort(sortFunction);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BOOKS', payload: sortedList });
    setSorting(sortFunction);
  };

  // Render the list of book items and sorting controls
  return (
    <main {...getLandmarkProps('main', 'Main content')}>
      <button onClick={handleSort(sortByTitle)}>Sort by Title</button>
      <button onClick={handleSort(sortByAuthor)}>Sort by Author</button>
      <List
        itemLayout="vertical"
        dataSource={booksList}
        renderItem={book => (
          <List.Item key={generateKey(book)}>
            <BookItem book={book} />
          </List.Item>
        )}
      />
      <Button onClick={handleAddBook}>
        {typeof enhanceAccessibilityForAddBook === 'function' ? 'Add Book (Experimental Accessibility Improvements)' : 'Add Book'}
      </Button>
      <button onClick={enhanceAccessibilityForAddBook} aria-label="Enhance accessibility for adding a new book">Enhance Accessibility</button>
    </main>
  );
};

// Export the Main component
export default Main;