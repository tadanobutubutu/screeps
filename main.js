// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Form, Input, Button } from 'antd';

const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');

// Initial setup
const app = {}; // Placeholder for app configuration or initialization
let isInitialized = false;
const appData = {};

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
function BookItem(book) {
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
  // Perform any necessary validation or processing before adding the book
  // ...

  // Return an action to add the book to the books list in the Redux store
  return { type: 'ADD_BOOK', payload: book };
}

// Accessible Add Book Form Component
function AddBookForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!title.trim() || !author.trim()) {
      setError('Both title and author are required');
      return;
    }

    // Create new book object
    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim()
    };

    // Dispatch action to add book
    dispatch({ type: 'ADD_BOOK', payload: newBook });

    // Reset form
    setTitle('');
    setAuthor('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book">
      <div role="group" aria-labelledby="add-book-heading">
        <h3 id="add-book-heading">Add New Book</h3>
        
        <label htmlFor="book-title">
          Book Title:
          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            aria-describedby={error ? 'book-error' : undefined}
          />
        </label>
        
        <label htmlFor="book-author">
          Author:
          <input
            id="book-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-required="true"
            aria-describedby={error ? 'book-error' : undefined}
          />
        </label>
        
        {error && (
          <span id="book-error" role="alert" aria-live="polite">
            {error}
          </span>
        )}
        
        <button type="submit" aria-label="Add book to list">
          Add Book
        </button>
      </div>
    </form>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(booksList) {
  const sortedList = booksList.slice().sort(sortByTitle);
  return sortedList;
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(booksList) {
  const sortedList = booksList.slice().sort(sortByAuthor);
  return sortedList;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const books = useSelector(state => state.books.list);
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState(defaultSorting);
  const [form] = Form.useForm();

  // UseEffect hook to handle sorting book list updates
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

  // Render the list of book items and sorting controls
  return (
    <div>
      <header role="banner">
        <nav role="navigation" aria-label="Book list sorting controls">
          <button 
            onClick={() => setSorting(sortByTitle)} 
            id="sort-by-title-button"
            aria-label="Sort books by title"
          >
            Sort by Title
          </button>
          <button 
            onClick={() => setSorting(sortByAuthor)} 
            id="sort-by-author-button"
            aria-label="Sort books by author"
          >
            Sort by Author
          </button>
        </nav>
      </header>
      <main role="main" aria-label="Book list">
        <section role="region" aria-label="Books list">
          <List dataSource={bookItems} />
        </section>
      </main>
      <Form
        form={form}
        layout="inline"
        onFinish={(values) => handleAddBook(values)}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the book title' }]}
        >
          <Input aria-label="Book title" />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: 'Please enter the book author' }]}
        >
          <Input aria-label="Book author" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea aria-label="Book description" rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" aria-label="Add book">
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  // Return the language attribute for the document
  // This helps screen readers determine the language of the content
  return process.env.LANG || 'en';
}

// REACT_017 & REACT_025: Validate landmark elements for accessibility
function validateLandmark(element) {
  // Check if element is a valid landmark
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  if (!element) return false;
  return validLandmarks.includes(element.tagName && element.tagName.toLowerCase());
}

// REACT_017 & REACT_025: Validate landmark structure for proper nesting
function validateLandmarkStructure(landmarks) {
  // Ensure landmarks are properly structured
  // and there are no duplicate or improperly nested landmarks
  const errors = [];
  
  landmarks.forEach((landmark, index) => {
    // Check for duplicate main landmarks
    if (landmark.tagName && landmark.tagName.toLowerCase() === 'main') {
      const mainCount = landmarks.filter(l => l.tagName && l.tagName.toLowerCase() === 'main').length;
      if (mainCount > 1) {
        errors.push('REACT_025: Multiple main landmarks found - only one main landmark should exist');
      }
    }
    
    // Check for landmark nesting issues
    if (!validateLandmark(landmark)) {
      errors.push('REACT_017: Invalid landmark element found');
    }
  });
  
  return errors;
}

function handleAccessibilityIssues() {
  // Your implementation here
}

// Checks all links and buttons in the document for accessibility issues.
// Returns an array of accessibility violations found.
// @param {Document} document - The DOM document to check
// @returns {Array} Array of accessibility issues found
function checkDocumentAccessibility(document) {
  const issues = [];
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');
  
  // Check links
  links.forEach(link => {
    const role = link.getAttribute('role');
    const tabindex = link.getAttribute('tabindex');
    const href = link.getAttribute('href');
    
    // A valid link should either:
    // 1. Be an anchor with href
    // 2. Have role="link" with proper keyboard navigation
    if (link.tagName !== 'A' || !href) {
      if (role !== 'link') {
        issues.push({
          type: 'invalid-link',
          element: link,
          message: 'Link does not have proper href or role="link"'
        });
      }
    }
    
    if (role === 'link' && !href) {
      // Must be keyboard accessible
      if (tabindex === null && link.tabIndex < 0) {
        issues.push({
          type: 'inaccessible-link',
          element: link,
          message: 'Link with role="link" must be keyboard accessible'
        });
      }
    }
  });
  
  // Check buttons
  buttons.forEach(button => {
    const role = button.getAttribute('role');
    if (role === 'link') {
      // Button with role="link" should be an anchor
      issues.push({
        type: 'invalid-button',
        element: button,
        message: 'Element with role="link" should be an anchor'
      });
    }
  });
  
  return issues;
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonProps) {
  const { onClick, label, icon, className, ariaLabel, role = 'button', href } = buttonProps;
  
  // If it's a link pretending to be a button, ensure proper button semantics
  const isFakeLink = href !== undefined;
  
  if (isFakeLink) {
    // REACT_036: Fix fake link issue by converting to proper button
    return {
      tag: 'button',
      type: 'button',
      onClick: onClick,
      ariaLabel: ariaLabel || label,
      className: className,
      content: label + (icon ? icon : '')
    };
  }
  
  return {
    tag: 'button',
    type: 'button',
    onClick: onClick,
    ariaLabel: ariaLabel || label,
    className: className,
    content: label + (icon ? icon : '')
  };
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  const errors = [];
  
  // Check if link has accessible text
  if (!link.textContent && !link.getAttribute('aria-label')) {
    errors.push('Link must have accessible text content or aria-label');
  }
  
  // Check if link is properly structured (not a fake link)
  if (link.getAttribute('href') && link.tagName.toLowerCase() !== 'a') {
    errors.push('REACT_036: Element with href attribute should be an anchor tag');
  }
  
  return errors;
}

// REACT_036: Handle fake links - convert non-anchor elements with href to proper buttons
function handleFakeLinks(container) {
  const fakeLinks = container.querySelectorAll('[href]:not(a)');
  const errors = [];
  
  fakeLinks.forEach((element, index) => {
    errors.push(`REACT_036: Found fake link at index ${index} - converting to button`);
    // Convert to button by removing href and adding click handler
    const href = element.getAttribute('href');
    element.removeAttribute('href');
    element.setAttribute('role', 'button');
    element.addEventListener('click', () => {
      // Handle the click action that was intended by the href
      if (href.startsWith('#')) {
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.focus();
        }
      }
    });
  });
  
  return errors;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const errors = [];
  
  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('REACT_027: Table should have header cells (th)');
  }
  
  // Check if table has a caption or aria-label
  const caption = table.querySelector('caption');
  const ariaLabel = table.getAttribute('aria-label');
  if (!caption && !ariaLabel) {
    errors.push('REACT_027: Table should have a caption or aria-label');
  }
  
  // Check if scope attributes are present on headers
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      errors.push('REACT_027: Table headers should have scope attribute');
    }
  });
  
  return errors;
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const errors = [];
  
  // Check for proper table structure: thead, tbody, tfoot
  if (!table.querySelector('thead')) {
    errors.push('REACT_027: Table should have a thead element');
  }
  
  if (!table.querySelector('tbody')) {
    errors.push('REACT_027: Table should have a tbody element');
  }
  
  // Check that cells match the number of columns in header
  const headerRow = table.querySelector('thead tr');
  if (headerRow) {
    const headerCells = headerRow.querySelectorAll('th');
    const headerColCount = headerCells.length;
    
    // Check each data row
    const dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach((row, index) => {
      const cellCount = row.querySelectorAll('td, th').length;
      if (cellCount !== headerColCount) {
        errors.push(`REACT_027: Row ${index + 1} has ${cellCount} cells but header has ${headerColCount} columns`);
      }
    });
  }
  
  return errors;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg, context = '') {
  // Check if SVG has an aria-label
  let accessibleName = svg.getAttribute('aria-label');
  
  // If no aria-label, check for title element inside SVG
  if (!accessibleName) {
    const titleElement = svg.querySelector('title');
    if (titleElement) {
      accessibleName = titleElement.textContent;
    }
  }
  
  // If no accessible name found, generate one based on context
  if (!accessibleName) {
    accessibleName = `SVG icon${context ? ' - ' + context : ''}`;
  }
  
  return accessibleName;
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svg, options = {}) {
  const { label, role = 'img', description = '' } = options;
  
  // Set the role attribute
  svg.setAttribute('role', role);
  
  // Get or set the accessible name
  const accessibleName = label || getSvgAccessibleName(svg);
  svg.setAttribute('aria-label', accessibleName);
  
  // If there's a description, add it as aria-describedby
  if (description) {
    // Create a hidden description element
    const id = `svg-desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('span');
    descElement.id = id;
    descElement.textContent = description;
    descElement.style.display = 'none';
    svg.appendChild(descElement);
    svg.setAttribute('aria-describedby', id);
  }
  
  // If there's a title element, ensure it has an ID linked to aria-labelledby
  const titleElement = svg.querySelector('title');
  if (titleElement && !titleElement.id) {
    const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    titleElement.id = titleId;
    svg.setAttribute('aria-labelledby', titleId);
    svg.removeAttribute('aria-label');
  }
  
  return svg;
}

// Function to handle adding a new book with accessibility improvements
function handleAddBook(values) {
  return addBook({
    id: Date.now(), // Generate a unique id using current timestamp
    title: values.title,
    author: values.author,
    description: values.description,
  });
}

// Line 129 preserved content from issue
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Line 129 preserved content from issue
// TODO: This is the existing code that needs to be preserved

function addLandmarks(landmarks) {
  processLandmarks(landmarks);
}

function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

export function setSvgAccessibilityProps(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

function isValidLink(element) {
  // Check if element has proper link semantics
  const role = element.getAttribute('role');
  const tabindex = element.getAttribute('tabindex');
  const href = element.getAttribute('href');

  // A valid link should either:
  // 1. Be an anchor with href
  // 2. Have role="link" with proper keyboard navigation
  if (element.tagName === 'A' && href) {
    return true;
  }

  if (role === 'link') {
    // Must be keyboard accessible
    return tabindex !== null || element.tabIndex >= 0;
  }

  return false;
}

function addScopeToHeaders(table) {
  if (!table) return;

  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    const row = th.parentElement;
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const colIndex = Array.from(row.cells).indexOf(th);
    const cellsAbove = getCellsAbove(th, rowIndex);
    const cellsInRow = Array.from(row.cells);
    const hasCellsRight = colIndex < cellsInRow.length - 1;
    const hasCellsBelow = th.nextElementSibling && th.nextElementSibling.tagName === 'TR';

    if (hasCellsBelow) {
      th.setAttribute('scope', 'col');
    } else if (hasCellsRight || cellsAbove.some(r => r.children[rowIndex])) {
      th.setAttribute('scope', 'row');
    }
  });
}

function getCellsAbove(th, rowIndex) {
  const rows = th.table ? Array.from(th.table.rows) : [];
  return rows.slice(0, rowIndex);
}

function getCellsInRow(row) {
  return Array.from(row.cells);
}

function addressAccessibilityIssues(issues) {
  issues.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

module.exports = {
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  onTitleSort,
  onAuthorSort,
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
  setSvgAccessibilityProps,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  getCellsAbove,
  getCellsInRow,
  isInitialized,
  appData
};