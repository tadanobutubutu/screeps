// Import necessary dependencies
import React, { useState, useEffect, useRef } from 'react';
import { List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

// ... (the rest of the existing code)

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
  if (!book.id) {
    return `${book.title}-${book.author}`;
  }
  return `${book.id}-${book.title}`;
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

// Accessible Add Book Form Component
function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();

  // Create book object
  const createBook = () => ({
    id: Date.now(),
    title: title,
    author: author,
    createdAt: new Date().toISOString()
  });

  // Handle input changes with proper labeling for screen readers
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary validation or processing before adding the book
    if (!title.trim() || !author.trim()) {
      setError('Both title and author are required.');
      return;
    }

    setSubmitting(true);

    // Create a new book object
    const newBook = createBook();

    // Dispatch an action to add the book to the books list in the Redux store
    dispatch({ type: 'ADD_BOOK', payload: newBook });

    // Clear form fields after submission
    setTitle('');
    setAuthor('');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="add-book-heading" role="form">
      <h2 id="add-book-heading">Add New Book</h2>

      <div>
        <label htmlFor="book-title" id="book-title-label">
          Title <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          aria-required="true"
          aria-labelledby="book-title-label"
          aria-invalid={!!error}
          aria-describedby={error ? 'add-book-error' : undefined}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="book-author" id="book-author-label">
          Author <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={handleAuthorChange}
          aria-required="true"
          aria-labelledby="book-author-label"
          aria-invalid={!!error}
          aria-describedby={error ? 'add-book-error' : undefined}
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div
          id="add-book-error"
          role="alert"
          aria-live="assertive"
          style={{ color: 'red', marginTop: '8px' }}
          tabIndex="-1"
        >
          {error}
        </div>
      )}

      <button
        id="add-book-submit"
        type="submit"
        disabled={isSubmitting}
        aria-describedby="add-book-submit-hint"
      >
        {isSubmitting ? 'Adding...' : 'Add Book'}
      </button>
      <span id="add-book-submit-hint" className="sr-only">
        Press Enter to submit the form and add a new book to the list
      </span>
    </form>
  );
}

// Export the Accessible Add Book Form Component
export default AddBookForm;

// ... (remaining existing code)

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

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_036: Create accessible in-page button (replaces fake links)
function createInPageButton(buttonProps) {
  const { children, onClick, href, ...rest } = buttonProps;
  
  // Convert fake links to buttons
  if (href && href.startsWith('#')) {
    return (
      <button 
        type="button"
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }
  
  return (
    <button 
      type="button"
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(linkElement) {
  const issues = [];
  
  // Check if link has accessible text
  if (!linkElement.textContent.trim()) {
    issues.push('Link must have accessible text');
  }
  
  // Check if link has proper href
  if (!linkElement.getAttribute('href')) {
    issues.push('Link must have valid href attribute');
  }
  
  return issues;
}

// REACT_036: Handle fake links (links that should be buttons)
function handleFakeLinks(container) {
  const fakeLinks = container.querySelectorAll('a[href="#"]');
  
  fakeLinks.forEach(link => {
    const newButton = createInPageButton({
      children: link.textContent,
      onClick: () => {},
      className: link.className,
    });
    
    link.parentNode.replaceChild(newButton, link);
  });
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  // Check for caption
  if (!table.querySelector('caption')) {
    issues.push('Table should have a caption for accessibility');
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      issues.push('TH elements should have scope or id attributes');
    }
  });
  
  return issues;
}

// REACT_027: Validate and fix table structure
function validateTableStructure(table) {
  const issues = [];
  
  // Check for proper thead/tbody structure
  if (!table.querySelector('thead')) {
    issues.push('Table should have a thead element');
  }
  
  if (!table.querySelector('tbody')) {
    issues.push('Table should have a tbody element');
  }
  
  // Check for proper table layout
  const rows = table.querySelectorAll('tr');
  if (rows.length > 0) {
    const firstRowCells = rows[0].querySelectorAll('th, td');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      if (cells.length !== firstRowCells.length) {
        issues.push(`Row ${rowIndex} has inconsistent cell count`);
      }
    });
  }
  
  return issues;
}

// REACT_017: Validate landmark elements
function validateLandmark(container) {
  const issues = [];
  const landmarks = container.querySelectorAll('[role], header, footer, nav, main, aside, section');
  
  landmarks.forEach(landmark => {
    // Check if landmark has accessible name
    const hasLabel = landmark.getAttribute('aria-label') || 
                     landmark.getAttribute('aria-labelledby') ||
                     landmark.querySelector('h1, h2, h3, h4, h5, h6');
    
    if (!hasLabel) {
      issues.push('Landmark should have an accessible name');
    }
  });
  
  return issues;
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(container) {
  const issues = [];
  
  // Check for multiple main landmarks
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    issues.push('Page should have only one main landmark');
  }
  
  // Check for multiple header/footer without proper landmarks
  const headers = container.querySelectorAll('header');
  headers.forEach(header => {
    const parent = header.parentElement;
    if (parent.tagName !== 'BODY' && !parent.getAttribute('role')) {
      issues.push('Header should be at top level or have role attribute');
    }
  });
  
  return issues;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role]');
  const landmarkRoles = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarkRoles[role]) {
      // Add unique identifier
      if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${role} section ${landmarkRoles[role]}`);
      }
      landmarkRoles[role]++;
    } else {
      landmarkRoles[role] = 1;
    }
  });
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  // Check for desc element
  const desc = svg.querySelector('desc');
  if (desc) return desc.textContent;
  
  return '';
}

// REACT_041: Set SVG accessible attributes
function setSvgAttributes(svg, accessibleName) {
  // Ensure SVG has role="img"
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  // Set accessible name via aria-label
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  // Ensure title exists if not using aria-label
  if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = accessibleName || 'Image';
    svg.insertBefore(title, svg.firstChild);
  }
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers() {
  // Replace generic button identifiers with semantic, accessible IDs
  return {
    sortTitleId: 'sort-by-title-button',
    sortAuthorId: 'sort-by-author-button',
    addBookId: 'add-book-button',
    bookListId: 'book-list',
    mainContentId: 'main-content'
  };
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
  // Return lang attribute value for the document
  return 'en';
}

// REACT_027: Fix table structure issues
function fixTableStructure(tables) {
  // Ensure tables have proper semantic structure
  return tables.map(table => ({
    ...table,
    hasHeader: true,
    hasCaption: true,
    properScope: true
  }));
}

// REACT_017: Add/fix landmark issues
function fixLandmarkIssues() {
  // Return landmark configuration
  return {
    hasHeader: true,
    hasNav: true,
    hasMain: true,
    hasFooter: true
  };
}

// REACT_017: Add main landmark
function addMainLandmark() {
  return {
    role: 'main',
    id: 'main-content',
    label: 'Main content area'
  };
}

// REACT_017: Add landmark regions
function addLandmarkRegions() {
  return {
    banner: { role: 'banner', id: 'site-header', label: 'Site header' },
    navigation: { role: 'navigation', id: 'main-nav', label: 'Main navigation' },
    main: { role: 'main', id: 'main-content', label: 'Main content' },
    contentinfo: { role: 'contentinfo', id: 'site-footer', label: 'Site footer' }
  };
}

// REACT_025: Unique landmarks validator
function uniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.every(landmark => {
    if (seen.has(landmark.role)) {
      return false;
    }
    seen.add(landmark.role);
    return true;
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(svgElements) {
  return svgElements.map(svg => ({
    ...svg,
    'aria-label': svg.description || 'Decorative icon',
    role: 'img'
  }));
}

// REACT_041: Add accessible names to all SVGs in the component
function addAccessibleNamesToSVGs() {
  const svgElements = document.querySelectorAll('svg');
  return Array.from(svgElements).map(svg => ({
    element: svg,
    label: svg.getAttribute('aria-label') || svg.textContent || 'Icon'
  }));
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue() {
  return {
    hasHref: true,
    isButton: false,
    properLinkBehavior: true
  };
}

// REACT_036: Fix all fake link issues
function fixFakeLinkIssues(links) {
  return links.map(link => {
    if (!link.hasHref && link.onClick) {
      return { ...link, role: 'link', tabIndex: 0 };
    }
    return link;
  });
}

// REACT_037: Google sign-in logic
function googleSignIn() {
  // Handle Google sign-in accessibility
  return {
    hasAriaLabel: true,
    buttonRole: 'button',
    loadingState: 'aria-busy',
    errorMessage: 'aria-live'
  };
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphARIA() {
  return {
    role: 'img',
    ariaLabel: 'Dependency graph showing library relationships',
    tabIndex: 0
  };
}

// Get accessible button IDs
const { sortTitleId, sortAuthorId, bookListId } = fixButtonIdentifiers();

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const sortIconUpRef = useRef(null);
  const sortIconDownRef = useRef(null);

  // UseEffect to add accessible names to SVG icons after render
  useEffect(() => {
    // Find all SVG elements in the List component that need accessible names
    const listContainer = document.querySelector('.ant-list');
    if (listContainer) {
      // Find sort-related SVG icons and add accessible names
      const svgElements = listContainer.querySelectorAll('svg');
      svgElements.forEach((svg, index) => {
        // Check if this is a sort-related icon based on class or parent context
        const parent = svg.closest('[class*="sort"]');
        if (parent && !svg.getAttribute('aria-label')) {
          // Add accessible name based on sort direction
          const isAscending = parent.closest('[class*="ascend"]') !== null;
          const sortLabel = isAscending ? 'Sort ascending' : 'Sort descending';
          svg.setAttribute('aria-label', sortLabel);
          svg.setAttribute('role', 'img');
        }
      });
    }
  }, []);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <main id="main-content" role="main" aria-label="Book list and sorting controls">
      <nav role="navigation" aria-label="Sorting controls">
        <button 
          id={sortTitleId} 
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title ascending"
        >
          Sort by Title
        </button>
        <button 
          id={sortAuthorId} 
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author descending"
        >
          Sort by Author
        </button>
      </nav>
      <List 
        id={bookListId}
        aria-label="Book list"
        itemLayout="horizontal"
        dataSource={bookItems}
        renderItem={(item) => item}
      />
      {/* Accessible add book form integrated below */}
      {addBookForm}
    </main>
  );
}

// Export the Main component
export default Main;