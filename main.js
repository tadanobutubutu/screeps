// Import necessary dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { List, Form, Input, Button, UUID } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useId } from '@react-aria/utils';
import { ADD_BOOK, SORT_BY_TITLE, SORT_BY_AUTHOR } from './store/types';

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
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)} role="listitem">
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Container for the dependency graph with proper ARIA role for accessibility
function DependencyGraph({ nodes, edges }) {
  return (
    <div
      className="dependency-graph"
      role="img"
      aria-label="Dependency graph showing relationships between books and authors"
      tabIndex={0}
    >
      {/* Render graph nodes and edges */}
      {/* ... */}
    </div>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

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
  // Perform any necessary validation or processing before adding the book
  // ...

  // Return an action object to add the book to the books list in the Redux store
  return { type: ADD_BOOK, payload: book };
}

// New accessible form component for adding books
function AddBookForm({ onAdd }) {
  const formId = useId();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        id: UUID.generate()
      };
      onAdd(newBook);
      setTitle('');
      setAuthor('');
    }
  }, [onAdd, title, author]);

  const titleId = useId();
  const authorId = useId();

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Add new book form"
      id={formId}
    >
      <div>
        <label
          htmlFor={titleId}
          id={`${titleId}-label`}
        >
          Book Title:
        </label>
        <input
          type="text"
          id={titleId}
          aria-labelledby={`${titleId}-label`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter book title"
          aria-required="true"
        />
      </div>
      <div>
        <label
          htmlFor={authorId}
          id={`${authorId}-label`}
        >
          Author:
        </label>
        <input
          type="text"
          id={authorId}
          aria-labelledby={`${authorId}-label`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          placeholder="Enter author name"
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        aria-label="Add book to collection"
      >
        Add Book
      </button>
    </form>
  );
}

// Re-export required functions for testing and external use
export {
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  onTitleSort,
  onAuthorSort,
  defaultSorting,
  DependencyGraph,
  AddBookForm,
};

// Create the Main component
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
    <div role="main" aria-label="Book list and sorting controls">
      <div role="region" aria-label="Sorting controls">
        <button
          id="sort-by-title-button"
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title in ascending order"
          type="button"
        >
          Sort by Title
        </button>
        <button
          id="sort-by-author-button"
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author in descending order"
          type="button"
        >
          Sort by Author
        </button>
      </div>
      <List dataSource={bookItems} />
      <section role="region" aria-label="Add new book form">
        <AddBookForm onAdd={(book) => addBook(book)} />
      </section>
    </div>
  );
}

// Export the Main component
export default Main;