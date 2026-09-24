import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } from './accessibility';

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

  // Add landmark roles and fix landmark issues
  const landmarkProps = getLandmarkProps('main');

  // Add accessible names to SVGs
  const svgAccessibilityProps = getSvgAccessibilityProps();

  // Fix fake link issue
  const accessibleLinkProps = getAccessibleLinkProps();

  const handleAddBook = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
  }

  // Add keyboard navigation support
  element.setAttribute('tabIndex', '0');

  // Add focus styles for keyboard users
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    [tabindex="0"]:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(focusStyle);

  return element;
}

// Improve accessibility for adding a new book
function enhanceAccessibilityForAddBook(formElement) {
  if (!formElement) return;

  // Ensure the form has an accessible name
  if (!formElement.getAttribute('aria-label') && !formElement.getAttribute('aria-labelledby')) {
    formElement.setAttribute('aria-label', 'Add a new book');
  }

  // Ensure all inputs have associated labels
  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const inputId = input.id || `add-book-input-${index + 1}`;
    if (!input.id) {
      input.id = inputId;
    }

    const headers = table.querySelectorAll('th');
    const cells = table.querySelectorAll('td, th');

    cells.forEach(cell => {
      if (!cell.hasAttribute('scope') && !cell.hasAttribute('headers')) {
        const isHeader = cell.tagName === 'TH';
        if (isHeader) {
          cell.setAttribute('scope', 'col');
        }
      }
    });
  });
}

function fixLandmarks() {
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarkCounts = {};

  landmarkSelectors.forEach(selector => {
    landmarkCounts[selector] = 0;
  });

  document.querySelectorAll(landmarkSelectors.join(', ')).forEach(element => {
    const tagName = element.tagName.toLowerCase();

    if (landmarkCounts[tagName] > 0 && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      landmarkCounts[tagName]++;
      element.setAttribute('aria-label', `${tagName}-${landmarkCounts[tagName]}`);
    } else if (landmarkCounts[tagName] === 0) {
      landmarkCounts[tagName]++;
    }
  });
}

// New function for REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// New function for REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles() {
  const landmarks = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    footer: 'contentinfo',
    aside: 'complementary',
    section: 'region',
    article: 'article'
  };

  Object.keys(landmarks).forEach(tag => {
    document.querySelectorAll(tag).forEach(element => {
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', landmarks[tag]);
      }
    });
  });
}

  // Render the list of book items and sorting controls
  const listItems = booksList.map(book => BookItem(book));
  return (
    <main id="main" lang="en" {...useLandmark('main')} {...landmarkProps}>
      <div {...addLangAttribute('main')}>
        <div>
          <button onClick={handleSort(sortByTitle)}>Sort by Title</button>
          <button onClick={handleSort(sortByAuthor)}>Sort by Author</button>
        </div>
        <List
          itemLayout="vertical"
          dataSource={listItems}
          renderItem={book => (
            <List.Item key={generateKey(book)}>
              <BookItem book={book} />
            </List.Item>
          )}
        />
        {/* Accessible form for adding a new book */}
        <form onSubmit={handleAddBook} aria-label="Add new book">
          <div>
            <label htmlFor="book-title">Book Title:</label>
            <input
              id="book-title"
              type="text"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              ref={addBookInputRef}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="book-author">Author:</label>
            <input
              id="book-author"
              type="text"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <button type="submit">Add Book</button>
        </form>
      </div>
    </main>
  );
};

export default Main;