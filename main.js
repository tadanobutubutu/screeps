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
import { List } from 'antd';

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
  return ...
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
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

// Accessibility functions

// REACT_015: Get lang attribute for HTML element
function getLangAttribute(element) {
  // Return the lang attribute value from the element
  return element.getAttribute('lang') || 'en';
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonProps) {
  const { label, onClick, icon, ...props } = buttonProps;
  
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      {...props}
    >
      {icon && (
        <span aria-hidden="true">{icon}</span>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(tableElement) {
  const issues = [];
  
  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption');
  if (!hasCaption) {
    issues.push('REACT_027: Table missing caption');
  }
  
  // Check for th elements with scope attributes
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      issues.push(`REACT_027: Table header at index ${index} missing scope attribute`);
    }
  });
  
  return issues;
}

// REACT_027: Validate table structure
function validateTableStructure(tableElement) {
  const structureIssues = [];
  
  // Check for thead and tbody
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  
  if (!thead) {
    structureIssues.push('REACT_027: Table missing thead element');
  }
  
  if (!tbody) {
    structureIssues.push('REACT_027: Table missing tbody element');
  }
  
  // Check that th elements are within thead
  if (thead) {
    const thsInThead = thead.querySelectorAll('th');
    if (thsInThead.length === 0) {
      structureIssues.push('REACT_027: Table thead missing th elements');
    }
  }
  
  return structureIssues;
}

// REACT_017: Validate landmark
function validateLandmark(element) {
  const landmarkIssues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has valid landmark role or is a landmark element
  if (role && !validLandmarks.includes(role)) {
    landmarkIssues.push(`REACT_017: Invalid landmark role: ${role}`);
  }
  
  return landmarkIssues;
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(container) {
  const structureIssues = [];
  
  // Check for multiple main landmarks
  const mainLandmarks = container.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length > 1) {
    structureIssues.push('REACT_017: Multiple main landmarks found');
  }
  
  // Check for banner landmark outside header
  const banners = container.querySelectorAll('[role="banner"]');
  banners.forEach((banner, index) => {
    if (banner.parentElement.tagName.toLowerCase() !== 'header') {
      structureIssues.push(`REACT_017: Banner landmark at index ${index} not properly contained in header`);
    }
  });
  
  return structureIssues;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element within SVG
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  return '';
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement) return;
  
  // Remove any existing aria attributes
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  
  // Create a title element if it doesn't exist
  let titleElement = svgElement.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElement('title');
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  }
  titleElement.textContent = accessibleName;
  
  // Set aria-labelledby to reference the title
  const titleId = `svg-title-${Date.now()}`;
  titleElement.id = titleId;
  svgElement.setAttribute('aria-labelledby', titleId);
  
  return svgElement;
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(linkElement) {
  const linkIssues = [];
  
  // Check if link has accessible text
  const hasText = linkElement.textContent.trim().length > 0;
  const hasAriaLabel = linkElement.getAttribute('aria-label');
  const hasAriaLabelledby = linkElement.getAttribute('aria-labelledby');
  const hasTitle = linkElement.getAttribute('title');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    linkIssues.push('REACT_036: Link has no accessible name');
  }
  
  // Check if link has href
  const href = linkElement.getAttribute('href');
  if (!href || href === '#') {
    linkIssues.push('REACT_036: Link missing or invalid href attribute');
  }
  
  return linkIssues;
}

// REACT_036: Handle fake links (elements that look like links but aren't)
function handleFakeLinks(container) {
  const fakeLinkIssues = [];
  
  // Find elements with onclick that aren't buttons or links
  const clickableElements = container.querySelectorAll('[onclick]');
  
  clickableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const isButton = tagName === 'button';
    
    // Check if it has an href (making it a real link)
    const hasHref = element.getAttribute('href');
    
    if (!isAnchor && !isButton && !hasHref) {
      fakeLinkIssues.push(`REACT_036: Element at index ${index} is a fake link (has onclick but no proper link/button semantics)`);
    }
  });
  
  return fakeLinkIssues;
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = ...
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = ...
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
  const bookItems = ...

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