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
  // Fetch dependencies for the specified book
  // ... (Assuming you have an API endpoint to fetch book dependencies or implementing this logic)

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: /* The fetched dependencies */ }));
};

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