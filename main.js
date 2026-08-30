// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

// ... Existing code

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
  return book.id;
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

// Function to create a new book entry in the Redux store (improved accessibility)
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Function to improve accessibility for the addBook function or form
function addBookAccessibly() {
  const bookInput = document.querySelector('#bookInput');
  const bookTitle = document.querySelector('#bookTitle');
  const bookAuthor = document.querySelector('#bookAuthor');

  // Set focus to the book title input field
  bookTitle.focus();

  // Add a keyboard event listener to handle entering a new book
  document.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addBook({
        id: Date.now(),
        title: bookTitle.value,
        author: bookAuthor.value,
      });

      // Reset the input fields after adding a book
      bookTitle.value = '';
      bookAuthor.value = '';
    }
  });
}

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = [...useSelector(state => state.books)].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = [...useSelector(state => state.books)].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Function A - utility function for book validation
function functionA(book) {
  // Validate book data before processing
  if (!book.title || !book.author) {
    return false;
  }
  return true;
}

// Function B - utility function for formatting book data
function functionB(book) {
  // Format book data for display
  return {
    ...book,
    title: book.title.trim(),
    author: book.author.trim()
  };
}

// Render the main component containing the book list, sorting controls, and an accessible add book form
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const dispatch = useDispatch();
  const books = useSelector(state => state.books);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting, dispatch]);

  // Add event listener for adding a new book accessible
  useEffect(() => {
    addBookAccessibly();
  }, []);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map(book => <BookItem key={book.id} {...book} />);

  // Render the list of book items and sorting controls
  return (
    <div id="bookInput">
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <input id="bookTitle" type="text" placeholder="Title" />
      <input id="bookAuthor" type="text" placeholder="Author" />
      <List dataSource={books} renderItem={book => (
        <List.Item key={book.id}>
          <List.Item.Meta title={book.title} description={book.author} />
        </List.Item>
      )} />
    </div>
  );
}

// Export the Main component
export default Main;

// Export functionA and functionB
export { functionA, functionB };