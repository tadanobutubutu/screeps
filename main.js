import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';
import { Button } from 'antd';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

// Get the dispatch function
const dispatch = useDispatch();

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
  return `book-${book.id || book.title}-${book.author || ''}`;
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
    report += `${index + 1}. ${issue.description || 'Issue ' + (index + 1)}`;
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

// Export the necessary functions for use in other modules
export { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, handleAddBook, generateAccessibilityReport };
// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

// Function to add skip link for keyboard navigation (REACT_015)
function addSkipLink(container) {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '0';
  skipLink.style.background = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px';
  skipLink.style.zIndex = '10000';
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  if (container) {
    container.insertBefore(skipLink, container.firstChild);
  }
}

// Function to handle keyboard navigation (REACT_027)
function handleKeyboardNavigation(event, callback) {
  const focusableElements = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const container = event.currentTarget;
  const focusables = Array.from(container.querySelectorAll(focusableElements));
  const firstFocusable = focusables[0];
  const lastFocusable = focusables[focusables.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  if (callback && typeof callback === 'function') {
    callback(event);
  }
}

// Function to fix button identifiers for accessibility (REACT_017)
function fixButtonIdentifiers(container) {
  if (!container) return;
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `accessible-button-${index + 1}`;
    }
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      const parent = button.closest('[aria-label]') || container;
      if (parent && parent.getAttribute('aria-label')) {
        button.setAttribute('aria-label', `${parent.getAttribute('aria-label')} button ${index + 1}`);
      }
    }
  });
}

// Function to ensure element has proper ARIA role (REACT_041)
function ensureARIA(element, role) {
  if (!element) return;
  if (!element.getAttribute('role')) {
    element.setAttribute('role', role);
  }
}

// Function to add ARIA attribute to element (REACT_025)
function addARIAAttribute(element, attribute, value) {
  if (!element) return;
  element.setAttribute(attribute, value);
}

// Function to ensure SVG accessibility (REACT_036)
function ensureSVGAccessibility(svgElement, description) {
  if (!svgElement) return;
  
  svgElement.setAttribute('role', 'img');
  
  let title = svgElement.querySelector('title');
  if (!title) {
    title