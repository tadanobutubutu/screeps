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
  return `${book.id}-${book.title}-${book.author}`;
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

// TODO: This is the existing code that needs to be preserved
// ----- END ORIGINAL CODE -----

// Accessible form component for adding new books
function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title.trim() || !author.trim()) {
      setError('Both title and author are required');
      return;
    }

    const newBook = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim()
    };

    addBook(newBook);
    setTitle('');
    setAuthor('');
    setSuccessMessage('Book added successfully!');

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book form">
      <div>
        <label htmlFor="book-title" id="book-title-label">
          Book Title:
        </label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby="book-title-label"
          aria-required="true"
          placeholder="Enter book title"
        />
      </div>

      <div>
        <label htmlFor="book-author" id="book-author-label">
          Author:
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-describedby="book-author-label"
          aria-required="true"
          placeholder="Enter author name"
        />
      </div>

      {error && (
        <div role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {successMessage && (
        <div role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

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
  const sortedList = [...getBooksList].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = [...getBooksList].sort(sortByAuthor);
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
  const bookItems = getBooksList.map(BookItem);

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List dataSource={bookItems} />
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;