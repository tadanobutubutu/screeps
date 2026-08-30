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
function BookItem({ book }) {
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

// Function to handle form submission for adding a new book
function handleAddBookSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const newBook = {
    title: formData.get('bookTitle'),
    author: formData.get('bookAuthor')
  };
  addBook(newBook);
  event.currentTarget.reset();
}

// Render the accessible form for adding a new book
function AddBookForm() {
  return (
    <form onSubmit={handleAddBookSubmit} aria-label="Add new book form">
      <div>
        <label htmlFor="bookTitle" id="bookTitle-label">Book Title:</label>
        <input
          type="text"
          id="bookTitle"
          name="bookTitle"
          aria-labelledby="bookTitle-label"
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="bookAuthor" id="bookAuthor-label">Book Author:</label>
        <input
          type="text"
          id="bookAuthor"
          name="bookAuthor"
          aria-labelledby="bookAuthor-label"
          required
          aria-required="true"
        />
      </div>
      <button type="submit" aria-label="Add book to list">Add Book</button>
    </form>
  );
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
      <button onClick={() => setSorting(sortByTitle)} aria-label="Sort books by title">Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)} aria-label="Sort books by author">Sort by Author</button>
      <List ... />
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;