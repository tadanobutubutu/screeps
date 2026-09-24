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

// Function to handle spawning logic for a book
function spawnBook(book) {
  // Validate the book object exists
  if (!book) {
    return null;
  }

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
  const processedBook = spawnBook(book);

  if (!processedBook) {
    return;
  }

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: processedBook });
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
  return 0;
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

  // REACT_015: Apply lang attribute to HTML element on mount
  useEffect(() => {
    applyLangAttribute();
  }, []);

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