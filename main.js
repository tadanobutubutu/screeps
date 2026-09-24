// main.js

// Find the primary content element in the DOM
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
    // Create a new <main> element
    const mainElement = document.createElement('main');

    // Insert the <main> element before the primary content in the DOM
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);

    // Move the primary content inside the <main> element
    mainElement.appendChild(primaryContent);

    return mainElement;
  }
  return null;
}

// Import necessary dependencies (modified to keep both changes)
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import express from 'express';
import path from 'path';
import { fetchUser, clearCache } from './utils/user';

// Function to ensure ARIA attributes are properly set for the dependency graph (merged change)
function setAriaAttributesForDependencyGraph() {
  const graphContainer = document.querySelector('.dependency-graph');
  if (graphContainer) {
    graphContainer.setAttribute('role', 'tree');
    graphContainer.setAttribute('aria-labelledby', 'dependency-graph-title');
  }
}

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

// Application state
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmarkMerged(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Ensure landmark uniqueness
function ensureLandmarkUniqueness(elements) {
  const elementsById = {};

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
    <div role="region" aria-label="Book list with sorting controls">
      <button 
        onClick={() => setSorting(sortByTitle)} 
        aria-label="Sort books by title in ascending order"
      >
        Sort by Title
      </button>
      <button 
        onClick={() => setSorting(sortByAuthor)} 
        aria-label="Sort books by author in descending order"
      >
        Sort by Author
      </button>
      <List 
        itemLayout="vertical" 
        dataSource={getBooksList} 
        renderItem={book => BookItem(book)} 
        role="list"
        aria-label="List of books"
      />
      {/* Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
    </div>
  );
}

// Initialize app
function initApp() {
  initializeApp();
  wrapPrimaryContentInMain();
  setAriaAttributesForDependencyGraph();
}

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function main() {
  initApp();
  setupHandlers();
  return processData;
}

// Utility functions for accessibility (environment-agnostic)
function getLangAttribute() {
  return typeof document !== 'undefined' && document.documentElement ? document.documentElement.lang : 'en';
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return a.author.localeCompare(b.author);
}

function generateKey(book) {
  return `${book.title}-${book.author}`.replace(/\s+/g, '-').toLowerCase();
}

function countDependencies(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  let count = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      count++;
      if (typeof obj[key] === 'object') {
        count += countDependencies(obj[key]);
      }
    }
  }
  return count;
}

// Validate landmark structure for accessibility issues
function validateLandmarkStructure() {
  const results = {
    hasMain: false,
    hasNav: false,
    hasHeader: false,
    hasFooter: false,
    issues: []
  };
  
  if (typeof document !== 'undefined' && document.querySelector) {
    // Check for main landmark - critical for screen reader navigation
    const mainElement = document.querySelector('main, [role="main"]');
    results.hasMain = mainElement !== null;
    
    // Check for navigation landmark
    const navElement = document.querySelector('nav, [role="navigation"]');
    results.hasNav = navElement !== null;
    
    // Check for header/banner landmark
    const headerElement = document.querySelector('header, [role="banner"]');
    results.hasHeader = headerElement !== null;
    
    // Check for footer landmark
    const footerElement = document.querySelector('footer, [role="contentinfo"]');
    results.hasFooter = footerElement !== null;
    
    // Report missing main landmark as critical issue
    if (!results.hasMain) {
      results.issues.push('Missing main landmark. Screen readers rely on this to identify primary content.');
    }
  }
  
  return results;
}

// Calculate sum utility
function calculateSum(a, b) {
  return a + b;
}

// Format date utility
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Helper utility
const helper = {
  formatDate,
  calculateSum
};

if (require.main === module) {
  main();
  console.log('Main function executed');
}

// Export functions for testing (only those defined in this file)
export {
  wrapPrimaryContentInMain,
  initializeApp,
  setAriaAttributesForDependencyGraph,
  validateLandmarkMerged,
  ensureLandmarkUniqueness,
  setupHandlers,
  validateInput,
  processData,
  main,
  config,
  appState
};

module.exports = {
  config,
  appState,
  validateLandmarkMerged,
  ensureLandmarkUniqueness,
  initializeApp,
  setupHandlers,
  validateInput,
  processData,
  main,
  getLangAttribute,
  sortByTitle,
  sortByAuthor,
  generateKey,
  countDependencies,
  validateLandmarkStructure,
  calculateSum,
  formatDate,
  helper
};