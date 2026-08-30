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
  return ...
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        ...
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

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// ...

// Accessible form component for adding new books
function AddBookForm() {
  const dispatch = useDispatch();
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newBook.title.trim() && newBook.author.trim()) {
      dispatch({ type: 'ADD_BOOK', payload: { ...newBook } });
      setNewBook({ title: '', author: '' });
    }
  };

  const handleTitleChange = (event) => {
    setNewBook({ ...newBook, title: event.target.value });
  };

  const handleAuthorChange = (event) => {
    setNewBook({ ...newBook, author: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book">
      <div>
        <label htmlFor="book-title">Book Title:</label>
        <input
          id="book-title"
          type="text"
          value={newBook.title}
          onChange={handleTitleChange}
          placeholder="Enter book title"
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="book-author">Author:</label>
        <input
          id="book-author"
          type="text"
          value={newBook.author}
          onChange={handleAuthorChange}
          placeholder="Enter author name"
          aria-required="true"
        />
      </div>
      <button type="submit" aria-label="Add book to list">
        Add Book
      </button>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = ...
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = ...
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
  const bookItems = ...

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List ... />
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;