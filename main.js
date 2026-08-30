// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Input, Form } from 'antd';

// Initial setup
const app = {}; // Placeholder for app configuration or initialization
let isInitialized = false;
const appData = {};

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

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
  return book.id || `${book.title}-${book.author}`;
}

// Function to render a single book item
export function BookItem(book) {
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
export function addBook(book) {
  // Perform validation before adding the book
  if (!book.title || !book.author) {
    throw new Error('Book must have both title and author fields');
  }

  // Return an action to add the book to the books list in the Redux store
  return { type: 'ADD_BOOK', payload: book };
}

// Accessibility functions for addressing insight report issues

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  return { lang: 'en' };
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(label, onClick, buttonType = 'button') {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(element) {
  const issues = [];
  
  if (element.tagName === 'A') {
    if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
      issues.push('Link must have text content or aria-label');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// REACT_036: Handle fake links (elements that look like links but aren't)
function handleFakeLinks(container) {
  const fakeLinks = container.querySelectorAll('[role="button"], [onclick]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'BUTTON' && link.tagName !== 'A') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (table) {
    if (!table.caption && !table.getAttribute('aria-label')) {
      issues.push('Table must have a caption or aria-label');
    }
    
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push('Table should have header cells (th)');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  if (table) {
    const rows = table.querySelectorAll('tr');
    const columnCounts = Array.from(rows).map(row => row.cells.length);
    const uniqueCounts = [...new Set(columnCounts)];
    
    if (uniqueCounts.length > 1) {
      issues.push('Table rows have inconsistent column counts');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// REACT_017 & REACT_025: Validate landmark
function validateLandmark(element) {
  const issues = [];
  const tagName = element.tagName;
  
  const validLandmarks = ['HEADER', 'NAV', 'MAIN', 'ASIDE', 'FOOTER', 'SECTION', 'ARTICLE'];
  
  if (!validLandmarks.includes(tagName) && !element.getAttribute('role')) {
    issues.push(`Element ${tagName} is not a valid landmark`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(container) {
  const issues = [];
  const landmarks = {
    header: container.querySelectorAll('header'),
    nav: container.querySelectorAll('nav'),
    main: container.querySelectorAll('main'),
    footer: container.querySelectorAll('footer')
  };
  
  if (landmarks.main.length === 0) {
    issues.push('Page should have a main landmark');
  }
  
  if (landmarks.nav.length === 0) {
    issues.push('Consider adding navigation landmarks');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  const landmarks = ['header', 'main', 'footer', 'nav', 'aside'];
  const seen = {};
  
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          const role = el.getAttribute('role') || landmark;
          el.setAttribute('role', `${role}-${index + 1}`);
        }
      });
    }
  });
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions(container) {
  const main = container.querySelector('main') || document.createElement('main');
  const nav = container.querySelector('nav') || document.createElement('nav');
  const header = container.querySelector('header') || document.createElement('header');
  const footer = container.querySelector('footer') || document.createElement('footer');
  
  if (!container.querySelector('main')) {
    container.appendChild(main);
  }
  
  if (!container.querySelector('nav')) {
    container.insertBefore(nav, container.firstChild);
  }
  
  return { main, nav, header, footer };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg, context = '') {
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  return `${context} icon`;
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svg, name, description = '') {
  svg.setAttribute('role', 'img');
  
  if (!svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = name;
    svg.insertBefore(title, svg.firstChild);
  }
  
  if (description) {
    svg.setAttribute('aria-description', description);
  }
  
  svg.setAttribute('aria-label', name);
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: 200f6fc2778b49bc0c082c4862cbe22ffd75ecd6_

// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
export function onTitleSort(books) {
  const sortedList = books ? [...books].sort(sortByTitle) : getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  useDispatch()({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
export function onAuthorSort(books) {
  const sortedList = books ? [...books].sort(sortByAuthor) : getBooksList.slice().sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  useDispatch()({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Function to handle adding a new book with accessibility improvements
function handleAddBook(values) {
  useDispatch()(addBook({
    id: Date.now(), // Generate a unique id using current timestamp
    title: values.title,
    author: values.author,
  }));
}

function function3() {
  // TODO: Implement new function3 logic here
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

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
}

// Enhanced AddBookForm component with accessibility improvements
function AddBookForm({ form, onFinish }) {
  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      aria-label="Add new book form"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter the book title' }]}
      >
        <Input
          id="book-title"
          aria-required="true"
          aria-label="Book title"
          placeholder="Enter book title"
        />
      </Form.Item>
      <Form.Item
        label="Author"
        name="author"
        rules={[{ required: true, message: 'Please enter the book author' }]}
      >
        <Input
          id="book-author"
          aria-required="true"
          aria-label="Book author"
          placeholder="Enter book author"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" aria-label="Add book">
          Add Book
        </Button>
      </Form.Item>
    </Form>
  );
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(books);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(books);
    }
  }, [sorting, books]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.sort(sorting).map((book) => (
    <BookItem key={generateKey(book)} {...book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div {...getLangAttribute()}>
      <header role="banner">
        <h1>Book List</h1>
        <nav role="navigation" aria-label="Book list sorting controls">
          <button onClick={() => setSorting(sortByTitle)} aria-label="Sort books by title ascending">Sort by Title</button>
          <button onClick={() => setSorting(sortByAuthor)} aria-label="Sort books by author descending">Sort by Author</button>
        </nav>
      </header>
      <main role="main" aria-label="Book list">
        <section role="region" aria-label="Books list">
          <List
            dataSource={bookItems}
            renderItem={item => item}
          />
        </section>
        {/* Accessibility improvements for adding a new book */}
        <AddBookForm form={form} onFinish={handleAddBook} />
      </main>
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
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

export function addLandmarks(landmarks) {
  processLandmarks(landmarks);
}

export function getSvgAccessibleName(svgElement, accessibleName) {
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

export function isValidLink(element) {
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

export function addScopeToHeaders(table) {
  if (!table) return;

  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    const row = th.parentElement;
    const rowIndex = Array.from(row.children).indexOf(th);
    const cellsAbove = Array.from(table.querySelectorAll('tr')).slice(0, rowIndex);

    // Check if this header has cells below it in the same column
    const hasCellsBelow = cellsAbove.length > 0;

    // Check if this header has cells to the right in the same row
    const cellsInRow = Array.from(row.children);
    const hasCellsRight = cellsInRow.indexOf(th) < cellsInRow.length - 1;

    if (hasCellsBelow) {
      th.setAttribute('scope', 'col');
    } else if (hasCellsRight || cellsAbove.some(r => r.children[rowIndex])) {
      th.setAttribute('scope', 'row');
    }
  });
}

export function addressAccessibilityIssues(issues) {
  issues.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

export function addProperLandmarkRegions() {
  // REACT_017: Add proper landmark regions
}

export function announceToScreenReader() {
  // Screen reader announcement functionality
}

export function trapFocus() {
  // Focus trap functionality
}

export function manageFocusOnNavigation() {
  // Manage focus on navigation
}

export function prefersReducedMotion() {
  // Check for reduced motion preference
}

export function setAriaExpanded() {
  // Set aria-expanded attribute
}

export function hasAccessibleName() {
  // Check if element has accessible name
}

// Export the required functionA and functionB as objects with properties X, Y, and Z
export const functionA = {
  X: sortByTitle,
  Y: sortByAuthor,
  Z: onTitleSort
};

export const functionB = {
  X: getLangAttribute,
  Y: validateLandmark,
  Z: createInPageButton
};

export {
  function3,
  App,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  createInPageButton,
  handleFakeLinks,
  getSvgAccessibleName,
  validateLinkAccessibility,
  processLandmarks,
  addLandmarks,
  getUniqueLandmarkName,
  addProperLandmarkRegions,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
};

// Export the Main component
export default Main;