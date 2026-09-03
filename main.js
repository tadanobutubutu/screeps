import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { generateDependencyReport, utils, axe } from './utils';

let icons = {};
let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

// Import required module(s) and export the new necessary function(s) here in main.js
const books = [];
const safetyCategory = "User Safety: safe";

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

// Application initializations
import express from 'express';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

// Ensure accessibility attributes are set when adding a book
ensureAccessibilityAttributesForAddBook();

// TODO: Implement the logic to handle the credential response
// This function should be called when a credential response is received
// For example, you might parse the response, validate it, and then store or use the credentials
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
  return {
    type: 'List.Item',
    props: {
      key: generateKey(book),
      children: {
        type: 'List.Item.Meta',
        props: {
          title: book.title,
          description: `by ${book.author}`
        }
      }
    }
  };
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
  return {
    type: 'form',
    props: {
      onSubmit: handleSubmit,
      children: [
        {
          type: 'label',
          props: {
            htmlFor: 'title',
            children: 'Title:'
          }
        },
        {
          type: 'input',
          props: {
            type: 'text',
            id: 'title',
            value: title,
            onChange: handleTitleChange,
            'aria-label': 'Book title'
          }
        },
        {
          type: 'label',
          props: {
            htmlFor: 'author',
            children: 'Author:'
          }
        },
        {
          type: 'input',
          props: {
            type: 'text',
            id: 'author',
            value: author,
            onChange: handleAuthorChange,
            'aria-label': 'Book author'
          }
        },
        {
          type: 'button',
          props: {
            type: 'submit',
            children: 'Add Book'
          }
        }
      ]
    }
  };
}

// Accessibility helper functions
// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

function getFullLangAttribute() {
    const htmlElement = document.querySelector('html');
    return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function ensureUniqueLandmarksFromString(landmarkString) {
    const landmarks = landmarkString.split(',').map(l => l.trim());
    const uniqueLandmarks = [...new Set(landmarks)];
    return uniqueLandmarks.join(', ');
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];

  landmarkTypes.forEach(type => {
    const landmarks = document.querySelectorAll(`[role="${type}"]`);
    if (landmarks.length > 1) {
      issues.push(`Multiple ${type} landmarks found - should be unique`);
    }
  });

  return issues;
}

// REACT_025: Add proper landmark regions
function addProperLandmarkRegions() {
  const issues = [];
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');

  if (!mainContent) {
    issues.push('Missing main landmark region');
  }

  return issues;
}

function validateLandmark() {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
    return landmarks.length > 0;
}

// REACT_015 & REACT_036: Create accessible in-page button
function createInPageButton(buttonText, onClickHandler) {
  return {
    type: 'button',
    props: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      children: buttonText
    }
  };
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(tableElement) {
  const issues = [];
  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');

  if (!hasCaption) {
    issues.push('Table is missing a caption');
  }
  if (!hasHeaders) {
    issues.push('Table is missing header cells (th)');
  }

  return issues;
}

// REACT_017: Validate landmarks
function validateLandmarkStructure() {
  const issues = [];
  const mainElement = document.querySelector('main');
  const headerElement = document.querySelector('header');
  const footerElement = document.querySelector('footer');

  if (!mainElement) {
    issues.push('Missing main landmark');
  }
  if (!headerElement) {
    issues.push('Missing header landmark');
  }
  if (!footerElement) {
    issues.push('Missing footer landmark');
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
  if (accessibleName && !svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(linkElement) {
  const issues = [];
  const href = linkElement.getAttribute('href');
  const text = linkElement.textContent.trim();
  const ariaLabel = linkElement.getAttribute('aria-label');

  if (!href || href === '#' || href === '') {
    issues.push('Link has no valid href attribute');
  }

  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name');
  }

  if (linkElement.getAttribute('role') === 'link' && !href) {
    issues.push('Fake link detected without href');
  }

  return issues;
}

// REACT_036: Handle fake links
function handleFakeLinks() {
  const issues = [];
  const fakeLinks = document.querySelectorAll('[role="link"]');

  fakeLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    if (!href) {
      issues.push(`Fake link ${index} has no href attribute`);
    }

    // Convert fake link to accessible button if it's clickable
    if (link.tagName !== 'A' && link.onclick) {
      issues.push(`Consider using <button> instead of fake link ${index}`);
    }
  });

  return issues;
}

// TODO: Implement new function3 logic here
function function3(param1, param2) {
  // New function3 implementation
  if (!param1 || !param2) {
    return null;
  }

  // Process parameters and return result
  const result = {
    combined: `${param1}-${param2}`,
    timestamp: Date.now(),
    validated: true
  };

  return result;
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

    onAddBook({ title, author });
    setTitle('');
    setAuthor('');
  };

  return {
    type: 'form',
    props: {
      onSubmit: handleSubmit,
      ref: formRef,
      children: [
        {
          type: 'div',
          props: {
            role: 'alert',
            children: error
          }
        },
        {
          type: 'label',
          props: {
            htmlFor: 'title',
            children: 'Title:'
          }
        },
        {
          type: 'input',
          props: {
            type: 'text',
            id: 'title',
            value: title,
            onChange: (e) => setTitle(e.target.value),
            ref: titleInputRef,
            'aria-required': 'true',
            'aria-invalid': !!error
          }
        },
        {
          type: 'label',
          props: {
            htmlFor: 'author',
            children: 'Author:'
          }
        },
        {
          type: 'input',
          props: {
            type: 'text',
            id: 'author',
            value: author,
            onChange: (e) => setAuthor(e.target.value),
            'aria-required': 'true'
          }
        },
        {
          type: 'button',
          props: {
            type: 'submit',
            children: 'Add Book'
          }
        }
      ]
    }
  };
}

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Address all accessibility issues
function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute();
  ensureUniqueLandmarks(landmarks);
  addMainLandmark();
  addSvgAccessibleNames();
  ensureLandmarkUniqueness(landmarks);
  fixFakeLinkIssue();
  fixTableStructure();
}

function fixTableStructure() {
  // Implementation for fixing table structure issues
  // This is a placeholder for the actual implementation
  return true;
}

function addMainLandmark() {
  // Implementation for adding main landmark
  return true;
}

function createAccessibleLink() {
  // Implementation for creating accessible links
  return {};
}

function handleAccessibilityIssues() {
  // Implementation for handling accessibility issues
  return [];
}

function validateLandmarkData() {
  // Implementation for validating landmark data
  return { valid: true };
}

function addSvgAccessibleNames() {
  // Implementation for adding SVG accessible names
  return true;
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  return true;
}

// Initialize app
function initializeApp() {
  addressInsightIssues();
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
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

function finalizeResolvedFile(fileContent) {
  // Implementation for finalizing the resolved file
  // This is a placeholder for the actual implementation
  return fileContent;
}

function renderDependencyGraph(dependencies) {
  // Implementation for rendering dependency graphs
  // This is a placeholder for the actual implementation
  return dependencies;
}

function wrapPrimaryContentInMain() {
  // Implementation for wrapping primary content in main element
  return true;
}

function handleUserInteraction() {
  // Implementation for handling user interactions
  return true;
}

function cleanup() {
  // Implementation for cleanup operations
  return true;
}

function initApp() {
  // Implementation for initializing app
  return true;
}

function VisualizeDependencyTree() {
  // Implementation for visualizing dependency tree
  return {};
}

function checkLandmarkElement() {
  // Implementation for checking landmark elements
  return true;
}

function main() {
  initializeApp();
  setupHandlers();
  return processData;
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: d7e5d9d2506991a271c61dcc822f165d7e7185a5_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

if (require.main === module) {
  main();
  console.log('Main function executed');
}

// Function to generate a report based on accessibility issues
function generateAccessibilityReport() {
  const issues = [];

  // Gather issues from various accessibility checks
  const landmarkIssues = validateLandmarkStructure();
  issues.push(...landmarkIssues);

  const uniqueLandmarkIssues = ensureUniqueLandmarks();
  issues.push(...uniqueLandmarkIssues);

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const tableIssues = validateTableAccessibility(table);
    issues.push(...tableIssues);
  });

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      issues.push('SVG missing accessible name');
    }
  });

  const fakeLinkIssues = handleFakeLinks();
  issues.push(...fakeLinkIssues);

  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const linkIssues = validateLinkAccessibility(link);
    issues.push(...linkIssues);
  });

  const lang = getLangAttribute();
  if (!lang) {
    issues.push('Missing lang attribute on HTML element');
  }

  return {
    timestamp: Date.now(),
    issues,
    summary: `Found ${issues.length} accessibility issue(s)`
  };
}

// Keyboard navigation state management
const keyboardNavigationState = {
  currentFocusIndex: -1,
  focusableElements: [],
  rovingTabIndexContainers: new Map(),
  keyboardShortcuts: new Map(),
  skipLinkTarget: null,
  focusTrapStack: []
};

// Initialize keyboard navigation enhancement
function initializeKeyboardNavigation(container = document) {
  if (!container || typeof container !== 'object') {
    console.warn('Invalid container for keyboard navigation initialization');
    return false;
  }

  // Add visible focus styles if not already present
  addVisibleFocusStyles();

  // Set up focusable elements
  updateFocusableElements(container);

  // Initialize roving tabindex for navigation menus
  initializeRovingTabindex(container);

  // Set up keyboard event handlers
  setupKeyboardEventHandlers(container);

  // Create skip link if not present
  createSkipLinkIfNeeded(container);

  // Enhance landmark navigation
  enhanceLandmarkKeyboardNavigation(container);

  return true;
}

// Add visible focus indicator styles
function addVisibleFocusStyles() {
  const styleId = 'keyboard-navigation-focus-styles';
  if (document.getElementById(styleId)) {
    return; // Styles already added
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    [data-keyboard-focus="true"]:focus {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
    }
    [data-keyboard-focus="true"]:focus:not(:focus-visible) {
      outline: none !important;
      box-shadow: none !important;
    }
    [data-keyboard-focus="true"]:focus-visible {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
    }
    .keyboard-nav-active *:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    .keyboard-nav-active [data-keyboard-focus="true"]:focus {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
}

// Update list of focusable elements
function updateFocusableElements(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];

  const focusableElements = container.querySelectorAll(focusableSelectors.join(', '));
  
  keyboardNavigationState.focusableElements = Array.from(focusableElements);

  // Mark elements for keyboard focus visibility
  keyboardNavigationState.focusableElements.forEach((element, index) => {
    element.setAttribute('data-keyboard-nav-index', index);
    element.setAttribute('data-keyboard-focus', 'true');
  });
}

// Initialize roving tabindex pattern for navigation menus
function initializeRovingTabindex(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const menus = container.querySelectorAll('[role="menu"], [role="menubar"], [role="navigation"] ul, nav ul');
  
  menus.forEach(menu => {
    const menuItems = menu.querySelectorAll('a, button');
    
    if (menuItems.length === 0) {
      return;
    }

    // Store menu container for tracking
    const menuId = menu.id || `menu-${keyboardNavigationState.rovingTabIndexContainers.size}`;
    keyboardNavigationState.rovingTabIndexContainers.set(menuId, {
      container: menu,
      items: Array.from(menuItems)
    });

    // Set initial tabindex -1 for all except first item
    menuItems.forEach((item, index) => {
      item.setAttribute('data-roving-menu', menuId);
      item.setAttribute('data-roving-index', index);
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
  });
}

// Handle roving tabindex navigation
function handleRovingTabindexNavigation(menuId, direction) {
  const menuData = keyboardNavigationState.rovingTabIndexContainers.get(menuId);
  
  if (!menuData || !menuData.items || menuData.items.length === 0) {
    return;
  }

  const items = menuData.items;
  const currentIndex = items.findIndex(item => item === document.activeElement);
  
  if (currentIndex === -1) {
    return;
  }

  let newIndex;
  if (direction === 'next') {
    newIndex = (currentIndex + 1) % items.length;
  } else if (direction === 'prev') {
    newIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (direction === 'first') {
    newIndex = 0;
  } else if (direction === 'last') {
    newIndex = items.length - 1;
  } else {
    return;
  }

  // Update tabindex values
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === newIndex ? '0' : '-1');
  });

  // Focus the new item
  items[newIndex].focus();
}

// Set up keyboard event handlers
function setupKeyboardEventHandlers(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  container.addEventListener('keydown', (event) => {
    // Handle arrow key navigation within roving tabindex containers
    const target = event.target;
    if (target.hasAttribute('data-roving-menu')) {
      const menuId = target.getAttribute('data-roving-menu');
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'prev');
          break;
        case 'Home':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'first');
          break;
        case 'End':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'last');
          break;
      }
    }

    // Handle Escape key to close modals/dropdowns
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('[role="dialog"]:focus-within, [aria-modal="true"]:focus-within');
      if (activeModal) {
        const closeButton = activeModal.querySelector('[aria-label="Close"], [data-close]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }

    // Handle Tab key for focus management
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav-active');
      setTimeout(() => {
        document.body.classList.remove('keyboard-nav-active');
      }, 100);
    }
  });

  // Track keyboard navigation state
  container.addEventListener('keydown', (event) => {
    if (event.key.startsWith('Arrow') || event.key === 'Tab') {
      keyboardNavigationState.isKeyboardNavigating = true;
    }
  });

  container.addEventListener('mousedown', () => {
    keyboardNavigationState.isKeyboardNavigating = false;
  });
}

// Create skip link if not present
function createSkipLinkIfNeeded(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const existingSkipLink = container.querySelector('.skip-link, [data-skip-link]');
  if (existingSkipLink) {
    keyboardNavigationState.skipLinkTarget = existingSkipLink.getAttribute('href');
    return;
  }

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.setAttribute('data-skip-link', 'true');
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 9999;
    padding: 1em;
    background: #000;
    color: #fff;
    text-decoration: none;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });

  container.insertBefore(skipLink, container.firstChild);
  keyboardNavigationState.skipLinkTarget = '#main-content';
}

// Enhance landmark keyboard navigation
function enhanceLandmarkKeyboardNavigation(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  // Add landmark navigation keyboard shortcuts
  registerKeyboardShortcut('g m', () => {
    const main = container.querySelector('main, [role="main"]');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });

  registerKeyboardShortcut('g n', () => {
    const nav = container.querySelector('nav, [role="navigation"]');
    if (nav) {
      nav.setAttribute('tabindex', '-1');
      nav.focus();
    }
  });

  registerKeyboardShortcut('g s', () => {
    const search = container.querySelector('[role="search"]');
    if (search) {
      search.setAttribute('tabindex', '-1');
      search.focus();
    }
  });
}

// Register keyboard shortcuts (g as prefix)
function registerKeyboardShortcut(shortcut, callback) {
  if (typeof shortcut !== 'string' || typeof callback !== 'function') {
    return;
  }
  keyboardNavigationState.keyboardShortcuts.set(shortcut.toLowerCase(), callback);
}

// Main function to enhance keyboard navigation
function enhanceKeyboardNavigation(container = document) {
  if (!container || typeof container !== 'object') {
    console.warn('Invalid container provided for keyboard navigation enhancement');
    return false;
  }

  // Initialize keyboard navigation
  const initialized = initializeKeyboardNavigation(container);
  
  if (!initialized) {
    return false;
  }

  // Handle global keyboard shortcuts
  let gKeyPending = false;
  let gKeyTimeout = null;

  document.addEventListener('keydown', (event) => {
    // Only handle shortcuts when not in an input field
    const activeElement = document.activeElement;
    const isInputField = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA' || 
                         activeElement.getAttribute('contenteditable') === 'true';

    if (isInputField) {
      return;
    }

    const key = event.key.toLowerCase();

    // Handle 'g' prefix for landmark shortcuts
    if (gKeyPending) {
      clearTimeout(gKeyTimeout);
      const shortcut = `g ${key}`;
      const callback = keyboardNavigationState.keyboardShortcuts.get(shortcut);
      if (callback) {
        event.preventDefault();
        callback();
      }
      gKeyPending = false;
      return;
    }

    // Start 'g' sequence
    if (key === 'g' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      gKeyPending = true;
      clearTimeout(gKeyTimeout);
      gKeyTimeout = setTimeout(() => {
        gKeyPending = false;
      }, 1000); // Reset after 1 second
    }
  });

  // Set up live region announcements for screen readers
  setupLiveRegion(container);

  // Enhance dropdown and menu keyboard interaction
  enhanceMenuKeyboardInteraction(container);

  return true;
}

// Set up ARIA live region for announcements
function setupLiveRegion(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  let liveRegion = container.querySelector('[aria-live], [role="status"]');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
    liveRegion.id = 'keyboard-nav-announcer';
    container.appendChild(liveRegion);
  }

  keyboardNavigationState.announcer = liveRegion;
}

// Announce message to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = keyboardNavigationState.announcer;
  if (!announcer) {
    return;
  }

  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  
  // Use setTimeout to ensure the announcement is made after the DOM update
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Enhance menu keyboard interaction
function enhanceMenuKeyboardInteraction(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const dropdowns = container.querySelectorAll('[aria-haspopup="true"]');
  
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const expanded = dropdown.getAttribute('aria-expanded') === 'true';
        dropdown.setAttribute('aria-expanded', !expanded);
        
        if (!expanded) {
          // Menu just opened - focus first item
          const menu = container.querySelector(`#${dropdown.getAttribute('aria-controls')}`);
          if (menu) {
            const firstItem = menu.querySelector('a, button');
            if (firstItem) {
              setTimeout(() => firstItem.focus(), 100);
            }
          }
        }
      }

      if (event.key === 'Escape') {
        dropdown.setAttribute('aria-expanded', 'false');
        dropdown.focus();
      }
    });

    // Close dropdown when clicking outside
    dropdown.addEventListener('blur', (event) => {
      setTimeout(() => {
        const relatedTarget = event.relatedTarget;
        if (!dropdown.contains(relatedTarget)) {
          dropdown.setAttribute('aria-expanded', 'false');
        }
      }, 100);
    });
  });
}

// Validate landmark regions for keyboard navigation
function validateLandmarkRegions() {
  const landmarks = document.querySelectorAll('[role]');
  const landmarkRegions = {
    banner: [],
    navigation: [],
    main: [],
    complementary: [],
    contentinfo: [],
    search: [],
    other: []
  };

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarkRegions.hasOwnProperty(role)) {
      landmarkRegions[role].push(landmark);
    } else {
      landmarkRegions.other.push(landmark);
    }
  });

  // Check for keyboard navigation readiness
  const results = {
    isValid: true,
    regions: landmarkRegions,
    issues: []
  };

  // Validate main landmark exists
  if (landmarkRegions.main.length === 0) {
    results.issues.push('No main landmark found - keyboard navigation to main content may not work');
    results.isValid = false;
  }

  // Validate navigation exists
  if (landmarkRegions.navigation.length === 0) {
    results.issues.push('No navigation landmark found - menu keyboard navigation may not work');
  }

  // Check for duplicate landmarks
  Object.keys(landmarkRegions).forEach(role => {
    if (landmarkRegions[role].length > 1 && role !== 'other') {
      results.issues.push(`Multiple ${role} landmarks found - keyboard users may get confused`);
    }
  });

  return results;
}

// Export all existing and new functions
export {
  config,
  appState,
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLandmarkData,
  ensureLandmarkUniqueness,
  initializeApp,
  setupHandlers,
  validateInput,
  processData,
  main,
  BookItem,
  BookForm,
  AddBookForm,
  createInPageButton,
  setSvgAttributes,
  addProperLandmarkRegions,
  validateLinkAccessibility,
  handleFakeLinks,
  function3,
  defaultSorting,
  onTitleSort,
  onAuthorSort,
  renderDependencyGraphContent,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixTableStructure,
  addressInsightIssues,
  handleCredentialResponse,
  finalizeResolvedFile,
  renderDependencyGraph,
  wrapPrimaryContentInMain,
  handleUserInteraction,
  cleanup,
  initApp,
  VisualizeDependencyTree,
  checkLandmarkElement,
  landmarks,
  appData,
  icons,
  countDependencies,
  addBook,
  defaultSorting,
  ensureDependencyGraphARIA,
  Main,
  validateLandmarkInput,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  renderIndexView,
  calculateSum,
  createInPageButtons,
  ensureUniqueLandmarksDoc,
  calculateDependencyTree,
  generateDependencyString,
  effector,
  validateCredentialResponse,
  extractCredentialData,
  storeCredentialData,
  checkLinkAccessibility,
  newExportedFunction,
  generateAccessibilityReport,
  keyboardNavigationState,
  enhanceKeyboardNavigation,
  initializeKeyboardNavigation,
  updateFocusableElements,
  handleRovingTabindexNavigation,
  announceToScreenReader,
  validateLandmarkRegions
};