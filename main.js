import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

const getBooksList = useSelector(state => state.books.list);
const dispatch = useDispatch();

function createButton(label, onClick, className = '', disabled = false) {
  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {label}
    </button>
  );
}

export function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

export function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

function generateKey(book) {
  return `book-${book.id || Math.random().toString(36).slice(2)}`;
}

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

function addBook(book) {
  dispatch({ type: 'ADD_BOOK', payload: book });
}

function addressAccessibilityIssues() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'a11y-live-region';
  document.body.appendChild(liveRegion);

  function announceToScreenReader(message) {
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 50);
    }
  }

  function manageFocus(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  function trapFocus(containerElement) {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    containerElement.addEventListener('keydown', handleTabKey);
    return () => containerElement.removeEventListener('keydown', handleTabKey);
  }

  return { announceToScreenReader, manageFocus, trapFocus };
}

function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!author.trim()) {
      setError('Author is required');
      return;
    }

    onAdd({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book form">
      <div role="group" aria-labelledby="add-book-heading">
        <h3 id="add-book-heading">Add a New Book</h3>
        <div>
          <label htmlFor="book-title-input">Book Title:</label>
          <input
            id="book-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            aria-invalid={!!error}
            placeholder="Enter book title"
          />
        </div>
        <div>
          <label htmlFor="book-author-input">Book Author:</label>
          <input
            id="book-author-input"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-required="true"
            aria-invalid={!!error}
            placeholder="Enter author name"
          />
        </div>
        {error && (
          <div role="alert" aria-live="polite">
            {error}
          </div>
        )}
        <button type="submit">Add Book</button>
      </div>
    </form>
  );
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute(lang = 'en') {
  document.documentElement.setAttribute('lang', lang);
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      table.setAttribute('aria-label', 'Data table');
    }
  });
}

function fixTableStructure() {
  document.querySelectorAll('table tr').forEach((row, index) => {
    if (row.querySelector('td') && !row.querySelector('th')) {
      const isHeader = confirm('Convert row to header row?');
      if (isHeader) {
        row.setAttribute('role', 'rowheader');
      }
    }
  });
}

function validateLandmarkStructure() {
  const requiredLandmarks = ['main', 'navigation', 'footer'];
  requiredLandmarks.forEach(id => {
    if (!document.getElementById(id)) {
      console.warn(`Missing landmark: ${id}`);
    }
  });
}

function validateLandmarkAttributes() {
  document.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (!role.trim()) {
      el.removeAttribute('role');
    }
  });
}

function addMainLandmark() {
  const main = document.createElement('main');
  main.id = 'main-content';
  main.setAttribute('role', 'main');
  document.body.insertBefore(main, document.body.firstChild);
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

function setSvgAttributes() {
  document.querySelectorAll('svg').forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (name) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', name);
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      console.warn(`Multiple ${role} landmarks found`);
    }
  });
}

function handleFakeLinks() {
  document.querySelectorAll('div[onclick], span[onclick]').forEach(el => {
    el.setAttribute('role', 'link');
    el.setAttribute('tabindex', '0');
  });
}

function addProperLandmarkRegions() {
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.insertBefore(header, document.body.firstChild);
  }
  if (!document.querySelector('nav')) {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    document.body.insertBefore(nav, document.body.firstChild);
  }
}

function createInPageButton() {
  return createButton('Jump to Top', () => window.scrollTo(0, 0), 'skip-link');
}

function validateLinkAccessibility() {
  document.querySelectorAll('a').forEach(link => {
    if (!link.getAttribute('href') && !link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

const defaultSorting = sortByTitle;

function onTitleSort() {
  const sortedList = [...getBooksList].sort(sortByTitle);
  dispatch({ type: 'SORT_BOOKS', payload: sortedList });
}

function onAuthorSort() {
  const sortedList = [...getBooksList].sort(sortByAuthor);
  dispatch({ type: 'SORT_BOOKS', payload: sortedList });
}

function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [a11y, setA11y] = useState({ announce: () => {}, manage: () => {} });

  useEffect(() => {
    const a11yUtils = addressAccessibilityIssues();
    setA11y({
      announce: a11yUtils.announceToScreenReader,
      manage: a11yUtils.manageFocus
    });
  }, []);

  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  const bookItems = getBooksList.map(book => <BookItem key={generateKey(book)} {...book} />);

  const handleAddBook = (book) => {
    addBook(book);
    a11y.announce('New book added successfully');
  };

  const handleSort = (sortFunction) => () => {
    setSorting(sortFunction);
  };

  return (
    <main id="main-content" role="main">
      <header role="banner">
        <h1>Book Library</h1>
        <div>
          <button onClick={handleSort(sortByTitle)}>Sort by Title</button>
          <button onClick={handleSort(sortByAuthor)}>Sort by Author</button>
        </div>
      </header>
      <AddBookForm onAdd={handleAddBook} />
      <List
        dataSource={getBooksList}
        renderItem={book => <BookItem {...book} />}
      />
    </main>
  );
}

export default Main;