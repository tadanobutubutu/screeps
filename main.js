import React, { useState, useEffect, useCallback } from 'react';
import { List, Form, Input, Button, UUID } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useId } from '@react-aria/utils';
import { ADD_BOOK, SORT_BY_TITLE, SORT_BY_AUTHOR } from './store/types';

// Helper functions
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

function generateKey(book) {
  return book.id || `${book.title}-${book.author}`;
}

// Functions from HEAD for dependency management
async function fetchBookDependencies(bookId, dispatch) {
  // Fetch dependencies for the specified book
  // ... (Assuming you have an API endpoint to fetch book dependencies or implementing this logic)

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: /* The fetched dependencies */ }));
}

function updateBookDependencies(bookId, newDependencies, dispatch) {
  // Perform any necessary validation or processing before updating the book's dependencies
  // ...

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
}

// Action creator for setDependencyGraph
function setDependencyGraph({ bookId, dependencies }) {
  return { type: 'SET_DEPENDENCY_GRAPH', payload: { bookId, dependencies } };
}

// Components from origin/main
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)} role="listitem">
      <List.Item.Meta
        title={book.title}
        ...
      />
    </List.Item>
  );
}

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

// Action creator for addBook
function addBook(book) {
  return { type: ADD_BOOK, payload: book };
}

// AddBookForm component
function AddBookForm({ onAdd }) {
  const formId = useId();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        id: UUID.generate()
      };
      onAdd(newBook);
      setTitle('');
      setAuthor('');
    }
  };

  const titleId = useId();
  const authorId = useId();

  return (
    <form 
      onSubmit={handleSubmit}
      aria-label="Add new book form"
      id={formId}
    >
      <div>
        <label 
          htmlFor={titleId}
          id={`${titleId}-label`}
        >
          Book Title:
        </label>
        <input
          type="text"
          id={titleId}
          aria-labelledby={`${titleId}-label`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter book title"
          aria-required="true"
        />
      </div>
      <div>
        <label 
          htmlFor={authorId}
          id={`${authorId}-label`}
        >
          Author:
        </label>
        <input
          type="text"
          id={authorId}
          aria-labelledby={`${authorId}-label`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          placeholder="Enter author name"
          aria-required="true"
        />
      </div>
      <button 
        type="submit"
        aria-label="Add book to collection"
      >
        Add Book
      </button>
    </form>
  );
}

// Accessibility functions
function getLangAttribute() {
  const lang = document.documentElement.lang || 'en';
  return lang;
}

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

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const hasCaption = tableElement.querySelector('caption') !== null;
  const hasHeaders = tableElement.querySelectorAll('th').length > 0;
  return hasCaption && hasHeaders;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const hasThead = tableElement.querySelector('thead') !== null;
  const hasTbody = tableElement.querySelector('tbody') !== null;
  const rows = tableElement.querySelectorAll('tr');
  return hasThead && hasTbody && rows.length > 0;
}

function validateLandmark(element, expectedRole) {
  if (!element) return false;
  const role = element.getAttribute('role') || element.tagName.toLowerCase();
  return role === expectedRole;
}

function validateLandmarkStructure(landmarkElement) {
  if (!landmarkElement) return false;
  return landmarkElement.children.length > 0 || landmarkElement.textContent.trim().length > 0;
}

function validateLandmarkAccessibility(landmarkElements) {
  if (!Array.isArray(landmarkElements) || landmarkElements.length === 0) return false;
  const seenRoles = new Set();
  const seenLabels = new Set();
  for (const el of landmarkElements) {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';
    const key = `${role}::${label}`;
    if (seenRoles.has(role) && seenLabels.has(label)) {
      return false;
    }
    seenRoles.add(role);
    if (label) seenLabels.add(label);
  }
  return true;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  return (
    svgElement.getAttribute('aria-label') ||
    svgElement.getAttribute('aria-labelledby') ||
    svgElement.querySelector('title')?.textContent ||
    ''
  );
}

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

function validateLinkAccessibility(linkElement) {
  if (!linkElement) return false;
  const href = linkElement.getAttribute('href');
  const accessibleName = linkElement.getAttribute('aria-label') || linkElement.textContent.trim();
  return href !== null && href !== '' && href !== '#' && accessibleName.length > 0;
}

function handleFakeLinks(fakeLinkElements) {
  if (!Array.isArray(fakeLinkElements)) return;
  for (const el of fakeLinkElements) {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
      el.setAttribute('aria-label', 'Button');
    }
  }
}

// Main component
function Main() {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  const handleTitleSort = useCallback(() => {
    onTitleSort(dispatch, books);
  }, [dispatch, books]);

  const handleAuthorSort = useCallback(() => {
    onAuthorSort(dispatch, books);
  }, [dispatch, books]);

  useEffect(() => {
    if (sorting === sortByTitle) {
      handleTitleSort();
    } else if (sorting === sortByAuthor) {
      handleAuthorSort();
    }
  }, [sorting, handleTitleSort, handleAuthorSort]);

  const bookItems = books.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  const handleAddBook = (book) => {
    dispatch(addBook(book));
  };

  return (
    <main role="main" aria-label="Book list main content">
      <div role="region" aria-label="Sorting controls">
        <button 
          id="sort-by-title-button" 
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title in ascending order"
          type="button"
        >
          Sort by Title
        </button>
        <button 
          id="sort-by-author-button" 
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author in descending order"
          type="button"
        >
          Sort by Author
        </button>
      </div>
      <List dataSource={bookItems} />
      <section role="region" aria-label="Add new book form">
        <AddBookForm onAdd={handleAddBook} />
      </section>
      <section role="region" aria-label="Book dependency graph" aria-roledescription="dependencyGraph">
        <DependencyGraph 
          nodes={[]} 
          edges={[]} 
        />
      </section>
    </main>
  );
}

export default Main;

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
  setDependencyGraph,
  fetchBookDependencies,
  updateBookDependencies,
};