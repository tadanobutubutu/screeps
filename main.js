// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Function to add lang attribute to HTML element
function addLangAttribute(htmlElement, lang = 'en') {
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Function to fix table structure issues
function fixTableStructure(tableElement) {
  if (!tableElement) return;

  // Ensure table has proper structure
  const thead = tableElement.querySelector('thead') || document.createElement('thead');
  const tbody = tableElement.querySelector('tbody') || document.createElement('tbody');

  if (!tableElement.querySelector('thead')) {
    tableElement.prepend(thead);
  }
  if (!tableElement.querySelector('tbody')) {
    tableElement.appendChild(tbody);
  }

  // Add scope attributes to header cells
  const headerCells = thead.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
}

// Re-organized accessibility functions related to SVGs and landmarks

// Function to ensure unique landmarks
function uniqueLandmarks(container) {
  return ensureUniqueLandmarks(container);
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(svgElement, name) {
  if (!svgElement) return;

  // Add title element inside SVG
  const existingTitle = svgElement.querySelector('title');
  if (!existingTitle) {
    const title = document.createElement('title');
    title.textContent = name;
    svgElement.prepend(title);
  }

  // Add aria-label to SVG element
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', name);
  }
}

// Function to add accessible names to all SVGs in a container
function addAccessibleNamesToSVGs(container) {
  if (!container) return;

  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const name = svg.getAttribute('aria-label') || `SVG icon ${index + 1}`;
    addSvgAccessibleNames(svg, name);
  });
}

// Function to fix fake link issues (buttons styled as links)
function fixFakeLinkIssue(element) {
  if (!element) return;

  const fakeLinks = element.querySelectorAll('[role="link"], a:not([href])');
  fakeLinks.forEach(link => {
    const text = link.textContent;
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || text);
    if (link.id) {
      button.id = link.id;
    }
    link.parentNode.replaceChild(button, link);
  });
}

// Function to fix all fake link issues in container
function fixFakeLinkIssues(container) {
  if (!container) return;
  fixFakeLinkIssue(container);
}

// Function to handle Google sign-in logic
function googleSignIn() {
  // This function would typically trigger Google OAuth
  console.log('Google sign-in initiated');

  // For accessibility, ensure sign-in button has proper labeling
  return {
    buttonText: 'Sign in with Google',
    ariaLabel: 'Sign in with Google account'
  };
}

// Function to fix button identifiers for accessibility
function fixButtonIdentifiers(container) {
  if (!container) return;

  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id && !button.getAttribute('aria-label')) {
      const existingText = button.textContent.trim();
      if (!existingText) {
        button.setAttribute('aria-label', `Button ${index + 1}`);
      }
    }
  });
}

// Function to ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphARIA(containerElement) {
  if (!containerElement) return;

  if (!containerElement.hasAttribute('role')) {
    containerElement.setAttribute('role', 'region');
  }
  if (!containerElement.hasAttribute('aria-label')) {
    containerElement.setAttribute('aria-label', 'Dependency graph');
  }
  if (!containerElement.hasAttribute('aria-labelledby')) {
    containerElement.setAttribute('aria-labelledby', 'dependency-graph-title');
  }
}

// Similar function names have been renamed to eliminate confusion
function getBooksList() {
  return useSelector(state => state.books.list);
}

// Function to handle sorting books by title (ascending)
function onTitleSort(bookList, dispatch) {
  const sortedList = [...bookList].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  const action = { type: 'SORT_BY_TITLE', payload: sortedList };
  dispatch(action);
}

// Function to handle sorting books by author (descending)
function onAuthorSort(bookList, dispatch) {
  const sortedList = [...bookList].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  const action = { type: 'SORT_BY_AUTHOR', payload: sortedList };
  dispatch(action);
}

// Function to generate a key for each book item
function generateKey(book) {
  return book.id || `${book.title}-${book.author}`;
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

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Implement the required changes to improve accessibility for the addBook function or form
function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();

    // Perform any necessary validation or processing before adding a book
    // ...

    // Create a new book object
    const newBook = { id: Date.now(), title, author };

    // Dispatch an action to add the book to the books list in the Redux store
    dispatch({ type: 'ADD_BOOK', payload: newBook });

    // Clear form fields after submission
    setTitle('');
    setAuthor('');
  }

  return (
    <form onSubmit={handleSubmit} {...getLangAttribute()}>
      <input 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="Title"
        aria-label="Book Title"
      />
      <input 
        value={author} 
        onChange={e => setAuthor(e.target.value)} 
        placeholder="Author"
        aria-label="Author"
      />
      {createInPageButton('Add Book', handleSubmit)}
    </form>
  );
}

// Main component
function Main() {
  const dispatch = useDispatch();
  const bookList = getBooksList();
  const [sorting, setSorting] = useState(defaultSorting);

  // Function to create a new book entry in the Redux store
  function addBook(book) {
    // Perform any necessary validation or processing before adding the book
    // ...

    // Dispatch an action to add the book to the books list in the Redux store
    const action = { type: 'ADD_BOOK', payload: book };
    dispatch(action);
  }

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(bookList, dispatch);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(bookList, dispatch);
    }
  }, [sorting, bookList, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = bookList.map(book => BookItem(book));

  // Render the main component containing the book list and sorting controls
  return (
    <div {...getLangAttribute()}>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List
        dataSource={bookList}
        renderItem={(book) => (
          <List.Item key={generateKey(book)}>
            <List.Item.Meta
              title={book.title}
              description={book.author}
            />
          </List.Item>
        )}
      />
      
      {/* Accessibility improvements for adding a new book */}
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;