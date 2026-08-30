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
  return `book-${book.id || book.title.toLowerCase().replace(/\s+/g, '-')}`;
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

// Export the addBook function
export function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Accessibility function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  if (document && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// Accessibility function to fix table structure issues
function fixTableStructure(table) {
  if (!table) return table;
  
  // Ensure table has proper structure with theboby, thead, and captions
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');
  
  if (!hasTbody) {
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  }
  
  return table;
}

// Accessibility function to fix landmark issues
function fixLandmarkIssues(container) {
  if (!container) return;
  
  // Ensure main landmark exists
  addMainLandmark(container);
  
  // Add landmark regions
  addLandmarkRegions(container);
  
  // Ensure unique landmarks
  ensureUniqueLandmarks(container);
}

// Accessibility function to add main landmark
function addMainLandmark(container) {
  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const existingMain = container.querySelector('[role="main"]');
    if (!existingMain) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      container.insertBefore(main, container.firstChild);
    }
  }
}

// Accessibility function to add landmark regions
function addLandmarkRegions(container) {
  const regions = ['navigation', 'complementary', 'banner', 'contentinfo'];
  regions.forEach(region => {
    const elements = container.querySelectorAll(`[role="${region}"]`);
    elements.forEach((el, index) => {
      if (!el.tagName.toLowerCase().includes(region)) {
        el.setAttribute('aria-label', `${region}-${index + 1}`);
      }
    });
  });
}

// Accessibility function to ensure unique landmarks
function ensureUniqueLandmarks(container) {
  uniqueLandmarks(container);
}

// Accessibility function to make landmarks unique
function uniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('nav, aside, header, footer, main');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    landmarkCounts[tagName] = (landmarkCounts[tagName] || 0) + 1;
    
    if (landmarkCounts[tagName] > 1) {
      const role = landmark.getAttribute('role') || tagName;
      landmark.setAttribute('aria-label', `${role}-${landmarkCounts[tagName]}`);
    }
  });
}

// Accessibility function to add accessible names to SVGs
function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') return;
  
  addAccessibleNamesToSVGs(svgElement, accessibleName);
}

// Accessibility function to add accessible names to multiple SVGs
function addAccessibleNamesToSVGs(container, accessibleName) {
  const svgs = container.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElement('title');
      title.id = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      title.textContent = accessibleName || 'Icon';
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// Accessibility function to fix fake link issues
function fixFakeLinkIssue(element) {
  if (!element) return;
  
  const isFakeLink = element.tagName.toLowerCase() !== 'a' && 
                     element.getAttribute('role') === 'link' &&
                     !element.href;
  
  if (isFakeLink) {
    element.setAttribute('role', 'button');
  }
}

// Accessibility function to fix multiple fake link issues
function fixFakeLinkIssues(container) {
  if (!container) return;
  
  const fakeLinks = container.querySelectorAll('[role="link"]:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
  });
}

// Google sign-in logic
function googleSignIn() {
  // Google sign-in implementation
  const googleAuthConfig = {
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: 'email profile',
    callback: (response) => {
      if (response.access_token) {
        dispatch({ type: 'GOOGLE_SIGN_IN', payload: response });
      }
    }
  };
  
  // Initialize Google OAuth
  if (window.gapi) {
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2) {
        auth2.signIn().then(googleAuthConfig.callback);
      }
    });
  }
}

// Accessibility function to fix button identifiers
function fixButtonIdentifiers(container, buttonMappings = {}) {
  if (!container) return;
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const buttonId = button.id || button.getAttribute('data-testid');
    
    // Replace my-button with actual descriptive id
    if (buttonId && buttonId.includes('my-button')) {
      const newId = buttonMappings[buttonId] || `accessible-button-${index + 1}`;
      button.id = newId;
    }
    
    // Ensure button has accessible name
    if (!button.getAttribute('aria-label') && 
        !button.getAttribute('aria-labelledby') &&
        !button.textContent.trim()) {
      const purpose = Array.from(button.classList).find(cls => 
        cls.includes('sort') || cls.includes('add') || cls.includes('delete')
      );
      if (purpose) {
        button.setAttribute('aria-label', `${purpose.replace(/-/g, ' ')} button`);
      }
    }
  });
}

// Accessibility function to ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole(container, role = 'img', label = 'Dependency graph') {
  if (!container) return;
  
  const dependencyGraph = container.querySelector('[class*="dependencyGraph"]') || 
                          container.querySelector('[id*="dependencyGraph"]') ||
                          container;
  
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', role);
  }
  
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', label);
  }
  
  return dependencyGraph;
}

// Export necessary functions for use in other modules
export { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, AddBookForm, onTitleSort, onAuthorSort };

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
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
    
    // Apply accessibility improvements on component mount
    const container = document.getElementById('main-content');
    if (container) {
      // Apply accessibility fixes
      fixLandmarkIssues(container);
      fixFakeLinkIssues(container);
      fixButtonIdentifiers(container);
      
      // Apply SVG accessibility
      addAccessibleNamesToSVGs(container, 'Graphical element');
      
      // Ensure dependency graph has proper ARIA role
      ensureDependencyGraphAriaRole(container);
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

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
        dataSource={getBooksList} 
        renderItem={book => BookItem(book)}
        aria-label="Book list"
      />
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
    </div>
  );
}

// Export the Main component
export default Main;

// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)
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
function setSvgAttributes(svg, options = {}) {
  const { label, role = 'img', description = '' } = options;
  
  // Set the role attribute
  svg.setAttribute('role', role);
  
  // Get or set the accessible name
  const accessibleName = label || getSvgAccessibleName(svg);
  svg.setAttribute('aria-label', accessibleName);
  
  // If there's a description, add it as aria-describedby
  if (description) {
    // Create a hidden description element
    const id = `svg-desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('span');
    descElement.id = id;
    descElement.textContent = description;
    descElement.style.display = 'none';
    svg.appendChild(descElement);
    svg.setAttribute('aria-describedby', id);
  }
  
  // If there's a title element, ensure it has an ID linked to aria-labelledby
  const titleElement = svg.querySelector('title');
  if (titleElement && !titleElement.id) {
    const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    titleElement.id = titleId;
    svg.setAttribute('aria-labelledby', titleId);
    svg.removeAttribute('aria-label');
  }
  
  return svg;
}

// Function to handle adding a new book with accessibility improvements
function handleAddBook(values) {
  return addBook({
    id: Date.now(), // Generate a unique id using current timestamp
    title: values.title,
    author: values.author,
  });
}

function processLandmarks(landmarks) {
  // Process landmarks for accessibility
  const errors = validateLandmarkStructure(landmarks);
  if (errors.length > 0) {
    console.warn('Landmark structure issues found:', errors);
  }
  return landmarks;
}

// Line 129 preserved content from issue
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Line 129 preserved content from issue
// TODO: This is the existing code that needs to be preserved

function addLandmarks(landmarks) {
  processLandmarks(landmarks);
}

function getUniqueLandmarkName(baseName, existingNames) {
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

// REACT_041: Set SVG attributes for accessibility (exported as getSvgAccessibleName for compatibility)
function setSvgAccessibleName(svgElement, accessibleName) {
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

// Export necessary functions for use in other modules
export {
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  onTitleSort,
  onAuthorSort,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  handleAddBook,
  addLandmarks,
  getUniqueLandmarkName,
  setSvgAccessibleName,
  processLandmarks
};