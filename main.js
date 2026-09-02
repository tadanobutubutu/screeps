const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

function wrapPrimaryContentInMain() {
  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return null;
}

function countDependencies() {
  const importRegex = /import\s+(?:[\w*\s,{}]+\s+from\s+)?['"]([^'"]+)['"]/g;
  const dependencies = new Set();
  const source = countDependencies.toString() + '\n' + wrapPrimaryContentInMain.toString();
  let match;
  while ((match = importRegex.exec(source)) !== null) {
    dependencies.add(match[1]);
  }
  return dependencies.size;
}

import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';
import { useRef } from 'react';
import accessiblyHelper from './accessibly-helper';
import { calculateSum } from './utils/index.js';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils.js';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils.js';
import { CONFIG } from './utils/constants.js';
<<<<<<< HEAD
import { generateDependencyReport, utils, axe } from './utils';
import { fetchUser, clearCache } from './utils/user';
import * as newFunctions from './accessibilityFixes';
=======
>>>>>>> origin/main

// TODO: Implement the logic to handle the credential response
// This function should be called when a credential response is received
// For example, you might parse the response, validate it, and then store or use the credentials
>>>>>>>>>>>>>>>>>>>>>>>>> cdf78fb33c26049660d5284c95e3b8b08d16192b0ccdfa1b3c9b114e706ba5b0
function handleCredentialResponse(credentialResponse) {
  // Validate that credential response is provided
  if (!credentialResponse) {
    console.error('Credential response is required');
    return { success: false, error: 'Credential response is required' };
  }

  try {
    // Parse the credential response if it's a string
    let parsedResponse = credentialResponse;
    if (typeof credentialResponse === 'string') {
      parsedResponse = JSON.parse(credentialResponse);
    }

    // Validate the credential response structure
    const validationResult = validateCredentialResponse(parsedResponse);
    if (!validationResult.valid) {
      console.error('Credential response validation failed:', validationResult.errors);
      return { success: false, error: validationResult.errors.join(', ') };
    }

    // Extract and store credentials
    const credentialData = extractCredentialData(parsedResponse);

    // Store the credential data for later use
    storeCredentialData(credentialData);

    // Dispatch an action or callback to notify the application
    if (typeof onCredentialSuccess === 'function') {
      onCredentialSuccess(credentialData);
    }

    console.log('Credential response handled successfully');
    return { success: true, credentialData };

  } catch (error) {
    console.error('Error handling credential response:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

// Helper function to validate the credential response structure
function validateCredentialResponse(response) {
  const errors = [];

  // Check if response has required properties
  if (!response) {
    errors.push('Response is null or undefined');
    return { valid: false, errors };
  }

  // For WebAuthn/credential responses, validate the credential
  if (response.credential) {
    const credential = response.credential;
    if (!credential.id) {
      errors.push('Credential ID is missing');
    }
    if (!credential.type) {
      errors.push('Credential type is missing');
    }
  }

  // For token-based responses
  if (response.token || response.accessToken) {
    if (typeof (response.token || response.accessToken) !== 'string') {
      errors.push('Token must be a string');
    }
    if ((response.token || response.accessToken).trim() === '') {
      errors.push('Token cannot be empty');
    }
  }

  // For generic responses, check for data or payload
  if (!response.credential && !response.token && !response.accessToken && !response.data && !response.payload) {
    errors.push('Response must contain credential, token, accessToken, data, or payload');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Helper function to extract credential data from the response
function extractCredentialData(response) {
  return {
    id: response.credential?.id || response.id || null,
    type: response.credential?.type || response.type || 'credential',
    token: response.token || response.accessToken || null,
    data: response.data || response.payload || response.credential || null,
    timestamp: Date.now(),
    rawResponse: response
  };
}

// Helper function to store credential data
function storeCredentialData(credentialData) {
  try {
    // Store in session storage for session-based access
    if (credentialData.token) {
      sessionStorage.setItem('authToken', credentialData.token);
    }
    if (credentialData.id) {
      sessionStorage.setItem('credentialId', credentialData.id);
    }
    // Store full credential data in a serialized format
    sessionStorage.setItem('credentialData', JSON.stringify(credentialData));
  } catch (error) {
    console.warn('Unable to store credential data in session storage:', error);
  }
}

// Function to render a single book item
function BookItem({ book }) {
  return BookItemReact(book);
}

// Function to render the form for adding a new book entry
function BookForm() {
  const dispatch = useDispatch();
  const [formValid, setFormValid] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setFormValid(validateTitle(event.target.value));
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
    setFormValid(validateAuthor(event.target.value));
  };

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formValid) {
      const createdBook = await addBook(title, author);
      dispatch(setDependencyGraph(createdBook));
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          aria-label="Book title"
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={handleAuthorChange}
          aria-label="Book author"
        />
      </div>
      <div>
        <button type="submit">Add Book</button>
      </div>
    </form>
  );
}

// Validates the form fields on change
function validateTitle(title) {
  // Your validation logic here...
  return true;
}

function validateAuthor(author) {
  // Your validation logic here...
  return true;
}

// This is where you might handle the credential response
let onCredentialSuccess;
if (typeof window !== 'undefined') {
  window.addEventListener('credentialresponse', handleCredentialResponse);
}

// Initialize the application
function initializeApp(config) {
  return initializeAppReact(config);
}

// Initialize service workers
registerSW({ immediate: true });

// Fetch user data
function fetchUser(userId) {
  return fetchUserReact(userId);
}

// Clear cache
function clearCache() {
  store.dispatch(clearCacheAction());
}

// Define the initial state
const store = createStore(initialState);

const initialState = {
  books: [],
  dependencyGraph: null,
  credentialData: null
};

// Define actions
const addBookAction = (book) => ({ type: 'ADD_BOOK', payload: book });
const clearCacheAction = () => ({ type: 'CLEAR_CACHE' });

// Define reducers
function booksReducer(state = initialState.books, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      return [...state, action.payload];
    default:
      return state;
  }
}

function credentialDataReducer(state = initialState.credentialData, action) {
  switch (action.type) {
    case 'SET_CREDENTIAL_DATA':
      return action.payload;
    default:
      return state;
  }
}

// Define root reducer
const rootReducer = combineReducers({
  books: booksReducer,
  dependencyGraph: credentialDataReducer
});

// Create the store
export const store = createStore(rootReducer);

// Initialize the application
export async function initialize() {
  await promise;
}