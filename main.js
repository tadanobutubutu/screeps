// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

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
  return book.title + book.author;
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

// Accessible form for adding books with improved accessibility
function AddBookForm({ addBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const newBook = { title: title.trim(), author: author.trim() };
    addBook(newBook);
    setTitle('');
    setAuthor('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book form" role="form">
      <div>
        <label htmlFor="book-title" id="book-title-label">
          Book Title <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-required="true"
          aria-labelledby="book-title-label"
          aria-describedby="book-title-desc"
        />
        <span id="book-title-desc" className="sr-only">
          Enter the title of the book
        </span>
      </div>
      
      <div>
        <label htmlFor="book-author" id="book-author-label">
          Author <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-required="true"
          aria-labelledby="book-author-label"
          aria-describedby="book-author-desc"
        />
        <span id="book-author-desc" className="sr-only">
          Enter the author of the book
        </span>
      </div>

      {error && (
        <div role="alert" aria-live="polite" className="error-message">
          {error}
        </div>
      )}

      <button 
        type="submit"
        aria-describedby="submit-desc"
      >
        Add Book
      </button>
      <span id="submit-desc" className="sr-only">
        Submit the form to add a new book to the list
      </span>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(sortedBooks) {
  const sortedList = [...sortedBooks].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  return sortedList;
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(sortedBooks) {
  const sortedList = [...sortedBooks].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  return sortedList;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      const sortedList = onTitleSort(books);
      dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
    } else if (sorting === sortByAuthor) {
      const sortedList = onAuthorSort(books);
      dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
    }
  }, [sorting, books, dispatch]);

  // Function to add a book to the Redux store
  const handleAddBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
  };

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book) => <BookItem key={generateKey(book)} {...book} />);

  // Render the list of book items and sorting controls
  return (
    <main>
      <button 
        onClick={() => setSorting(sortByTitle)}
        aria-label="Sort books by title"
      >
        Sort by Title
      </button>
      <button 
        onClick={() => setSorting(sortByAuthor)}
        aria-label="Sort books by author"
      >
        Sort by Author
      </button>
      <List itemCount={books.length} dataSource={books} renderItem={(item) => <BookItem {...item} />} />
      <AddBookForm addBook={handleAddBook} />
    </main>
  );
}

// Export the Main component
export default Main;