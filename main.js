// Import necessary dependencies
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button } from 'antd';

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

// TODO: Identify and update specific functions that render dependency graphs or mark as N/A if none exist in this file

// Function to render a single book item
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={`by ${book.author}`}
      />
    </List.Item>
  );
}

// Function to render the form for adding a new book entry
function BookForm() {
  const dispatch = useDispatch();

  // Define state for the form inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Handle input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary validation or processing before adding the book
    // ...

    // Dispatch an action to add the book to the books list in the Redux store
    dispatch({ type: 'ADD_BOOK', payload: { title, author } });
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={handleTitleChange}
        aria-label="Book title"
      />
      <label htmlFor="author">Author:</label>
      <input
        type="text"
        id="author"
        value={author}
        onChange={handleAuthorChange}
        aria-label="Book author"
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, list) {
  const sortedList = [...list].sort(sortByTitle);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, list) {
  const sortedList = [...list].sort(sortByAuthor);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Accessible Add Book Form component
function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    if (!author.trim()) {
      setError('Author is required');
      return;
    }

    onAddBook({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
    
    // Move focus to title input after successful submission for accessibility
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Move to author input on Enter key
      const form = formRef.current;
      if (form) {
        const authorInput = form.querySelector('#add-book-author');
        if (authorInput) {
          authorInput.focus();
        }
      }
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      aria-label="Add new book form"
      style={{ marginBottom: '16px' }}
    >
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="add-book-title" id="add-book-title-label">
          Book Title
        </label>
        <input
          id="add-book-title"
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
          aria-required="true"
          aria-labelledby="add-book-title-label"
          placeholder="Enter book title"
          style={{ marginLeft: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="add-book-author" id="add-book-author-label">
          Author
        </label>
        <input
          id="add-book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-required="true"
          aria-labelledby="add-book-author-label"
          placeholder="Enter author name"
          style={{ marginLeft: '8px' }}
        />
      </div>

      {error && (
        <div 
          role="alert" 
          aria-live="polite"
          style={{ color: 'red', marginBottom: '8px' }}
        >
          {error}
        </div>
      )}

      <button 
        type="submit"
        aria-describedby={error ? 'add-book-error' : undefined}
      >
        Add Book
      </button>
    </form>
  );
}

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books?.list || []);
  const [sorting, setSorting] = useState(defaultSorting);

  // Function to add a new book to the Redux store
  const handleAddBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
  };

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(dispatch, booksList);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(dispatch, booksList);
    }
  }, [sorting, dispatch, booksList]);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items, sorting controls, and the book form
  return (
    <div>
      <h2 id="add-book-heading">Add a New Book</h2>
      <AddBookForm onAddBook={handleAddBook} />
      
      <h2 id="books-list-heading">Books List</h2>
      <div role="group" aria-labelledby="books-list-heading">
        <button 
          onClick={() => setSorting(sortByTitle)}
          aria-pressed={sorting === sortByTitle}
        >
          Sort by Title
        </button>
        <button 
          onClick={() => setSorting(sortByAuthor)}
          aria-pressed={sorting === sortByAuthor}
        >
          Sort by Author
        </button>
      </div>
      
      <List 
        aria-label="Books collection"
        dataSource={bookItems}
      />
    </div>
  );
}

// Export the Main component and the BookForm component
export default Main;
export { BookForm };