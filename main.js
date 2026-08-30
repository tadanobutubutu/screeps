// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button } from 'antd';

// Input validation helper
function isValidBookInput(input) {
  // Perform input validation based on your accessibility insights
  // Example check for empty input
  if (!input.title || !input.author) {
    return false;
  }

  // TODO: Add more checks based on your accessibility insights

  return true;
}

// Action creator to add a book to the store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Return an action object to add the book to the books list in the Redux store
  return { type: 'ADD_BOOK', payload: book };
}

// Sorting comparators
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

const defaultSorting = sortByTitle;

// Generate a unique key for a book item
function generateKey(book) {
  return book.id ? `book-${book.id}` : `book-${book.title}-${book.author}`;
}

// Render a single book item
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

// Accessibility helper for the add book form
function addBookAccessibly() {
  const bookTitle = document.querySelector('#title');
  const bookAuthor = document.querySelector('#author');

  // Set focus to the book title input field
  if (bookTitle) {
    bookTitle.focus();
  }

  // Add a keyboard event listener to handle entering a new book
  document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Legacy keyboard-only accessibility handler
    }
  });
}

// Action creators for sorting
const onTitleSort = () => ({ type: 'SORT_BY_TITLE' });
const onAuthorSort = () => ({ type: 'SORT_BY_AUTHOR' });

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
      {/* Placeholder content */}
      {nodes && edges ? (
        <span>Graph with {nodes.length} nodes and {edges.length} edges</span>
      ) : (
        <span>No graph data</span>
      )}
    </div>
  );
}

// Form component for adding a new book
function AddBookForm() {
  const [book, setBook] = useState({ title: '', author: '' });
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValidBookInput(book)) {
      alert('Invalid input. Please check your entry and try again.');
      return;
    }

    dispatch(addBook(book));
    setBook({ title: '', author: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={book.title}
        onChange={(e) => setBook({ ...book, title: e.target.value })}
        required
      />
      <label htmlFor="author">Author:</label>
      <input
        type="text"
        id="author"
        value={book.author}
        onChange={(e) => setBook({ ...book, author: e.target.value })}
        required
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

// Main application component
function Main() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  // Set up accessibility features on mount
  useEffect(() => {
    addBookAccessibly();
  }, []);

  // Dispatch sorting action when sorting option changes
  useEffect(() => {
    if (sorting === sortByTitle) {
      dispatch(onTitleSort());
    } else if (sorting === sortByAuthor) {
      dispatch(onAuthorSort());
    }
  }, [sorting, dispatch]);

  // Derive sorted list based on current sorting function
  const sortedBooks = [...books].sort(sorting);

  // Map books to BookItem components
  const bookItems = sortedBooks.map((book) => BookItem(book));

  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <AddBookForm />
      <List dataSource={bookItems} renderItem={(item) => item} />
      <DependencyGraph nodes={[]} edges={[]} />
    </div>
  );
}

// Export the Main component
export default Main;