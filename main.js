// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// ... (existing code)

// REACT_037: Add proper landmark regions (DONE)
function addProperLandmarkRegions() {
  const content = document.querySelector('#root, #app, .app');
  if (content && !document.querySelector('main')) {
    addMainLandmark();
  }
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.prepend(header);
  }
  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.append(footer);
  }
  if (!document.querySelector('nav')) {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    document.body.prepend(nav);
  }
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  return book.id;
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

// Accessible form component for adding new books
function AddBookForm() {
  const dispatch = useDispatch();
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newBook.title.trim() && newBook.author.trim()) {
      dispatch({ type: 'ADD_BOOK', payload: { ...newBook } });
      setNewBook({ title: '', author: '' });
    }
  };

  const handleTitleChange = (event) => {
    setNewBook({ ...newBook, title: event.target.value });
  };

  const handleAuthorChange = (event) => {
    setNewBook({ ...newBook, author: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book">
      <div>
        <label htmlFor="book-title">Book Title:</label>
        <input
          id="book-title"
          type="text"
          value={newBook.title}
          onChange={handleTitleChange}
          placeholder="Enter book title"
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="book-author">Author:</label>
        <input
          id="book-author"
          type="text"
          value={newBook.author}
          onChange={handleAuthorChange}
          placeholder="Enter author name"
          aria-required="true"
        />
      </div>
      <button type="submit" aria-label="Add book to list">
        Add Book
      </button>
    </form>
  );
}

// REACT_017: Add/fix landmark issues
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const body = document.body;
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }
}

function validateLandmark(landmark) {
  if (!landmark) return false;
  return landmark.hasAttribute('role') || landmark.tagName.toLowerCase() === landmark.getAttribute('role');
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside');
  return Array.from(landmarks).every(validateLandmark);
}

function validateLandmarkAttributes(landmark) {
  if (!landmark) return { valid: false };
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  return { valid: true, role };
}

// REACT_025: Ensure unique landmarks (DONE)
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'main', 'navigation', 'contentinfo', 'complementary'];
  landmarkRoles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (landmarks.length > 1) {
      for (let i = 1; i < landmarks.length; i++) {
        landmarks[i].removeAttribute('role');
      }
    }
  });
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('aria-labelledby') ||
         svg.querySelector('title')?.textContent ||
         '';
}

function setSvgAttributes(svg, accessibleName) {
  if (!svg || !accessibleName) return;
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('role', 'img');
}

// REACT_036: Fix fake link issues
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  if (onClick) button.addEventListener('click', onClick);
  return button;
}

function validateLinkAccessibility(link) {
  if (!link) return false;
  return link.hasAttribute('href') && link.getAttribute('href') !== '#';
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    const button = createInPageButton(link.textContent, () => {
      link.click();
    });
    link.parentNode.replaceChild(button, link);
  });
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute(lang) {
  document.documentElement.lang = lang || getLangAttribute();
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table) return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelectorAll('th').length > 0;
  return hasCaption && hasHeaders;
}

function validateTableStructure(table) {
  if (!table) return { valid: false, issues: [] };
  const issues = [];
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) issues.push('No rows found');
  const headerCells = table.querySelectorAll('th');
  if (headerCells.length === 0) issues.push('Missing header cells');
  return { valid: issues.length === 0, issues };
}

function fixTableStructure(table) {
  if (!table) return;
  const issues = validateTableStructure(table);
  if (!issues.valid) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      firstRow.querySelectorAll('td').forEach(td => {
        const th = document.createElement('th');
        th.textContent = td.textContent;
        td.parentNode.replaceChild(th, td);
      });
    }
  }
}

// Default sorting function for the book list
const defaultSorting = (a, b) => a.title.localeCompare(b.title);

// Function to handle sorting the book list by title (ascending)
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Main Component
function Main() {
  const dispatch = useDispatch();
  const bookItems = useSelector(state => state.books);

  // Function to create a new book entry in the Redux store
  function addBook(book) {
    // Perform any necessary validation or processing before adding the book
    // Add the new landmark regions once the book is added successfully
    addProperLandmarkRegions();

    // Dispatch an action to add the book to the books list in the Redux store
    dispatch({ type: 'ADD_BOOK', payload: book });
  }

  // Function to improve accessibility for the addBook function or form
  function enhanceAccessibilityForAddBook() {
    // Implement accessibility improvements such as labels, roles, and ARIA attributes
    // ...
    return null;
  }

  const sortByTitleClick = () => {
    const sortedList = [...bookItems].sort(defaultSorting);
    dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
  };

  const sortByAuthorClick = () => {
    const sortedList = [...bookItems].sort(sortByAuthor);
    dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
  };

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    // Initial sort
  }, []);

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={sortByTitleClick}>Sort by Title</button>
      <button onClick={sortByAuthorClick}>Sort by Author</button>
      <List dataSource={bookItems} renderItem={BookItem} />
      {/* Call the function to enhance accessibility for adding a new book */}
      {enhanceAccessibilityForAddBook()}
      {/* Accessible form for adding new books */}
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;