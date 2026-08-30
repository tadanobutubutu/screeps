// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

// Function to handle sorting books by title (ascending)
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  return book.id || `${book.title}-${book.author}`;
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Function to address accessibility issues from insight report
function addressAccessibilityIssues() {
  // Create and inject ARIA live region for screen reader announcements
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'a11y-live-region';
  document.body.appendChild(liveRegion);

  // Function to announce dynamic content changes to screen readers
  function announceToScreenReader(message) {
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 50);
    }
  }

  // Function to manage focus for keyboard accessibility
  function manageFocus(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  // Function to trap focus within a modal/dialog for accessibility
  function trapFocus(containerElement) {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    containerElement.addEventListener('keydown', handleTabKey);
    return () => containerElement.removeEventListener('keydown', handleTabKey);
  }

  return {
    announceToScreenReader,
    manageFocus,
    trapFocus
  };
}

// Function to handle form submission with accessibility improvements
function handleAddBookSubmit(event, book, setError, setSubmitting) {
  event.preventDefault();
  
  // Validate book data
  if (!book.title.trim() || !book.author.trim()) {
    setError('Please fill in all required fields');
    // Move focus to error message for screen readers
    const errorElement = document.getElementById('add-book-error');
    if (errorElement) {
      errorElement.focus();
    }
    return;
  }
  
  setError('');
  setSubmitting(true);
  
  // Add the book
  addBook(book);
  
  // Reset form after successful submission
  // Use setTimeout to ensure state updates are processed
  setTimeout(() => {
    setSubmitting(false);
    // Move focus back to submit button for keyboard accessibility
    const submitButton = document.getElementById('add-book-submit');
    if (submitButton) {
      submitButton.focus();
    }
  }, 100);
}

// Accessible Add Book Form Component
function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  
  // Create book object
  const book = {
    id: Date.now(),
    title: title,
    author: author,
    createdAt: new Date().toISOString()
  };
  
  // Handle input changes with proper labeling for screen readers
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };
  
  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };
  
  // Handle form submission
  const onSubmit = (e) => handleAddBookSubmit(e, book, setError, setSubmitting);
  
  return (
    <form onSubmit={onSubmit} aria-labelledby="add-book-heading" role="form">
      <h2 id="add-book-heading">Add New Book</h2>
      
      <div>
        <label htmlFor="book-title" id="book-title-label">
          Title <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          aria-required="true"
          aria-labelledby="book-title-label"
          aria-invalid={!!error}
          aria-describedby={error ? 'add-book-error' : undefined}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="book-author" id="book-author-label">
          Author <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={handleAuthorChange}
          aria-required="true"
          aria-labelledby="book-author-label"
          aria-invalid={!!error}
          aria-describedby={error ? 'add-book-error' : undefined}
          disabled={isSubmitting}
        />
      </div>
      
      {error && (
        <div
          id="add-book-error"
          role="alert"
          aria-live="assertive"
          style={{ color: 'red', marginTop: '8px' }}
          tabIndex="-1"
        >
          {error}
        </div>
      )}
      
      <button
        id="add-book-submit"
        type="submit"
        disabled={isSubmitting}
        aria-describedby="add-book-submit-hint"
      >
        {isSubmitting ? 'Adding...' : 'Add Book'}
      </button>
      <span id="add-book-submit-hint" className="sr-only">
        Press Enter to submit the form and add a new book to the list
      </span>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map((book, index) => (
    <BookItem key={generateKey(book)} {...book} />
  ));

  // Initialize accessibility utilities
  const { announceToScreenReader, manageFocus } = addressAccessibilityIssues();

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List
        dataSource={getBooksList}
        renderItem={(item) => <BookItem {...item} />}
        aria-label="Book list"
      />
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;