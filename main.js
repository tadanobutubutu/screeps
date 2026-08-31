import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';
import { Button } from 'antd';

// Default sorting function for the book list
const defaultSorting = (a, b) => a.title.localeCompare(b.title);

// Function to generate a key for each book item
function generateKey(book) {
  return `book-${book.id || 'unknown'}-${Math.random().toString(36).substr(2, 9)}`;
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
function addBook(book, dispatch) {
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Handle form submission for adding a new book
function handleAddBook(newBook, dispatch) {
  addBook(newBook, dispatch);
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
    report += `${index + 1}. ${issue.description || 'No description available'}`;
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

// Function to handle sorting books by title (ascending)
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

// Function to add proper ARIA labels to interactive elements
function addAriaLabels(container) {
  if (!container) return;
  const interactiveElements = container.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((element, index) => {
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      const label = element.textContent || `Interactive element ${index + 1}`;
      element.setAttribute('aria-label', label);
    }
  });
}

// Function to manage focus for keyboard navigation
function manageFocus(container) {
  if (!container) return;
  const focusableElements = container.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  focusableElements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '1');
  });
}

// Function to fix button identifiers for accessibility testing
function fixButtonIdentifiers(container) {
  if (!container) return;
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index + 1}`;
    }
  });
}

// Function to set ARIA role for an element
function setAriaRole(element, role) {
  if (element) {
    element.setAttribute('role', role);
  }
}

// Function to add descriptive labels to SVG elements
function addSvgAccessibility(svgElement, description) {
  if (svgElement) {
    svgElement.setAttribute('aria-label', description);
    svgElement.setAttribute('role', 'img');
  }
}

// Function to ensure dependency graph has proper ARIA role
function ensureDependencyGraphAria(container) {
  if (!container) return;
  const graphElement = container.querySelector('[data-graph]') || container.querySelector('svg');
  if (graphElement) {
    graphElement.setAttribute('role', 'img');
    graphElement.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

// Function to validate color contrast
function validateColorContrast(foreground, background) {
  const contrastRatio = getContrastRatio(foreground, background);
  return contrastRatio >= 4.5; // WCAG AA standard for normal text
}

// Helper function to calculate contrast ratio
function getContrastRatio(foreground, background) {
  const getLuminance = (color) => {
    const rgb = color.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  
  // Get the list of books from the Redux store
  const getBooksList = useSelector(state => state.books.list);
  
  // Get the dispatch function
  const dispatch = useDispatch();

  // Function to handle sorting the book list by title (ascending)
  function onTitleSort() {
    const sortedList = [...getBooksList].sort(sortByTitle);
    dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
  }

  // Function to handle sorting the book list by author (descending)
  function onAuthorSort() {
    const sortedList = [...getBooksList].sort(sortByAuthor);
    dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
  }

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
      addAriaLabels(container);
      manageFocus(container);
      fixButtonIdentifiers(container);

      // Apply SVG accessibility
      const svgElements = container.querySelectorAll('svg');
      svgElements.forEach(svg => {
        addSvgAccessibility(svg, 'Graphical element');
      });

      // Ensure dependency graph has proper ARIA role
      ensureDependencyGraphAria(container);
    }
  }, [sorting, getBooksList, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem({ book }));

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
        dataSource={bookItems}
        renderItem={book => BookItem(book)}
        aria-label="Book list"
      />
      <AddBookForm dispatch={dispatch} />
    </div>
  );
}

// Export the Main component
export default Main;

// Export the necessary functions for use in other modules
export { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, handleAddBook, generateAccessibilityReport };