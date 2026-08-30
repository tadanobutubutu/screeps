// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { SetLangAttribute } from 'react/src/react'; // Adding missing dependency

// Function to get the language attribute value for accessibility
function getLangAttribute() {
  // Return the language code from the document's HTML element
  // This helps screen readers pronounce content correctly
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

// Function to ensure ARIA attributes are properly set for the dependency graph
function ensureDependencyGraphARIA() {
  const lang = getLangAttribute();

  // Set lang attribute on document root if not already set
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }

  // Ensure accessible property on document root for added books form
  const accessible = document.documentElement.accessible || false;
  return {
    lang: lang,
    accessible: !accessible
  };
}

// Function to handle sorting books by title (ascending)
export function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
export function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
export function generateKey(book) {
  return `book-${book.id || book.title.toLowerCase().replace(/\s+/g, '-')}`;
}

// Function to render a single book item
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta title={book.title} description={book.author} />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
export function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Ensure accessibility attributes are set before adding the book
  ensureDependencyGraphARIA();

  // Dispatch an action to add the book to the books list in the Redux store
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

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
export function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
export function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Accessibility Helper Functions
function getLangAttribute(element) {
  return element.getAttribute('lang') || document.documentElement.lang;
}

function validateLandmark(element) {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header', 'section'];
  return landmarks.includes(element.getAttribute('role'));
}

function validateLandmarkStructure(container) {
  const landmarks = container.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    if (!validateLandmark(landmark)) {
      console.warn('Invalid landmark role:', landmark.getAttribute('role'));
    }
  });
}

function checkDocumentAccessibility(document) {
  validateLandmarkStructure(document);
  // Additional accessibility checks
}

function createInPageButton(container, text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  container.appendChild(button);
  return button;
}

function validateLinkAccessibility(link) {
  const ariaLabel = link.getAttribute('aria-label');
  const textContent = link.textContent.trim();
  return !!(ariaLabel || textContent);
}

function handleFakeLinks(container) {
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (!validateLinkAccessibility(link)) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

function validateTableAccessibility(table) {
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(container) {
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table)) {
      console.warn('Table missing proper headers');
    }
  });
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'SVG element';
}

function setSvgAttributes(svg, accessibleName) {
  svg.setAttribute('aria-label', accessibleName);
}

function handleAddBook(book) {
  // Add book with accessibility considerations
  addBook(book);
}

function addLandmarks(container) {
  const mainContent = container.querySelector('#main-content');
  if (!mainContent) {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');
    container.appendChild(main);
  }
}

function getUniqueLandmarkName(element) {
  const role = element.getAttribute('role');
  const id = element.id || `${role}-${Math.random().toString(36).substr(2, 9)}`;
  return id;
}

function isValidLink(element) {
  return element.tagName === 'A' && element.getAttribute('href');
}

function addScopeToHeaders(container) {
  const headers = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

function addressAccessibilityIssues(container) {
  validateLandmarkStructure(container);
  handleFakeLinks(container);
  validateTableStructure(container);
  addScopeToHeaders(container);
}

function getCellsAbove(cell) {
  const table = cell.closest('table');
  if (!table) return [];
  const row = cell.closest('tr');
  const headerRows = table.querySelectorAll('tr');
  const cellIndex = Array.from(row.children).indexOf(cell);
  const cellsAbove = [];
  headerRows.forEach(headerRow => {
    if (headerRow !== row) {
      cellsAbove.push(headerRow.children[cellIndex]);
    }
  });
  return cellsAbove;
}

function getCellsInRow(row) {
  return Array.from(row.children);
}

// Export the necessary functions for use in other modules
export { 
  sortByTitle, 
  sortByAuthor, 
  generateKey, 
  BookItem, 
  addBook, 
  onTitleSort, 
  onAuthorSort, 
  defaultSorting, 
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  checkDocumentAccessibility,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  handleAddBook,
  addLandmarks,
  getUniqueLandmarkName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  getCellsAbove,
  getCellsInRow
};

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const getBooksList = useSelector(state => state.books.list);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }

    // Apply accessibility improvements on component mount
    const container = document.getElementById('main-content');
    if (container) {
      // Apply accessibility fixes
      addressAccessibilityIssues(container);
      handleFakeLinks(container);
      // Apply SVG accessibility
      const svgs = container.querySelectorAll('svg');
      svgs.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
      });
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
    <div id="main-content" role="main">
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
        dataSource={bookItems}
        renderItem={(book) => BookItem(book)}
        aria-label="Book list"
      />
      <form onSubmit={handleAddBook} aria-describedby={formError ? 'add-book-error' : undefined}>
        <fieldset>
          <legend>Add a New Book</legend>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Book
          </button>
        </fieldset>
        {formError && <p id="add-book-error" role="alert">{formError}</p>}
      </form>
    </div>
  );
}

// Export the Main component
export default Main;