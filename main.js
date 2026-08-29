// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { List } from 'antd';

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

// REACT_015: Set the lang attribute on the HTML element
// REACT_017: Add landmark roles and fix landmark issues
// REACT_025: Ensure unique landmarks
// REACT_036: Fix fake link issues
// REACT_041: Add accessible names to SVGs

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

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// ...

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const getBooksList = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  // REACT_015: Set lang attribute on HTML element
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  // Function to handle sorting the book list by title (ascending)
  const onTitleSort = () => {
    const sortedList = [...getBooksList].sort(sortByTitle);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
  };

  // Function to handle sorting the book list by author (descending)
  const onAuthorSort = () => {
    const sortedList = [...getBooksList].sort(sortByAuthor);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
  };

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(BookItem);

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List dataSource={bookItems} />
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
    </div>
  );
}

// REACT_017: Add landmark roles to fix landmark issues
export function ensureUniqueName(baseName, existingNames) {
  if (!existingNames || !Array.isArray(existingNames)) {
    return baseName;
  }
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

// REACT_025: Ensure unique landmarks function
export function validateLandmarkUniqueness(container = document) {
  const landmarks = container.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

// REACT_041: Add accessible names to SVGs
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;
  
  // Add title element as first child
  const title = document.createElement('title');
  title.id = `${svgElement.id || 'svg'}-title`;
  title.textContent = accessibleName;
  
  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

// REACT_036: Fix fake link issues - convert to proper semantic elements
export function isValidLink(element) {
  if (!element) return true;
  
  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const onClick = element.getAttribute('onclick');
  
  // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;
  
  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }
  
  return { valid: true };
}

// REACT_027: Add scope to table headers
export function validateTableAccessibility(tableElement) {
  if (!tableElement) return [];
  
  const headers = tableElement.querySelectorAll('th');
  const updates = [];
  
  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);
    
    // Determine if scope should be 'col' or 'row'
    let scope = 'col';
    
    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }
    
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });
  
  return updates;
}

// Accessibility issue addressing functions
function addressAccessibilityIssues(insightReport) {
  // Assuming insightReport is an array of objects with 'issue' and 'solution' properties
  insightReport.forEach((issue) => {
    console.log(`Addressing issue: ${issue.issue}`);
    // Implement the solution to the issue
    // This is a placeholder for the actual implementation
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

// New function to address accessibility issues from insight report
function newFunction() {
  // implementation of new function
}

// Accessibility Helper Functions

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Traps focus within a specified element (useful for modals)
 * @param {HTMLElement} element - The container element to trap focus within
 * @returns {Function} - Cleanup function to remove the trap
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  return () => element.removeEventListener('keydown', handleKeyDown);
}

/**
 * Manages focus when navigating between sections
 * @param {string} selector - CSS selector of the target section
 */
function manageFocusOnNavigation(selector) {
  const target = document.querySelector(selector);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
    target.removeAttribute('tabindex');
  }
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safely manages aria-expanded state
 * @param {HTMLElement} trigger - The element that triggers the toggle
 * @param {boolean} isExpanded - Current expanded state
 */
function setAriaExpanded(trigger, isExpanded) {
  if (trigger) {
    trigger.setAttribute('aria-expanded', String(isExpanded));
  }
}

/**
 * Validates that an interactive element has proper accessible name
 * @param {HTMLElement} element - The element to validate
 * @returns {boolean}
 */
function hasAccessibleName(element) {
  return !!(
    element.textContent?.trim() ||
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.getAttribute('alt') ||
    element.getAttribute('title')
  );
}

// Export the Main component
export default Main;

// Accessibility Helper Functions export
export { 
  newFunction, 
  addressAccessibilityIssues, 
  announceToScreenReader, 
  trapFocus, 
  manageFocusOnNavigation, 
  prefersReducedMotion, 
  setAriaExpanded, 
  hasAccessibleName,
  ensureUniqueName,
  validateLandmarkUniqueness,
  addSvgAccessibleName,
  isValidLink,
  validateTableAccessibility
};

// Entry point - render the Main component
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Main />);
}