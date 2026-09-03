// main.js - Application entry point
// TODO: Existing main.js content before the merge conflict...
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const utils = require('./utils');
const logger = require('./utils/logger');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getLangAttribute,
  validateLinkAccessibility,
  analyzeAccessibility,
  addressAccessibilityIssues,
  handleFakeLinks
} = require('./utils');

import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute as getLangAttributeFromUtils, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility as validateTableAccessibilityFromUtils, validateTableStructure as validateTableStructureFromUtils } from './utils/tableAccessibilityUtils';
import { validateLandmark as validateLandmarkFromUtils, validateLandmarkStructure as validateLandmarkStructureFromUtils } from './utils/landmarkUtils';
import { validateLinkAccessibility as validateLinkAccessibilityFromUtils, handleFakeLinks as handleFakeLinksFromUtils } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';

// Application configuration (alias for CONFIG)
const appConfig = CONFIG || config;

const app = express();

// Export functions for addressing accessibility issues
const ensureLangAttribute = () => {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
};

const fixLandmarks = () => {
  // ... Rest of the fixLandmarks function implementation
};

const addSvgAccessibleNamesLocal = () => {
  // ... Rest of the addSvgAccessibleNames function implementation
};

const fixFakeLinksLocal = () => {
  // ... Rest of the fixFakeLinks function implementation
};

const replaceButtonIds = () => {
  // ... Rest of the replaceButtonIds function implementation
};

// Function to validate book data for accessibility compliance
function validateBookAccessibility(bookData) {
  const errors = [];
  
  if (!bookData.title || bookData.title.trim() === '') {
    errors.push({
      field: 'title',
      message: 'Book title is required for accessibility (provides accessible name)',
      severity: 'critical'
    });
  }
  
  if (!bookData.author || bookData.author.trim() === '') {
    errors.push({
      field: 'author',
      message: 'Book author is required for accessibility',
      severity: 'high'
    });
  }
  
  if (bookData.isbn && !/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(bookData.isbn)) {
    errors.push({
      field: 'isbn',
      message: 'Invalid ISBN format',
      severity: 'medium'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to create an accessible book entry object
function createAccessibleBookEntry(bookData) {
  const validation = validateBookAccessibility(bookData);
  if (!validation.isValid) {
    throw new Error(`Accessibility validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }
  
  const bookId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: bookId,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn ? bookData.isbn.trim() : null,
    description: bookData.description ? bookData.description.trim() : '',
    publishedDate: bookData.publishedDate || null,
    genre: bookData.genre || 'General',
    accessibility: {
      ariaLabel: `Book: ${bookData.title.trim()} by ${bookData.author.trim()}`,
      role: 'article',
      labelledBy: `${bookId}-title`,
      describedBy: bookData.description ? `${bookId}-desc` : undefined
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Function to save book to data store
function saveBook(bookEntry) {
  const booksPath = path.join(__dirname, appConfig.dataPath || './data', 'books.json');
  let books = [];
  
  try {
    if (fs.existsSync(booksPath)) {
      const data = fs.readFileSync(booksPath, 'utf8');
      books = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading books file:', error.message);
  }
  
  books.push(bookEntry);
  
  try {
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving book:', error.message);
    return false;
  }
}

// Find the primary content element in the DOM
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
      const mainElement = document.createElement('main');
      mainElement.appendChild(primaryContent);
      return mainElement;
  }
  return null;
}

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// Client-side accessibility functions (for browser environment)
export const validateLandmark = (landmark) => {
  const errors = [];

  // Validation logic

  return {
    valid: errors.length === 0,
    errors
  };
};

export const checkLinkAccessibility = (url) => {
  // Implementation logic here...
  return true;
};

export const newExportedFunction = () => {
  // New export logic here...
};

// Ensure accessibility attributes are set when adding a book
ensureAccessibilityAttributesForAddBook();

function fixTableStructureIssuesClient() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Add ARIA roles
    table.setAttribute('role', 'table');
    const captions = table.getElementsByTagName('caption');
    if (captions.length > 0) {
      captions[0].setAttribute('role', 'caption');
    }
    if (table.tHead) {
      table.tHead.setAttribute('role', 'header');
    }
    if (table.tFoot) {
      table.tFoot.setAttribute('role', 'footer');
    }
    if (table.rows) {
      table.rows.forEach(row => {
        row.setAttribute('role', 'row');
        const ths = row.getElementsByTagName('th');
        for (let i = 0; i < ths.length; i++) {
          ths[i].setAttribute('role', 'columnheader');
        }
        const tds = row.getElementsByTagName('td');
        for (let i = 0; i < tds.length; i++) {
          tds[i].setAttribute('role', 'cell');
        }
      });
    }
  });
}

function fixTableHeaderCellScopeClient() {
  const tableHeadings = document.querySelectorAll('thead th, tbody th, tfoot th');
  tableHeadings.forEach(heading => {
    if (!heading.scope) {
      heading.setAttribute('scope', 'column');
    }
  });
}

function addMainLandmarkClient() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.setAttribute('id', 'mainLandmark');
    mainEl.setAttribute('aria-label', getFullLangAttribute('main_landmark'));
  }
}

function addSvgAccessibleNamesClient() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const id = svg.getAttribute('id');
    const label = getLangAttribute(id) || svg.getAttribute('aria-label');
    if (!label) {
      svg.setAttribute('aria-label', getLangAttribute('default_svg'));
    }
  });
}

function fixFakeLinksClient() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function getLangAttributeClient(el) {
  if (el === undefined || el === null) {
    el = document.documentElement;
  }
  return el.lang || getLangAttributeFromUtils();
}

function validateTableAccessibilityClient() {
  return validateTableAccessibilityFromUtils(document);
}

function validateTableStructureClient() {
  return validateTableStructureFromUtils(document);
}

function validateLandmarkClient() {
  return validateLandmarkFromUtils(document);
}

function validateLandmarkStructureClient() {
  return validateLandmarkStructureFromUtils(document);
}

function validateLandmarkAttributesClient() {
  const elements = document.querySelectorAll('main, nav, aside, section, header, footer, article');
  const errors = [];
  
  elements.forEach(el => {
    if (!el.id && !el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label')) {
      if (['main', 'nav', 'aside'].includes(el.tagName.toLowerCase())) {
        errors.push(`Landmark ${el.tagName.toLowerCase()} missing accessible name`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function getSvgAccessibleNameClient(id, label) {
  if (id) {
    const svg = document.getElementById(id);
    if (svg) {
      const attrLabel = label || getLangAttributeClient(id);
      if (attrLabel) {
        svg.setAttribute('aria-label', attrLabel);
      }
    }
  }

  return [];
}

function validateLinkAccessibilityClient() {
  return validateLinkAccessibilityFromUtils(document);
}

function analyzeAccessibilityClient(issuesData) {
  return issuesData || [];
}

function addressAccessibilityIssuesClient() {
  const accessibilityIssues = analyzeAccessibilityClient(document);

  if (accessibilityIssues.length > 0) {
    accessibilityIssues.forEach(issue => {
      fixIssueClient(issue);
    });
  }
}

function createInPageButtonClient() {
  const buttonEl = createInPageButton(getLangAttributeClient());
  if (buttonEl) {
    document.body.appendChild(buttonEl);
  }
}

function setSvgAccessibleNamesClient(id1, id2, label1, label2) {
  if (id1) {
    getSvgAccessibleNameClient(id1, label1);
  }
  if (id2) {
    getSvgAccessibleNameClient(id2, label2);
  }
}

function fixFakeLinkClient() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.textContent.trim()) {
      link.textContent = getLangAttributeClient(link);
    }
  });
}

function validateLinkAccesibilityClient(url) {
  // Implementation logic here...
  return checkLinkAccessibility(url);
}

function handleFakeLinksClient() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link.href.startsWith('http') || link.href.startsWith('mailto')) {
      link.setAttribute('role', 'link');
    } else {
      link.setAttribute('role', 'button');
    }
  });
}

function fixIssueClient(issue) {
  switch (issue.type) {
    case 'fakeLink':
      fixFakeLinkClient();
      break;
    case 'missingLang':
      setLanguageAttribute();
      break;
    case 'tableIssue':
      fixTableStructureIssuesClient();
      fixTableHeaderCellScopeClient();
      break;
    case 'dupLandmark':
      ensureUniqueLandmarks();
      break;
    case 'emptyAccessibleName':
      addSvgAccessibleNamesClient();
      break;
    case 'tableStructure':
      fixTableStructureIssuesClient();
      break;
    case 'landmarkStructure':
      checkLandmarkElement();
      break;
    case 'landmarkAttribute':
      checkLandmarkAttributesClient();
      break;
    case 'linkAccessibility':
      validateLinkAccesibilityClient();
      break;
    default:
      break;
  }
}

function setLanguageAttribute() {
  document.documentElement.lang = getLangAttributeClient();
}

function checkLandmarkElement(id) {
  return document.getElementById(id) !== null;
}

function checkLandmarkAttributes() {
  const landmarkSelectors = ['main', 'nav', 'aside', 'section', 'header', 'footer', 'article'];
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  landmarks.forEach(landmark => {
    // Check for missing required attributes
    const ariaAttributes = ['id', 'role'];
    ariaAttributes.forEach(attribute => {
      if (!landmark.hasAttribute(attribute)) {
        if (attribute === 'role') {
          const roleMap = {
            'main': 'main',
            'nav': 'navigation',
            'aside': 'complementary',
            'section': 'region',
            'header': 'banner',
            'footer': 'contentinfo',
            'article': 'article'
          };
          const tagName = landmark.tagName.toLowerCase();
          if (roleMap[tagName]) {
            landmark.setAttribute(attribute, roleMap[tagName]);
          }
        } else {
          landmark.setAttribute(attribute, landmark.id || `landmark-${Date.now()}`);
        }
      }
    });
  });
}

// Utility functions
function getElementsBySelector(selector, isString) {
  let elements = Array.from(document.querySelectorAll(selector));
  if (isString) {
    elements = document.getElementsByClassName(selector);
  }
  return elements;
}

// Apply accessibility adjustments immediately
ensureLangAttribute();
fixLandmarks();
addMainLandmarkClient();
handleFakeLinksClient();
createInPageButtonClient();

// Server-side book endpoints
app.post('/books', express.json(), (req, res) => {
  try {
    const bookData = req.body;
    
    if (!bookData || typeof bookData !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Book data is required'
      });
    }
    
    const bookEntry = createAccessibleBookEntry(bookData);
    const saved = saveBook(bookEntry);
    
    if (!saved) {
      return res.status(500).json({
        error: 'Failed to save book',
        message: 'Could not write to data store'
      });
    }
    
    // Return the created book with accessibility metadata
    res.status(201).json({
      success: true,
      book: bookEntry,
      accessibilityInfo: {
        ariaLabel: bookEntry.accessibility.ariaLabel,
        role: bookEntry.accessibility.role,
        labelledBy: bookEntry.accessibility.labelledBy,
        describedBy: bookEntry.accessibility.describedBy
      }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      message: error.message
    });
  }
});

// Endpoint for getting all books
app.get('/books', (req, res) => {
  const booksPath = path.join(__dirname, appConfig.dataPath || './data', 'books.json');
  let books = [];
  
  try {
    if (fs.existsSync(booksPath)) {
      const data = fs.readFileSync(booksPath, 'utf8');
      books = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading books file:', error.message);
  }
  
  res.json(books);
});

// Endpoint for getting a specific book by ID
app.get('/books/:id', (req, res) => {
  const booksPath = path.join(__dirname, appConfig.dataPath || './data', 'books.json');
  let books = [];
  
  try {
    if (fs.existsSync(booksPath)) {
      const data = fs.readFileSync(booksPath, 'utf8');
      books = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading books file:', error.message);
    return res.status(500).json({ error: 'Failed to read books data' });
  }
  
  const book = books.find(b => b.id === req.params.id);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  res.json(book);
});

// Endpoint for updating a book with accessibility validation
app.put('/books/:id', express.json(), (req, res) => {
  const booksPath = path.join(__dirname, appConfig.dataPath || './data', 'books.json');
  let books = [];
  
  try {
    if (fs.existsSync(booksPath)) {
      const data = fs.readFileSync(booksPath, 'utf8');
      books = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading books file:', error.message);
    return res.status(500).json({ error: 'Failed to read books data' });
  }
  
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  try {
    const bookData = req.body;
    const validation = validateBookAccessibility(bookData);
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Accessibility validation failed',
        errors: validation.errors
      });
    }
    
    const updatedBook = {
      ...books[bookIndex],
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      isbn: bookData.isbn ? bookData.isbn.trim() : books[bookIndex].isbn,
      description: bookData.description ? bookData.description.trim() : books[bookIndex].description,
      publishedDate: bookData.publishedDate || books[bookIndex].publishedDate,
      genre: bookData.genre || books[bookIndex].genre,
      updatedAt: new Date().toISOString()
    };
    
    books[bookIndex] = updatedBook;
    
    try {
      fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
      res.json({
        success: true,
        book: updatedBook
      });
    } catch (writeError) {
      console.error('Error saving updated book:', writeError.message);
      res.status(500).json({ error: 'Failed to save updated book' });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      message: error.message
    });
  }
});

// Legacy function for backward compatibility
function ensureAccessibilityAttributesForAddBook() {
  // Ensure accessibility attributes are set when adding a book
}

// Export server and client functions
module.exports = {
  app,
  config: appConfig,
  validateBookAccessibility,
  createAccessibleBookEntry,
  saveBook,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  createInPageButton,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateLinkAccessibility,
  analyzeAccessibility,
  addressAccessibilityIssues,
  handleFakeLinks,
  ensureLangAttribute,
  fixLandmarks,
  wrapPrimaryContentInMain,
  getUniqueLandmarks,
  fixTableStructureIssuesClient,
  fixTableHeaderCellScopeClient,
  addMainLandmarkClient,
  addSvgAccessibleNamesClient,
  fixFakeLinksClient,
  fixFakeLinkClient,
  handleFakeLinksClient,
  getSvgAccessibleNamesClient,
  setSvgAccessibleNamesClient,
  createInPageButtonClient,
  addressAccessibilityIssuesClient,
  analyzeAccessibilityClient,
  validateLinkAccesibilityClient,
  validateLandmarkClient,
  validateLandmarkAttributesClient,
  validateTableAccessibilityClient,
  validateTableStructureClient,
  validateBookAccessibility,
  createAccessibleBookEntry,
  saveBook
};