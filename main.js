// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Input, Button, Form } from 'antd';

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
function BookItem(book) {
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

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');

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

  // Handler for adding a new book with accessibility support
  const handleAddBook = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      return;
    }
    
    addBook({ title: newBookTitle, author: newBookAuthor });
    setNewBookTitle('');
    setNewBookAuthor('');
  };

  // Render the list of book items and sorting controls
  return (
    <div>
      <h2 id="book-list-heading">Book List</h2>
      <div role="group" aria-labelledby="sort-controls-label">
        <span id="sort-controls-label" className="sr-only">Sorting Controls</span>
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
      </div>
      
      {/* Accessible form for adding a new book */}
      <section aria-labelledby="add-book-heading">
        <h3 id="add-book-heading">Add New Book</h3>
        <Form onSubmit={handleAddBook} aria-label="Add a new book to the list">
          <div>
            <label htmlFor="book-title" id="book-title-label">
              Book Title
            </label>
            <Input
              id="book-title"
              type="text"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              placeholder="Enter book title"
              aria-required="true"
              aria-describedby="book-title-label"
            />
          </div>
          <div>
            <label htmlFor="book-author" id="book-author-label">
              Author
            </label>
            <Input
              id="book-author"
              type="text"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              placeholder="Enter author name"
              aria-required="true"
              aria-describedby="book-author-label"
            />
          </div>
          <Button 
            type="primary" 
            htmlType="submit"
            aria-label="Add book to list"
          >
            Add Book
          </Button>
        </Form>
      </section>
      
      <List 
        ... 
        aria-labelledby="book-list-heading"
      />
    </div>
  );
}

// Export the Main component
export default Main;