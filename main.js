// Import necessary dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { List, Form, Input, Button, UUID } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useId } from '@react-aria/utils';
import { ADD_BOOK, SORT_BY_TITLE, SORT_BY_AUTHOR } from './store/types';

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
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, books) {
  const sortedList = [...books].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: SORT_BY_TITLE, payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, books) {
  const sortedList = [...books].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: SORT_BY_AUTHOR, payload: sortedList });
}

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Return an action object to add the book to the books list in the Redux store
  return { type: ADD_BOOK, payload: book };
}

// Container for the dependency graph with proper ARIA role for accessibility
function DependencyGraph({ nodes, edges }) {
  return (
    <div 
      className="dependency-graph"
      role="img"
      aria-label="Dependency graph showing relationships between books and authors"
      tabIndex={0}
    >
      {/* Render graph nodes and edges */}
      {/* ... */}
    </div>
  );
}

// Function to render a form for adding a new book and to handle form submission
function AddBookForm() {
  const formId = useId();
  const [book, setBook] = useState({ title: '', author: '', id: UUID.generate() });
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary validation or processing before adding the book
    // ...

    dispatch(addBook(book));
    setBook({ title: '', author: '', id: UUID.generate() }); // Reset the form after submission
  };

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <label>
        Title:
        <input
          type="text"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          required
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          required
        />
      </label>
      <button type="submit">Add Book</button>
    </form>
  );
}

// REACT_036: Function to detect and handle fake links in the document
function detectFakeLinks() {
  if (typeof document === 'undefined' || !document.querySelectorAll) return [];
  
  // Look for elements with role="link" that don't have href attribute
  const potentialFakeLinks = document.querySelectorAll('[role="link"]:not([href])');
  // Also look for elements styled to look like links but are divs/spans without role
  const styledAsLinks = document.querySelectorAll('div.link, span.link, a[role="button"]');
  
  const fakeLinks = [];
  
  potentialFakeLinks.forEach(el => {
    if (!el.hasAttribute('href')) {
      fakeLinks.push(el);
    }
  });
  
  styledAsLinks.forEach(el => {
    if (!el.tagName.toLowerCase() === 'a' || (!el.getAttribute('href') && !el.getAttribute('role'))) {
      fakeLinks.push(el);
    }
  });
  
  return Array.from(fakeLinks);
}

// REACT_041: Function to find SVG elements without accessible names
function findSvgWithoutAccessibleNames() {
  if (typeof document === 'undefined' || !document.querySelectorAll) return [];
  
  const svgs = document.querySelectorAll('svg');
  const svgsWithoutNames = [];
  
  svgs.forEach(svg => {
    const hasAccessibleName = 
      svg.getAttribute('aria-label') || 
      svg.getAttribute('aria-labelledby') || 
      (svg.querySelector('title') && svg.querySelector('title').textContent.trim());
    
    if (!hasAccessibleName) {
      svgsWithoutNames.push(svg);
    }
  });
  
  return Array.from(svgsWithoutNames);
}

// REACT_015: Function to apply lang attribute to HTML element
function applyLangAttribute() {
  if (typeof document === 'undefined') return;
  
  const lang = getLangAttribute();
  const htmlElement = document.documentElement;
  
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }
}

// REACT_015: Function to get the lang attribute for the HTML element
function getLangAttribute() {
  // Determine the appropriate lang attribute based on document settings or default to 'en'
  const lang = typeof document !== 'undefined' ? (document.documentElement.lang || 'en') : 'en';
  return lang;
}

// REACT_015: Function to create an in-page button with proper accessibility attributes
function createInPageButton(label, onClickHandler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-label', label);
  if (typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// REACT_027: Function to validate table accessibility (checks for caption, summary, headers, etc.)
function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const hasCaption = tableElement.querySelector('caption') !== null;
  const hasHeaders = tableElement.querySelectorAll('th').length > 0;
  return hasCaption && hasHeaders;
}

// REACT_027: Function to validate table structure (checks for proper thead, tbody, tr, td/th nesting)
function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const hasThead = tableElement.querySelector('thead') !== null;
  const hasTbody = tableElement.querySelector('tbody') !== null;
  const rows = tableElement.querySelectorAll('tr');
  return hasThead && hasTbody && rows.length > 0;
}

// REACT_017: Function to validate a landmark element exists and has a role
function validateLandmark(element, expectedRole) {
  if (!element) return false;
  const role = element.getAttribute('role') || element.tagName.toLowerCase();
  return role === expectedRole;
}

// REACT_017: Function to validate landmark structure (proper nesting and child elements)
function validateLandmarkStructure(landmarkElement) {
  if (!landmarkElement) return false;
  // A landmark should contain accessible content (text or children)
  return landmarkElement.children.length > 0 || landmarkElement.textContent.trim().length > 0;
}

// REACT_017 & REACT_025: Function to validate landmark accessibility (unique landmarks, proper labels)
function validateLandmarkAccessibility(landmarkElements) {
  if (!Array.isArray(landmarkElements) || landmarkElements.length === 0) return true;
  const seenRoles = new Set();
  const seenLabels = new Set();
  for (const el of landmarkElements) {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';
    // REACT_025: Ensure unique landmarks (track uniqueness by label for same-role landmarks)
    const key = `${role}::${label}`;
    if (seenRoles.has(role) && seenLabels.has(label)) {
      return false;
    }
    seenRoles.add(role);
    if (label) seenLabels.add(label);
  }
  return true;
}

// REACT_041: Function to get the accessible name for an SVG element
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  return (
    svgElement.getAttribute('aria-label') ||
    svgElement.getAttribute('aria-labelledby') ||
    svgElement.querySelector('title')?.textContent ||
    ''
  );
}

// REACT_041: Function to set accessible attributes on SVG elements
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement) return;
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', accessibleName);
  if (!svgElement.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = accessibleName;
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

// REACT_036: Function to validate link accessibility (href, accessible name, not fake link)
function validateLinkAccessibility(linkElement) {
  if (!linkElement) return false;
  const href = linkElement.getAttribute('href');
  const accessibleName = linkElement.getAttribute('aria-label') || linkElement.textContent.trim();
  // A real link should have a non-empty href and an accessible name
  return href !== null && href !== '' && href !== '#' && accessibleName.length > 0;
}

// REACT_036: Function to handle fake links (divs/buttons styled as links) and convert to accessible elements
function handleFakeLinks(fakeLinkElements) {
  if (!Array.isArray(fakeLinkElements)) return;
  for (const el of fakeLinkElements) {
    // Replace fake link with a proper accessible element
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
      el.setAttribute('aria-label', 'Button');
    }
  }
}

// REACT_015: Function to fix HTML lang attribute
function fixHtmlLangAttribute() {
  if (typeof document === 'undefined') return false;
  
  try {
    const htmlElement = document.documentElement;
    if (!htmlElement) return false;
    
    const currentLang = htmlElement.getAttribute('lang');
    const expectedLang = getLangAttribute();
    
    if (currentLang !== expectedLang) {
      htmlElement.setAttribute('lang', expectedLang);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// REACT_036: Function to fix fake link issues
function fixFakeLinkIssues() {
  try {
    const fakeLinks = detectFakeLinks();
    if (fakeLinks.length > 0) {
      handleFakeLinks(fakeLinks);
      return fakeLinks.length;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

// REACT_041: Function to fix SVG accessibility issues
function fixSvgAccessibilityIssues() {
  try {
    const svgs = findSvgWithoutAccessibleNames();
    let fixedCount = 0;
    
    svgs.forEach((svg, index) => {
      let accessibleName = svg.getAttribute('data-accessible-name') || `Icon ${index + 1}`;
      setSvgAttributes(svg, accessibleName);
      fixedCount++;
    });
    
    return fixedCount;
  } catch (error) {
    return 0;
  }
}

function Main() {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  // Create memoized sort handlers
  const handleTitleSort = useCallback(() => {
    onTitleSort(dispatch, books);
  }, [dispatch, books]);

  const handleAuthorSort = useCallback(() => {
    onAuthorSort(dispatch, books);
  }, [dispatch, books]);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      handleTitleSort();
    } else if (sorting === sortByAuthor) {
      handleAuthorSort();
    }
  }, [sorting, handleTitleSort, handleAuthorSort]);

  // REACT_015: Apply lang attribute to HTML element on mount
  useEffect(() => {
    applyLangAttribute();
  }, []);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items, sorting controls, and the AddBookForm
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <AddBookForm />
      <section role="region" aria-label="Book dependency graph" aria-roledescription="dependencyGraph">
        <List dataSource={bookItems} />
      </section>
      <DependencyGraph 
        nodes={[]} 
        edges={[]} 
      />
    </div>
  );
}

// Export the Main component
export default Main;

// Add back required exports for testing and external use
export {
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  onTitleSort,
  onAuthorSort,
  defaultSorting,
  validateLandmark,
  DependencyGraph,
  AddBookForm,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark as validateLandmarkElement,
  validateLandmarkStructure,
  validateLandmarkAccessibility,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  // New exports for addressing accessibility issues
  applyLangAttribute,
  detectFakeLinks,
  findSvgWithoutAccessibleNames,
  fixHtmlLangAttribute,
  fixFakeLinkIssues,
  fixSvgAccessibilityIssues,
};