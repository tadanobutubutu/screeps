// TODO: Address accessibility issues from insight report
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

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonText, onClickHandler) {
  return (
    <button 
      onClick={onClickHandler}
      type="button"
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
  const errorId = 'add-book-error';

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
          aria-describedby={error ? errorId : undefined}
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
          aria-describedby={error ? errorId : undefined}
          placeholder="Enter author name"
          style={{ marginLeft: '8px' }}
        />
      </div>

      {error && (
        <div 
          id={errorId}
          role="alert" 
          aria-live="polite"
          style={{ color: 'red', marginBottom: '8px' }}
        >
          {error}
        </div>
      )}

      <button 
        type="submit"
        aria-describedby={error ? errorId : undefined}
      >
        Add Book
      </button>