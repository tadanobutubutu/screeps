// Import necessary dependencies
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button } from 'antd';

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
        description={`by ${book.author}`}
      />
    </List.Item>
  );
}

// Function to render the form for adding a new book entry
function BookForm() {
  const dispatch = useDispatch();

  // Define state for the form inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Handle input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary validation or processing before adding the book
    // ...

    // Dispatch an action to add the book to the books list in the Redux store
    dispatch({ type: 'ADD_BOOK', payload: { title, author } });
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={handleTitleChange}
        aria-label="Book title"
      />
      <label htmlFor="author">Author:</label>
      <input
        type="text"
        id="author"
        value={author}
        onChange={handleAuthorChange}
        aria-label="Book author"
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

// Accessibility helper functions
// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015: Get person name for accessibility context
function personName() {
  const userName = document.documentElement.getAttribute('data-user-name');
  const metaAuthor = document.querySelector('meta[name="author"]');
  const fallbackName = 'User';
  
  if (userName) {
    return userName;
  }
  
  if (metaAuthor && metaAuthor.content) {
    return metaAuthor.content;
  }
  
  return fallbackName;
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

// NEW: Implement focus trap for keyboard navigation
function newFocusTrap(containerElement, options = {}) {
  const {
    onActivate = () => {},
    onDeactivate = () => {},
    escapeDeactivates = true,
    clickOutsideDeactivates = true,
    returnFocusOnDeactivate = true,
  } = options;

  let previousActiveElement = null;
  let isActive = false;

  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  function getFocusableElements() {
    return Array.from(containerElement.querySelectorAll(focusableElementsSelector))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  function handleKeyDown(event) {
    if (!isActive) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (event.key === 'Escape' && escapeDeactivates) {
      event.preventDefault();
      deactivate();
    }
  }

  function handleClickOutside(event) {
    if (!isActive || !clickOutsideDeactivates) return;
    
    if (!containerElement.contains(event.target)) {
      deactivate();
    }
  }

  function activate() {
    if (isActive) return;
    
    previousActiveElement = document.activeElement;
    isActive = true;
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    onActivate();
  }

  function deactivate() {
    if (!isActive) return;
    
    isActive = false;
    
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleClickOutside);
    
    if (returnFocusOnDeactivate && previousActiveElement) {
      previousActiveElement.focus();
    }
    
    onDeactivate();
  }

  return {
    activate,
    deactivate,
    isActive: () => isActive,
  };
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, list) {
  const sortedList = [...list].sort(sortByTitle);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, list) {
  const sortedList = [...list].sort(sortByAuthor);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Accessible Add Book Form component
function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    if (!author.trim()) {
      setError('Author is required');
      return;
    }

    onAddBook({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
    
    // Move focus to title input after successful submission for accessibility
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Move to author input on Enter key
      const form = formRef.current;
      if (form) {
        const authorInput = form.querySelector('#add-book-author');
        if (authorInput) {
          authorInput.focus();
        }
      }
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      aria-label="Add new book form"
      style={{ marginBottom: '16px' }}
    >
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="add-book-title" id="add-book-title-label">
          Book Title
        </label>
        <input
          id="add-book-title"
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
          aria-required="true"
          aria-labelledby="add-book-title-label"
          placeholder="Enter book title"
          style={{ marginLeft: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="add-book-author" id="add-book-author-label">
          Author
        </label>
        <input
          id="add-book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-required="true"
          aria-labelledby="add-book-author-label"
          placeholder="Enter author name"
          style={{ marginLeft: '8px' }}
        />
      </div>

      {error && (
        <div 
          role="alert" 
          aria-live="polite"
          style={{ color: 'red', marginBottom: '8px' }}
        >
          {error}
        </div>
      )}

      <button 
        type="submit"
        aria-describedby={error ? 'add-book-error' : undefined}
      >
        Add Book
      </button>
    </form>
  );
}

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books?.list || []);
  const [sorting, setSorting] = useState(defaultSorting);

  // Function to add a new book to the Redux store
  const handleAddBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
  };

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(dispatch, booksList);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(dispatch, booksList);
    }
  }, [sorting, dispatch, booksList]);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items, sorting controls, and the book form
  return (
    <div>
      <h2 id="add-book-heading">Add a New Book</h2>
      <AddBookForm onAddBook={handleAddBook} />
      
      <h2 id="books-list-heading">Books List</h2>
      <div role="group" aria-labelledby="books-list-heading">
        <button 
          onClick={() => setSorting(sortByTitle)}
          aria-pressed={sorting === sortByTitle}
        >
          Sort by Title
        </button>
        <button 
          onClick={() => setSorting(sortByAuthor)}
          aria-pressed={sorting === sortByAuthor}
        >
          Sort by Author
        </button>
      </div>
      
      <List 
        aria-label="Books collection"
        dataSource={bookItems}
      />
    </div>
  );
}

// Export the Main component and the BookForm component
export default Main;
export { BookForm };