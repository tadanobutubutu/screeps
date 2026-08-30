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
async function fetchBookDependencies(bookId, dispatch) {
  // Fetch dependencies for the specified book
  // ... (Assuming you have an API endpoint to fetch book dependencies or implementing this logic)

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: /* The fetched dependencies */ }));
};

// Component for adding a new book with accessibility improvements
function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validate that required fields are filled
    if (!title.trim()) {
      setError('Book title is required');
      return;
    }
    
    if (!author.trim()) {
      setError('Author name is required');
      return;
    }

    // Clear error and add the book
    setError('');
    if (onAdd) {
      onAdd({ title: title.trim(), author: author.trim() });
    } else {
      addBook({ title: title.trim(), author: author.trim() });
    }
    
    // Clear form fields after submission
    setTitle('');
    setAuthor('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book" role="form">
      <div>
        <label htmlFor="book-title" id="book-title-label">
          Book Title
        </label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-labelledby="book-title-label"
          aria-required="true"
          placeholder="Enter book title"
        />
      </div>
      
      <div>
        <label htmlFor="book-author" id="book-author-label">
          Author Name
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-labelledby="book-author-label"
          aria-required="true"
          placeholder="Enter author name"
        />
      </div>

      {error && (
        <div role="alert" aria-live="polite">
          <span id="form-error">{error}</span>
        </div>
      )}

      <button 
        type="submit" 
        aria-label="Add book to collection"
      >
        Add Book
      </button>
    </form>
  );
}

// Function to handle updating book dependencies
function updateBookDependencies(bookId, newDependencies, dispatch) {
  // Perform any necessary validation or processing before updating the book's dependencies
  // ...

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
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
  const [sorting, setSorting] = useState(sortByTitle);
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);

  const handleSort = (sortFunction) => () => {
    const sortedList = [...booksList].sort(sortFunction);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BOOKS', payload: sortedList });
    setSorting(sortFunction);
  };

  const handleAddBook = () => {
    // Implement the accessibility improvements
    enhanceAccessibilityForAddBook();
    // Add the new book as before
    addBook();
  };

  // Render the list of book items and sorting controls
  return (
    <main {...getLandmarkProps('main', 'Main content')}>
      <h2 id="sort-controls-heading">Sort Book List</h2>
      <div role="group" aria-labelledby="sort-controls-heading">
        <button 
          onClick={handleSort(sortByTitle)}
          aria-label="Sort books by title in ascending order"
        >
          Sort by Title
        </button>
        <button 
          onClick={handleSort(sortByAuthor)}
          aria-label="Sort books by author in descending order"
        >
          Sort by Author
        </button>
      </div>
      <List
        itemLayout="vertical"
        dataSource={booksList}
        renderItem={book => (
          <List.Item key={generateKey(book)}>
            <BookItem book={book} />
          </List.Item>
        )}
      />
      <AddBookForm />
      {booksList.length > 0 && (
        <Button onClick={handleAddBook}>
          {typeof enhanceAccessibilityForAddBook === 'function' ? 'Add Book (Experimental Accessibility Improvements)' : 'Add Book'}
        </Button>
      )}
      <button onClick={enhanceAccessibilityForAddBook} aria-label="Enhance accessibility for adding a new book">Enhance Accessibility</button>
    </main>
  );
};

// Export the Main component
export default Main;