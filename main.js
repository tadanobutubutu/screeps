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

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// ...

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

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map((book) => <BookItem key={generateKey(book)} book={book} />);

  // Render the list of book items and sorting controls
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
        <form onSubmit={handleAddBook} aria-describedby={formError ? 'add-book-error' : undefined}>
          <div>
            <label htmlFor="book-title">Book Title:</label>
            <input
              id="book-title"
              type="text"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              aria-required="true"
              aria-invalid={formError && !newBookTitle.trim() ? 'true' : 'false'}
            />
          </div>
          <div>
            <label htmlFor="book-author">Book Author:</label>
            <input
              id="book-author"
              type="text"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              aria-required="true"
              aria-invalid={formError && !newBookAuthor.trim() ? 'true' : 'false'}
            />
          </div>
          {formError && (
            <div id="add-book-error" role="alert" aria-live="polite">
              {formError}
            </div>
          )}
          <button type="submit">Add Book</button>
        </form>
      </section>
      
      <section aria-labelledby="book-list-heading">
        <h2 id="book-list-heading">Book List</h2>
        <List dataSource={bookItems} />
      </section>
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
    </div>
  );
}

// Export the Main component
export default Main;