// TODO: This is the existing code that needs to be preserved
// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';
import { Button } from 'antd';

const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');

const app = {}; // Placeholder for app configuration or initialization
let isInitialized = false;
const appData = {};

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

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

// Function to create a new book entry in the Redux store
function addBook(book) {
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Handle form submission for adding a new book
function handleAddBook(newBook) {
  addBook(newBook);
}

// Function for generating a report based on accessibility issues
function generateAccessibilityReport(issues) {
  if (!issues || issues.length === 0) {
    return 'No accessibility issues found.';
  }

  const totalIssues = issues.length;
  const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
  const majorIssues = issues.filter(issue => issue.severity === 'major').length;
  const minorIssues = issues.filter(issue => issue.severity === 'minor').length;

  let report = `Accessibility Report\n`;
  report += `===================\n`;
  report += `Total Issues: ${totalIssues}\n`;
  report += `Critical: ${criticalIssues}\n`;
  report += `Major: ${majorIssues}\n`;
  report += `Minor: ${minorIssues}\n\n`;

  report += `Issue Details:\n`;
  issues.forEach((issue, index) => {
    report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.description}`;
    if (issue.element) {
      report += ` - Element: ${issue.element}`;
    }
    if (issue.suggestion) {
      report += ` - Suggestion: ${issue.suggestion}`;
    }
    report += `\n`;
  });

  return report;
}

const defaultSorting = sortByTitle;

function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

export { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, handleAddBook, generateAccessibilityReport };

// Render the main component containing the book list and sorting controls
function Main() {
  const books = useSelector(state => state.books.list);
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState(defaultSorting);

  useEffect(() => {
    if (sorting === sortByTitle) {
      const sortedList = [...books].sort(sortByTitle);
      dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
    } else if (sorting === sortByAuthor) {
      const sortedList = [...books].sort(sortByAuthor);
      dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
    }
  }, [sorting, books, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book, index) => (
    <BookItem key={generateKey(book)} {...book} />
  ));

  // Apply accessibility improvements on component mount
  const container = document.getElementById('main-content');
  if (container) {
    // Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

    // Functions to improve accessibility (implementation assumed elsewhere)
    fixLandmarkIssues(container);
    fixFakeLinkIssues(container);
    fixButtonIdentifiers(container);

    // Apply SVG accessibility
    addAccessibleNamesToSVGs(container, 'Graphical element');

    // Ensure dependency graph has proper ARIA role
    ensureDependencyGraphAriaRole(container);
  }

  // Render the list of book items and sorting controls
  return (
    <div id="main-content" role="main" aria-label="Main content">
      <nav aria-label="Sorting controls">
        <button
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title"
          id="sort-by-title-btn"
        >
          Sort by Title
        </button>
        <button
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author"
          id="sort-by-author-btn"
        >
          Sort by Author
        </button>
      </nav>
      <List
        itemLayout="vertical"
        dataSource={getBooksList}
        renderItem={book => BookItem(book)}
        aria-label="Book list"
      />
      <AddBookForm onSubmit={handleAddBook} />
    </div>
  );
}

export default Main;