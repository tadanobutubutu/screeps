// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Input, Form } from 'antd';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

// Function to handle sorting books by title (ascending)
export function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
export function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
export function generateKey(book) {
  return book.id;
}

// Function to render a single book item
export function BookItem(book) {
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
export function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: 200f6fc2778b49bc0c082c4862cbe22ffd75ecd6_

// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// ...

// Function to ensure the addBook function is accessible
function ensureAccessibleAddBook() {
  // Implement accessibility checks and improvements for the addBook function
  // Example: Check if inputs are properly labeled, if form controls have appropriate roles, etc.
}

// Default sorting function for the book list
export const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
export function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
export function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  // Return the language attribute for the document
  // This helps screen readers determine the language of the content
  return document.documentElement.lang || 'en';
}

// REACT_017 & REACT_025: Validate landmark elements for accessibility
function validateLandmark(element) {
  // Check if element is a valid landmark
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  return validLandmarks.includes(element.tagName.toLowerCase());
}

// REACT_017 & REACT_025: Validate landmark structure for proper nesting
function validateLandmarkStructure(landmarks) {
  // Ensure landmarks are properly structured
  // and there are no duplicate or improperly nested landmarks
  const errors = [];
  
  landmarks.forEach((landmark, index) => {
    // Check for duplicate main landmarks
    if (landmark.tagName.toLowerCase() === 'main') {
      const mainCount = landmarks.filter(l => l.tagName.toLowerCase() === 'main').length;
      if (mainCount > 1) {
        errors.push('REACT_025: Multiple main landmarks found - only one main landmark should exist');
      }
    }
    
    // Check for landmark nesting issues
    if (!validateLandmark(landmark)) {
      errors.push('REACT_017: Invalid landmark element found');
    }
  });
  
  return errors;
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonProps) {
  const { onClick, label, icon, className, ariaLabel, role = 'button' } = buttonProps;
  
  // If it's a link pretending to be a button, ensure proper button semantics
  const isFakeLink = buttonProps.href !== undefined;
  
  if (isFakeLink) {
    // REACT_036: Fix fake link issue by converting to proper button
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || label}
        className={className}
      >
        {label}
        {icon}
      </button>
    );
  }
  
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={className}
    >
      {label}
      {icon}
    </button>
  );
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  const errors = [];
  
  // Check if link has accessible text
  if (!link.textContent && !link.getAttribute('aria-label')) {
    errors.push('Link must have accessible text content or aria-label');
  }
  
  // Check if link is properly structured (not a fake link)
  if (link.getAttribute('href') && link.tagName.toLowerCase() !== 'a') {
    errors.push('REACT_036: Element with href attribute should be an anchor tag');
  }
  
  return errors;
}

// REACT_036: Handle fake links - convert non-anchor elements with href to proper buttons
function handleFakeLinks(container) {
  const fakeLinks = container.querySelectorAll('[href]:not(a)');
  const errors = [];
  
  fakeLinks.forEach((element, index) => {
    errors.push(`REACT_036: Found fake link at index ${index} - converting to button`);
    // Convert to button by removing href and adding click handler
    const href = element.getAttribute('href');
    element.removeAttribute('href');
    element.setAttribute('role', 'button');
    element.addEventListener('click', () => {
      // Handle the click action that was intended by the href
      if (href.startsWith('#')) {
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.focus();
        }
      }
    });
  });
  
  return errors;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const errors = [];
  
  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('REACT_027: Table should have header cells (th)');
  }
  
  // Check if table has a caption or aria-label
  const caption = table.querySelector('caption');
  const ariaLabel = table.getAttribute('aria-label');
  if (!caption && !ariaLabel) {
    errors.push('REACT_027: Table should have a caption or aria-label');
  }
  
  // Check if scope attributes are present on headers
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      errors.push('REACT_027: Table headers should have scope attribute');
    }
  });
  
  return errors;
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const errors = [];
  
  // Check for proper table structure: thead, tbody, tfoot
  if (!table.querySelector('thead')) {
    errors.push('REACT_027: Table should have a thead element');
  }
  
  if (!table.querySelector('tbody')) {
    errors.push('REACT_027: Table should have a tbody element');
  }
  
  // Check that cells match the number of columns in header
  const headerRow = table.querySelector('thead tr');
  if (headerRow) {
    const headerCells = headerRow.querySelectorAll('th');
    const headerColCount = headerCells.length;
    
    // Check each data row
    const dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach((row, index) => {
      const cellCount = row.querySelectorAll('td, th').length;
      if (cellCount !== headerColCount) {
        errors.push(`REACT_027: Row ${index + 1} has ${cellCount} cells but header has ${headerColCount} columns`);
      }
    });
  }
  
  return errors;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg, context = '') {
  // Check if SVG has an aria-label
  let accessibleName = svg.getAttribute('aria-label');
  
  // If no aria-label, check for title element inside SVG
  if (!accessibleName) {
    const titleElement = svg.querySelector('title');
    if (titleElement) {
      accessibleName = titleElement.textContent;
    }
  }
  
  // If no accessible name found, generate one based on context
  if (!accessibleName) {
    accessibleName = `SVG icon${context ? ' - ' + context : ''}`;
  }
  
  return accessibleName;
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
  dispatch(addBook({
    id: Date.now(), // Generate a unique id using current timestamp
    title: values.title,
    author: values.author,
  }));
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [form] = Form.useForm();
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
      <header role="banner">
        <nav role="navigation" aria-label="Book list sorting controls">
          <button 
            onClick={() => setSorting(sortByTitle)} 
            id="sort-by-title-button"
            aria-label="Sort books by title"
          >
            Sort by Title
          </button>
          <button 
            onClick={() => setSorting(sortByAuthor)} 
            id="sort-by-author-button"
            aria-label="Sort books by author"
          >
            Sort by Author
          </button>
        </nav>
      </header>
      <main role="main" aria-label="Book list">
        <section role="region" aria-label="Books list">
          <List dataSource={bookItems} />
        </section>
      </main>
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
      <Form
        form={form}
        layout="inline"
        onFinish={(values) => handleAddBook(values)}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the book title' }]}
        >
          <Input aria-label="Book title" />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: 'Please enter the book author' }]}
        >
          <Input aria-label="Book author" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" aria-label="Add book">
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Export the required functionA and functionB as objects with properties X, Y, and Z
export const functionA = {
  X: sortByTitle,
  Y: sortByAuthor,
  Z: onTitleSort
};

export const functionB = {
  X: getLangAttribute,
  Y: validateLandmark,
  Z: createInPageButton
};

// Export the Main component
export default Main;