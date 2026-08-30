// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Input, Form } from 'antd';
import { sortByTitle, sortByAuthor } from './sortingFunctions';

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
      onTitleSort(books);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(books);
    }
  }, [sorting, books, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book, index) => (
    <BookItem key={generateKey(book)} {...book} />
  ));

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