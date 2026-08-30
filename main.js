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
    
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
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

// Function to render the form for adding a new book entry
function BookForm() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_BOOK', payload: { title, author } });
  };

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

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books?.list || []);
  const [sorting, setSorting] = useState(defaultSorting);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
  };

  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(dispatch, booksList);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(dispatch, booksList);
    }
  }, [sorting, dispatch, booksList]);

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

    dispatch({ type: 'ADD_BOOK', payload: { title: newBookTitle.trim(), author: newBookAuthor.trim() } });
    setNewBookTitle('');
    setNewBookAuthor('');
  };

  const bookItems = booksList.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  return (
    <div>
      <section aria-labelledby="sorting-heading">
        <h2 id="sorting-heading" className="sr-only">Sort Options</h2>
        <button 
          onClick={() => setSorting(sortByTitle)} 
          aria-pressed={sorting === sortByTitle}
          aria-label="Sort books by title in ascending order"
        >
          Sort by Title
        </button>
        <button 
          onClick={() => setSorting(sortByAuthor)} 
          aria-pressed={sorting === sortByAuthor}
          aria-label="Sort books by author in descending order"
        >
          Sort by Author
        </button>
      </section>
      
      <section aria-labelledby="add-book-heading">
        <h2 id="add-book-heading">Add a New Book</h2>
        <AddBookForm onAddBook={handleAddBook} />
      </section>
      
      <section aria-labelledby="book-list-heading">
        <h2 id="book-list-heading">Book List</h2>
        <List 
          aria-label="Books collection"
          dataSource={bookItems}
        />
      </section>
    </div>
  );
}

// Export the Main component and the BookForm component
export default Main;
export { BookForm };