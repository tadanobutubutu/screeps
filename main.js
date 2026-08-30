// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

// TODO: Implement function for addressing accessibility issues from insight report
// Add a helper function to parse input and validate
function isValidBookInput(input) {
  // Perform input validation based on your accessibility insights
  // Example check for empty input
  if (!input.title || !input.author) {
    return false;
  }

  // TODO: Add more checks based on your accessibility insights

  return true;
}

// Function to create a new book entry in the Redux store (improved accessibility)
function addBook(dispatch, book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Add a function to handle form submission
function handleFormSubmit(event, dispatch, setFormValues) {
  event.preventDefault();

  // Get user input from form fields
  const form = event.target;
  const title = form.title.value;
  const author = form.author.value;

  // Validate user input
  if (!isValidBookInput({ title, author })) {
    // Show an error message or alert for invalid input
    alert('Invalid input. Please check your entry and try again.');
    return;
  }

  // Create a new book object with user input
  const newBook = { id: Date.now(), title, author };

  // Add the new book to the Redux store
  addBook(dispatch, newBook);

  // Clear the form fields
  setFormValues({ title: '', author: '' });
}

// Function to improve accessibility for the addBook function or form
function addBookAccessibly() {
  const bookTitle = document.querySelector('#bookTitle');
  const bookAuthor = document.querySelector('#bookAuthor');

  // Set focus to the book title input field
  if (bookTitle) {
    bookTitle.focus();
  }

  // Add a keyboard event listener to handle entering a new book
  document.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // This handler is for legacy keyboard-only accessibility
      // The preferred method is using the form with onSubmit
    }
  });
}

// Modify the Main component to include a new form for adding books
function Main() {
  // ... (Preserve existing Main component code)

  // Add a new state variable for form initial values
  const [formValues, setFormValues] = useState({ title: '', author: '' });

  // Add dispatch for Redux actions
  const dispatch = useDispatch();

  // Render the form for adding new books
  return (
    <div>
      {/* ... (Preserve existing sorting buttons code) */}

      {/* Add a new form for adding books */}
      <form onSubmit={(e) => handleFormSubmit(e, dispatch, setFormValues)}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formValues.title} onChange={event => setFormValues({ ...formValues, title: event.target.value })} />

        <label htmlFor="author">Author:</label>
        <input type="text" id="author" name="author" value={formValues.author} onChange={event => setFormValues({ ...formValues, author: event.target.value })} />

        <button type="submit">Add Book</button>
      </form>

      {/* ... (Preserve any additional existing code) */}
    </div>
  );

  // Add event listener for adding a new book accessible
  useEffect(() => {
    addBookAccessibly();
  }, []);
}

// Export the Main component
export default Main;