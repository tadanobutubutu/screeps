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
  const [newBookTitle, setNewBookTitle] = useState('');

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Handle form submission for adding a new book with accessibility improvements
  const handleAddBookSubmit = (event) => {
    event.preventDefault();
    if (newBookTitle.trim()) {
      addBook({ title: newBookTitle.trim() });
      setNewBookTitle('');
    }
  };

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div lang="en">
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      <form onSubmit={handleAddBookSubmit} aria-label="Add new book form">
        <label htmlFor="new-book-input">New Book Title:</label>
        <input
          id="new-book-input"
          type="text"
          value={newBookTitle}
          onChange={(e) => setNewBookTitle(e.target.value)}
          placeholder="Enter book title"
          aria-required="true"
        />
        <button type="submit" aria-label="Add book">Add Book</button>
      </form>

      <div role="group" aria-label="Sort book list controls">
        <button onClick={() => setSorting(sortByTitle)} aria-pressed={sorting === sortByTitle}>
          Sort by Title
        </button>
        <button onClick={() => setSorting(sortByAuthor)} aria-pressed={sorting === sortByAuthor}>
          Sort by Author
        </button>
      </div>
      <List aria-label="Book list">{bookItems}</List>
    </div>
  );
}

// Export the Main component
export default Main;