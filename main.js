// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Import dependency graph and index content from appropriate modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

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
  return book.id || `${book.title}-${book.author}`;
}

// Accessibility helper function to get language attribute
function getLangAttribute(lang) {
  return lang ? { lang } : { lang: 'en' };
}

// Accessibility helper function to create in-page button with proper accessibility
function createInPageButton(label, onClick, icon) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      {icon && (
        <span aria-hidden="true">{icon}</span>
      )}
      <span>{label}</span>
    </button>
  );
}

// Accessibility helper function to validate link accessibility
function validateLinkAccessibility(element) {
  const issues = [];
  
  // Check if link has accessible text
  if (!element.textContent && !element.getAttribute('aria-label')) {
    issues.push('Link missing accessible text');
  }
  
  // Check for fake links (links without href or with href="#")
  const href = element.getAttribute('href');
  if (!href || href === '#') {
    issues.push('Fake link detected - needs proper href or should be a button');
  }
  
  return issues;
}

// Accessibility helper function to handle fake links
function handleFakeLinks(element) {
  const issues = validateLinkAccessibility(element);
  
  if (issues.length > 0) {
    // Convert fake link to button if it doesn't navigate
    if (!element.getAttribute('href') || element.getAttribute('href') === '#') {
      element.setAttribute('role', 'button');
      element.removeAttribute('href');
    }
  }
  
  return issues;
}

// Accessibility helper function to validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table missing caption');
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
      issues.push('TH element missing scope or headers attribute');
    }
  });
  
  return issues;
}

// Accessibility helper function to validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  // Check for proper table structure (thead, tbody, tfoot)
  if (!table.querySelector('thead')) {
    issues.push('Table missing thead');
  }
  if (!table.querySelector('tbody')) {
    issues.push('Table missing tbody');
  }
  
  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${index} has no cells`);
    }
  });
  
  return issues;
}

// Accessibility helper function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
  let label = svgElement.getAttribute('aria-label');
  
  // Check for aria-labelledby
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      label = labelElement.textContent;
    }
  }
  
  // Check for title element inside SVG
  if (!label) {
    const title = svgElement.querySelector('title');
    if (title) {
      label = title.textContent;
    }
  }
  
  return label || '';
}

// Accessibility helper function to set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
  // Ensure SVG has role="img"
  svgElement.setAttribute('role', 'img');
  
  // Set aria-label if not already set
  const existingLabel = svgElement.getAttribute('aria-label');
  const existingLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!existingLabel && !existingLabelledBy && accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  
  // Add title element if missing
  const existingTitle = svgElement.querySelector('title');
  if (!existingTitle && accessibleName) {
    const title = document.createElement('title');
    title.textContent = accessibleName;
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

// Accessibility helper function to ensure unique landmarks
function ensureUniqueLandmarks(container) {
  const landmarks = {};
  const issues = [];
  
  // Find all landmark elements
  const banner = container.querySelector('header');
  const navigation = container.querySelectorAll('nav');
  const main = container.querySelector('main');
  const contentinfo = container.querySelector('footer');
  const complementary = container.querySelectorAll('[role="complementary"]');
  const search = container.querySelectorAll('[role="search"]');
  
  // Check for duplicate landmarks
  if (banner) landmarks.banner = banner;
  if (main) landmarks.main = main;
  if (contentinfo) landmarks.contentinfo = contentinfo;
  
  if (complementary.length > 1) {
    issues.push(`Found ${complementary.length} complementary landmarks, should have at most 1`);
  }
  
  if (search.length > 1) {
    issues.push(`Found ${search.length} search landmarks, should have at most 1`);
  }
  
  return { landmarks, issues };
}

// Accessibility helper function to add proper landmark regions
function addProperLandmarkRegions(container) {
  // Check for main landmark
  let main = container.querySelector('main');
  if (!main) {
    main = container.querySelector('[role="main"]');
  }
  if (!main) {
    // If no main found, wrap content appropriately
    main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    // Content would need to be moved into main here
  }
  
  // Ensure unique IDs for landmarks
  const landmarks = container.querySelectorAll('nav, main, footer, [role]');
  const usedIds = new Set();
  
  landmarks.forEach(landmark => {
    const existingId = landmark.id;
    if (existingId) {
      usedIds.add(existingId);
    }
  });
  
  return { main, usedIds };
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

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Accessibility helper function to manage focus for new content
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Function to handle form submission with accessibility improvements
function handleAddBookSubmit(event, dispatch, setIsAddingBook) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const newBook = {
    title: formData.get('title'),
    author: formData.get('author'),
    id: Date.now().toString()
  };
  
  // Validate the book data
  if (!newBook.title || !newBook.author) {
    // Announce validation error to screen readers
    announceToScreenReader('Error: Please fill in all required fields');
    return;
  }
  
  // Dispatch the action to add the book
  dispatch({ type: 'ADD_BOOK', payload: newBook });
  
  // Reset the form
  form.reset();
  setIsAddingBook(false);
  
  // Announce success to screen readers
  announceToScreenReader(`Book "${newBook.title}" has been added successfully`);
}

// Function to render add book form with accessibility
function AddBookForm({ onSubmit, onCancel }) {
  return (
    <form 
      onSubmit={onSubmit}
      aria-labelledby="add-book-heading"
    >
      <h2 id="add-book-heading">Add New Book</h2>
      <div>
        <label htmlFor="book-title">Book Title (required):</label>
        <input
          type="text"
          id="book-title"
          name="title"
          required
          aria-required="true"
          aria-describedby="title-help"
        />
        <span id="title-help" className="sr-only">
          Enter the title of the book you want to add
        </span>
      </div>
      <div>
        <label htmlFor="book-author">Author (required):</label>
        <input
          type="text"
          id="book-author"
          name="author"
          required
          aria-required="true"
          aria-describedby="author-help"
        />
        <span id="author-help" className="sr-only">
          Enter the author's name of the book
        </span>
      </div>
      <div>
        <button type="submit">Add Book</button>
        <button type="button" onClick={onCancel} aria-label="Cancel adding book">
          Cancel
        </button>
      </div>
    </form>
  );
}

// Function to render the dependency graph view
function renderDependencyGraph() {
  return dependencyGraphContent;
}

// Function to render the index view
function renderIndexView() {
  return indexContent;
}

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
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);
  const [view, setView] = useState('books');
  const [isAddingBook, setIsAddingBook] = useState(false