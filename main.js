// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Get the dispatch function from Redux
const dispatch = useDispatch();

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
  if (!book || !book.title || !book.author) {
    return;
  }

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Implement the required changes to improve accessibility for the addBook function or form
function AddBookForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() && author.trim()) {
      addBook({ title: title.trim(), author: author.trim() });
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book form">
      <label htmlFor="book-title">Book Title:</label>
      <input
        id="book-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter book title"
        aria-required="true"
      />
      <label htmlFor="book-author">Author:</label>
      <input
        id="book-author"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Enter author name"
        aria-required="true"
      />
      <button type="submit" aria-label="Add book">Add Book</button>
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
  const books = useSelector(state => state.books?.list || []);
  const dispatch = useDispatch();

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map(book => <BookItem key={generateKey(book)} book={book} />);

  // Render the list of book items and sorting controls
  return (
    <div>
      <AddBookForm />
      <button onClick={() => setSorting(sortByTitle)} aria-label="Sort by title">Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)} aria-label="Sort by author">Sort by Author</button>
      <List>
        {bookItems}
      </List>
      {/* Implement the required changes to improve accessibility for adding a new book */}
      {/* Accessibility improvements added via AddBookForm component */}
    </div>
  );
}

// Export the Main component
export default Main;