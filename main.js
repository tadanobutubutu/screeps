// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button, Form, Input, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';

// TODO: This is the existing code that needs to be preserved
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');

// Initial setup
const app = {}; // Placeholder for app configuration or initialization
let isInitialized = false;
const appData = {};

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
        description={`by ${book.author}`}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Return an action to add the book to the books list in the Redux store
  return { type: 'ADD_BOOK', payload: book };
}

// Accessible Add Book Form Component
function AddBookForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (!title.trim() || !author.trim()) {
      setError('Both title and author are required');
      return;
    }

    // Create new book object
    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim()
    };

    // Dispatch action to add book
    dispatch(addBook(newBook));

    // Reset form
    setTitle('');
    setAuthor('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book">
      <div role="group" aria-labelledby="add-book-heading">
        <h3 id="add-book-heading">Add New Book</h3>

        <label htmlFor="book-title">
          Book Title:
          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            aria-describedby={error ? 'book-error' : undefined}
          />
        </label>

        <label htmlFor="book-author">
          Author:
          <input
            id="book-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-required="true"
            aria-describedby={error ? 'book-error' : undefined}
          />
        </label>

        {error && (
          <span id="book-error" role="alert" aria-live="polite">
            {error}
          </span>
        )}

        <button type="submit" aria-label="Add book to list">
          Add Book
        </button>
      </div>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(booksList) {
  const sortedList = booksList.slice().sort(sortByTitle);
  return sortedList;
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(booksList) {
  const sortedList = booksList.slice().sort(sortByAuthor);
  return sortedList;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const books = useSelector(state => state.books.list);
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState(defaultSorting);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      const sortedList = [...books].sort(sortByTitle);
      dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
    } else if (sorting === sortByAuthor) {
      const sortedList = [...books].sort(sortByAuthor);
      dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
    }
  }, [sorting, books, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book, index) => (
    <BookItem key={generateKey(book)} {...book} />
  ));

  // Function to handle opening the add book form
  const showAddBookForm = () => {
    setAddBookFormVisible(true);
  };

  // Function to handle closing the add book form
  const handleAddBookFormCancel = () => {
    setAddBookFormVisible(false);
    addBookForm.resetFields();
  };

  // Render the list of book items and sorting controls
  return (
    <div>
      <AddBookForm />
      <button onClick={() => setSorting(sortByTitle)} aria-label="Sort books by title">
        Sort by Title
      </button>
      <button onClick={() => setSorting(sortByAuthor)} aria-label="Sort books by author">
        Sort by Author
      </button>
      <List>
        {bookItems}
      </List>
    </div>
  );
}

export default Main;