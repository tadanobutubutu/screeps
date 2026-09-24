// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Function to count dependencies
function countDependencies() {
  const dependencies = [
    'react',
    'react-redux',
    'antd'
  ];
  return dependencies.length;
}

// ------------------------------------------------------------
// Helper functions (required by the issue)
// ------------------------------------------------------------

/**
 * Adds a <html> lang attribute based on a meta tag or defaults to "en".
 */
function getLangAttribute(element) {
  const lang = document.querySelector('meta[name="lang"]')?.getAttribute('content') ||
               'en';
  return `<html lang="${lang}">`;
}

/**
 * Creates an in‑page button element with the supplied children.
 */
function createInPageButton(children) {
  const btn = document.createElement('button');
  btn.textContent = children;
  btn.className = 'in-page-button';
  return btn;
}

/**
 * Validates a table for basic accessibility (headers, row labels, etc.).
 * Returns true if the table passes the check.
 */
function validateTableAccessibility(table) {
  // Placeholder implementation – real logic would inspect the DOM tree.
  return true;
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)} role="listitem">
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

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map((book) => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List ... />
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
    </div>
  );
}

// Export the Main component
export default Main;