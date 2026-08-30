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

// Function to get accessible SVG name (stub implementation)
function getSvgAccessibleName(svg) {
  return svg?.alt || 'Book cover';
}

// Function to create a new book entry in the Redux store
function addBook(book) {
  const svgAccessibleName = getSvgAccessibleName(book.coverSvg);
  const accessibleBook = {
    ...book,
    coverSvgAccessibleName: svgAccessibleName,
  };

  dispatch({ type: 'ADD_BOOK', payload: accessibleBook });
}

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
      {/* ... */}
    </div>
  );
}

// Function to render a form for adding a new book and to handle form submission
function AddBookForm() {
  const [book, setBook] = useState({ title: '', author: '' });
  const dispatch = useDispatch();
  const titleInputRef = React.useRef(null);
  const authorInputRef = React.useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addBook(book));
    setBook({ title: '', author: '' });
    titleInputRef.current.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.target === authorInputRef.current) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  React.useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          required
          ref={titleInputRef}
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          onKeyDown={handleKeyDown}
          required
          ref={authorInputRef}
        />
      </label>
      <Button type="primary" onClick={handleSubmit}>Add Book</Button>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list, sorting controls, and the AddBookForm
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  const bookItems = getBooksList.slice().sort(sorting).map(book => <BookItem {...book} />);

  return (
    <div>
      <Button onClick={() => setSorting(sortByTitle)}>Sort by Title</Button>
      <Button onClick={() => setSorting(sortByAuthor)}>Sort by Author</Button>
      <AddBookForm />
      <List dataSource={bookItems} />
      <DependencyGraph 
        nodes={[]} 
        edges={[]} 
      />
    </div>
  );
}

// Export the Main component
export default Main;