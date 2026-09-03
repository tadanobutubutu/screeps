// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// REACT_015: Add lang attribute
// REACT_017 & REACT_025: Fix and ensure unique landmarks
// REACT_027: Fix 26 table structure issues
// REACT_025: Ensure unique landmarks
// REACT_041: Add accessible names to 2 SVGs
// REACT_036: Fix 1 fake link issue
// REACT_037: Google sign-in logic
// REACT_040: Replace my-button with actual button id for accessibility
// REACT_042: Ensure dependencyGraph container has proper ARIA role

// main.js - Entry point for the application

// Module imports and configuration
const config = require('./config');
const logger = require('./utils/logger');
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');

// Configuration - merged
const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data'
};

// Application state
const appState = {
    initialized: false,
    data: null,
    cache: {}
};

// Export functions for addressing accessibility issues
const ensureLangAttribute = () => {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
};

const fixLandmarks = () => {
  // ... Rest of the fixLandmarks function implementation
};

const addSvgAccessibleNames = () => {
  // ... Rest of the addSvgAccessibleNames function implementation
};

const fixFakeLinks = () => {
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
  const booksPath = path.join(__dirname, config.dataPath, 'books.json');
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

// Endpoint for adding a new book with accessibility validation
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
  const booksPath = path.join(__dirname, config.dataPath, 'books.json');
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
  const booksPath = path.join(__dirname, config.dataPath, 'books.json');
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
  const booksPath = path.join(__dirname, config.dataPath, 'books.json');
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
      isbn: bookData.isbn ? bookData.isbn.trim() : books[book