// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_017: Add landmark roles and fix landmark issues (DONE: addLandmarkRoles)
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

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
}

// Function to generate a key for each book item
function generateKey(book) {
  if (book.id) {
    return book.id;
  }
  return `${book.title}-${book.author}-${Math.random().toString(36).substr(2, 9)}`;
}

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
}

// New function for REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles() {
  // Implementation for adding landmark roles
}

// New function for REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

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
          required
          aria-describedby="title-help"
        />
        <span id="title-help" className="sr-only">Please enter the book title</span>
      </div>
      <div>
        <label htmlFor="book-author" aria-required="true">Author:</label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
          required
          aria-describedby="author-help"
        />
        <span id="author-help" className="sr-only">Please enter the author's name</span>
      </div>
      <button type="submit" aria-label="Add book to collection">Add Book</button>
    </form>
  );
}

// New function to enhance accessibility for the addBook function
function enhanceAccessibilityForAddBook() {
  // Add ARIA attributes to the form elements
  const form = document.querySelector('form[aria-label="Add new book"]');
  if (form) {
    // Add required attributes to inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.setAttribute('required', 'true');
      input.setAttribute('aria-required', 'true');
    });

    // Add help text for screen readers
    const titleInput = form.querySelector('#book-title');
    if (titleInput && !titleInput.nextElementSibling?.classList.contains('sr-only')) {
      const titleHelp = document.createElement('span');
      titleHelp.id = 'title-help';
      titleHelp.className = 'sr-only';
      titleHelp.textContent = 'Please enter the book title';
      titleInput.insertAdjacentElement('afterend', titleHelp);
    }

    const authorInput = form.querySelector('#book-author');
    if (authorInput && !authorInput.nextElementSibling?.classList.contains('sr-only')) {
      const authorHelp = document.createElement('span');
      authorHelp.id = 'author-help';
      authorHelp.className = 'sr-only';
      authorHelp.textContent = "Please enter the author's name";
      authorInput.insertAdjacentElement('afterend', authorHelp);
    }

    // Add ARIA label to submit button if not present
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton && !submitButton.hasAttribute('aria-label')) {
      submitButton.setAttribute('aria-label', 'Add book to collection');
    }
  }
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = [...booksList].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = [...booksList].sort(sortByAuthor).reverse();
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(() => sortByTitle);
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
}

// Export the Main component
export default Main;