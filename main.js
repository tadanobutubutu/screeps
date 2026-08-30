// Import necessary dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { List, Form, Input, Button, UUID } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useId } from '@react-aria/utils';
import { ADD_BOOK, SORT_BY_TITLE, SORT_BY_AUTHOR } from './store/types';

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
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to validate the landmark property of a book (merged change)
function validateLandmark(book) {
  if (!book || typeof book !== 'object') {
    return false;
  }

  if (!book.landmark || typeof book.landmark !== 'string' || book.landmark.trim() === '') {
    return false;
  }

  return true;
}

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, books) {
  const sortedList = [...books].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: SORT_BY_TITLE, payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, books) {
  const sortedList = [...books].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: SORT_BY_AUTHOR, payload: sortedList });
}

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book (existing code)

  // Return an action object to add the book to the books list in the Redux store
  return { type: ADD_BOOK, payload: book };
}

// Container for the dependency graph with proper ARIA role for accessibility
function DependencyGraph({ nodes, edges }) {
  return (
    // Existing DependencyGraph component (merged change)
  );
}

// Function to render a form for adding a new book and to handle form submission
function AddBookForm() {
  const [book, setBook] = useState({ title: '', author: '' });
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary validation or processing before adding the book (existing code)
    if (book && book.title && book.author) {
      dispatch(addBook(book));
    } else {
      // Handle the error appropriately, possibly showing an error message to the user (updated for merged changes)
      console.error('Book information is incomplete');
      return;
    }

    setBook({ title: '', author: '', id: UUID.generate() }); // Reset the form after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          required
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          required
        />
      </label>
      <Button type="primary" onClick={() => validateLandmark(book)}>Add Book</Button>
    </form>
  );
}

// Render the main component containing the book list, sorting controls, and the AddBookForm
function Main() {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  // Create memoized sort handlers
  const handleTitleSort = useCallback(() => {
    onTitleSort(dispatch, books);
  }, [dispatch, books]);

  const handleAuthorSort = useCallback(() => {
    onAuthorSort(dispatch, books);
  }, [dispatch, books]);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      handleTitleSort();
    } else if (sorting === sortByAuthor) {
      handleAuthorSort();
    }
  }, [sorting, handleTitleSort, handleAuthorSort]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items, sorting controls, and the AddBookForm
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <AddBookForm />
      <List dataSource={bookItems} />
      <DependencyGraph
        nodes={[]}
        edges={[]}
      />
    </div>
  );
}

// Export the Main component
export default Main;

// Add back required exports for testing and external use
export {
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  onTitleSort,
  onAuthorSort,
  defaultSorting,
  validateLandmark,
  DependencyGraph,
  AddBookForm,
};