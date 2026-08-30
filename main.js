// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

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
  return book.id || book.title + book.author;
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

// Accessibility Helper Functions

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [formError, setFormError] = useState('');

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Handle form submission for adding a new book
  const handleAddBook = (event) => {
    event.preventDefault();
    setFormError('');

    if (!newBookTitle.trim()) {
      setFormError('Book title is required');
      return;
    }

    if (!newBookAuthor.trim()) {
      setFormError('Book author is required');
      return;
    }

    addBook({ title: newBookTitle.trim(), author: newBookAuthor.trim() });
    setNewBookTitle('');
    setNewBookAuthor('');
  };

  const bookItems = getBooksList.map((book) => <BookItem key={generateKey(book)} book={book} />);

  // Render the list of book items and sorting controls
  return (
    <div id="main-content" role="main">
      <nav aria-label="Sorting controls">
        <button
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title"
        >
          Sort by Title
        </button>
        <button
          id="sort-by-author"
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author"
        >
          Sort by Author
        </button>
      </nav>
      <List
        itemLayout="vertical"
        dataSource={bookItems}
        renderItem={(book) => <BookItem book={book} />}
        aria-label="Book list"
      />
      <form onSubmit={handleAddBook} aria-describedby={formError ? 'add-book-error' : undefined}>
        <fieldset>
          <legend>Add a New Book</legend>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Book
          </button>
        </fieldset>
        {formError && <p id="add-book-error" role="alert">{formError}</p>}
      </form>
    </div>
  );
}

// Export the necessary functions for use in other modules
export { sortByTitle, sortByAuthor, generateKey, BookItem, addBook };
// Export the Main component
export default Main;