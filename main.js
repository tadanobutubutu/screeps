// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph'; // Assuming you have a dependencyGraph action creator

// Import dependency graph and index content from appropriate modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);
const dispatch = useDispatch();

// Function to handle sorting books by title (ascending)
export function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
export function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  if (book.id) {
    return book.id;
  }
  return `${book.title}-${book.author}-${Math.random().toString(36).substr(2, 9)}`;
}

// Function to render a single book item
function BookItem(book) {
  const [dependencies, setDependencies] = useState(book.dependencies || []);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchBookDependencies(book.id);
  }, [book.id]);

  const handleUpdateDependencies = () => {
    updateBookDependencies(book.id, [...dependencies]);
  };

  return (
    <List.Item key={generateKey(book)}>
      <Button onClick={handleUpdateDependencies}>Update Dependencies</Button>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
      {dependencies.length > 0 && <p>Dependencies: {dependencies.join(', ')}</p>}
    </List.Item>
  );
}

// Function to fetch book dependencies and update the Redux store
async function fetchBookDependencies(bookId) {
  // Fetch dependencies for the specified book
  // ... (Assuming you have an API endpoint to fetch book dependencies or implementing this logic)

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: /* The fetched dependencies */ }));
}

// Function to handle updating book dependencies
function updateBookDependencies(bookId, newDependencies) {
  // Perform any necessary validation or processing before updating the book's dependencies
  // ...

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
}

// Implement the required changes to improve accessibility for the addBook function or form
function enhanceAccessibilityForAddBook() {
  // Implement accessibility improvements here
  // Example: Adding ARIA attributes, keyboard navigation, etc.
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to improve accessibility for adding a new book
function improveAccessibilityForAddBook() {
  // Implement accessibility improvements for adding a new book
  enhanceAccessibilityForAddBook();
}

// REACT_015: Helper to provide the lang attribute for the HTML element.
// Returns an object containing props to spread onto the root <html> element.
function getRootHtmlAccessibilityProps(lang = 'en') {
  return { lang };
}

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
}

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
}

// REACT_036: Helper that returns props for converting a non-semantic element
// that is being used as a link into a real, accessible anchor.
function getAccessibleLinkProps(href, label) {
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
}

// Function to handle sorting the book list by title (ascending)
export function onTitleSort() {
  const sortedList = [...getBooksList].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
export function onAuthorSort() {
  const sortedList = [...getBooksList].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(sortByTitle);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <main role="main" aria-label="Book list and sorting controls">
      <nav aria-label="Sorting controls">
        <button
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title"
        >
          Sort by Title
        </button>
        <button
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author"
        >
          Sort by Author
        </button>
      </nav>
      <List
        itemLayout="horizontal"
        dataSource={bookItems}
        renderItem={(item) => item}
      />
      {/* Implement the required changes to improve accessibility for adding a new book */}
      <Button onClick={improveAccessibilityForAddBook} aria-label="Add Book">Add Book</Button>
      {/* Example accessibility improvement: */}
      <button onClick={enhanceAccessibilityForAddBook} aria-label="Enhance accessibility for adding a new book">Enhance Accessibility</button>
    </main>
  );
}

// Export the Main component
export default Main;