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
  if (!svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
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
  const banner = container.querySelector('[role="banner"]');
  const navigation = container.querySelector('[role="navigation"]');
  const main = container.querySelector('[role="main"]');
  const contentinfo = container.querySelector('[role="contentinfo"]');
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
  const landmarks = container.querySelectorAll('header, nav, main, footer, [role]');
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

// Function to improve accessibility for the addBook function or form
function handleAccessibilityForAddBookForm() {
  // Implement any necessary changes to improve accessibility, such as:
  // - Adding labels for form controls
  // - Ensuring keyboard navigation is supported
  // - Adding appropriate ARIA roles and properties if needed
  // ...
}

// Function to render the dependency graph view
function renderDependencyGraph() {
  return dependencyGraphContent;
}

// Function to render the index view
function renderIndexView() {
  return indexContent;
}

// Accessibility helper functions
// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonText, onClickHandler) {
  return (
    <button 
      onClick={onClickHandler}
      lang={getLangAttribute()}
    >
      {buttonText}
    </button>
  );
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(tableElement) {
  const issues = [];
  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');
  
  if (!hasCaption) {
    issues.push('REACT_027: Table is missing a caption');
  }
  if (!hasHeaders) {
    issues.push('REACT_027: Table is missing header cells (th)');
  }
  
  return issues;
}

// REACT_027: Validate table structure
function validateTableStructure(tableElement) {
  const issues = [];
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`REACT_027: Row ${rowIndex} has no cells`);
    }
  });
  
  return issues;
}

// REACT_017: Validate landmarks
function validateLandmark() {
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1 && landmark !== 'nav' && landmark !== 'aside') {
      issues.push(`REACT_017: Multiple ${landmark} landmarks found`);
    }
  });
  
  return issues;
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure() {
  const issues = [];
  const mainElement = document.querySelector('main');
  const headerElement = document.querySelector('header');
  const footerElement = document.querySelector('footer');
  
  if (!mainElement) {
    issues.push('REACT_017: Missing main landmark');
  }
  if (!headerElement) {
    issues.push('REACT_017: Missing header landmark');
  }
  if (!footerElement) {
    issues.push('REACT_017: Missing footer landmark');
  }
  
  return issues;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  return titleElement ? titleElement.textContent : '';
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarkTypes.forEach(type => {
    const landmarks = document.querySelectorAll(`[role="${type}"]`);
    if (landmarks.length > 1) {
      issues.push(`REACT_025: Multiple ${type} landmarks found - should be unique`);
    }
  });
  
  return issues;
}

// REACT_025: Add proper landmark regions
function addProperLandmarkRegions() {
  const issues = [];
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  
  if (!mainContent) {
    issues.push('REACT_025: Missing main landmark region');
  }
  
  return issues;
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(linkElement) {
  const issues = [];
  const href = linkElement.getAttribute('href');
  const text = linkElement.textContent.trim();
  const ariaLabel = linkElement.getAttribute('aria-label');
  
  if (!href || href === '#' || href === '') {
    issues.push('REACT_036: Link has no valid href attribute');
  }
  
  if (!text && !ariaLabel) {
    issues.push('REACT_036: Link has no accessible name');
  }
  
  if (linkElement.getAttribute('role') === 'link' && !href) {
    issues.push('REACT_036: Fake link detected without href');
  }
  
  return issues;
}

// REACT_036: Handle fake links
function handleFakeLinks() {
  const issues = [];
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a[role="link"])');
  
  fakeLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    if (!href) {
      issues.push(`REACT_036: Fake link ${index} has no href attribute`);
    }
    
    // Convert fake link to accessible button if it's clickable
    if (link.tagName !== 'A' && link.getAttribute('onclick')) {
      issues.push(`REACT_036: Consider using <button> instead of fake link ${index}`);
    }
  });
  
  return issues;
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

// Function to count dependencies
// This function counts the number of dependencies in a given object or array
function countDependencies(dependencies) {
  if (Array.isArray(dependencies)) {
    return dependencies.length;
  }
  if (typeof dependencies === 'object' && dependencies !== null) {
    return Object.keys(dependencies).length;
  }
  return 0;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [view, setView] = useState('books');
  const dispatch = useDispatch();

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setView('books')}>Books</button>
      <button onClick={() => setView('index')}>Index View</button>
      <button onClick={() => setView('dependencyGraph')}>Dependency Graph</button>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <div>
        {view === 'books' && <List dataSource={bookItems} />}
        {view === 'index' && renderIndexView()}
        {view === 'dependencyGraph' && renderDependencyGraph()}
      </div>
    </div>
  );
}

// Export the Main component
export default Main;