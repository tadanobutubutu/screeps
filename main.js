import './styles.css';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * Renders the index view with landmarks and accessibility features.
 */
function renderIndexView() {
    const mainContent = document.getElementById('main-content') || document.body;
    
    // Create the index view container
    const indexContainer = document.createElement('div');
    indexContainer.id = 'index-view';
    indexContainer.setAttribute('role', 'main');
    indexContainer.setAttribute('aria-label', 'Main content');
    
    // Create header with app title
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.id = 'app-header';
    
    const title = document.createElement('h1');
    title.textContent = appData.title;
    title.id = 'main-title';
    header.appendChild(title);
    
    const version = document.createElement('p');
    version.setAttribute('aria-labelledby', 'main-title');
    version.textContent = `Version ${appData.version}`;
    header.appendChild(version);
    
    indexContainer.appendChild(header);
    
    // Create landmarks section
    const landmarksSection = document.createElement('section');
    landmarksSection.id = 'landmarks-section';
    landmarksSection.setAttribute('aria-labelledby', 'landmarks-heading');
    
    const landmarksHeading = document.createElement('h2');
    landmarksHeading.id = 'landmarks-heading';
    landmarksHeading.textContent = 'Landmarks';
    landmarksSection.appendChild(landmarksHeading);
    
    // Render landmarks list
    const landmarksList = document.createElement('ul');
    landmarksList.setAttribute('role', 'list');
    landmarksList.id = 'landmarks-list';
    
    if (landmarks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No landmarks available';
        landmarksList.appendChild(emptyMessage);
    } else {
        landmarks.forEach((landmark, index) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            
            const landmarkElement = document.createElement('div');
            landmarkElement.id = `landmark-${index}`;
            landmarkElement.setAttribute('role', landmark.role || 'region');
            landmarkElement.setAttribute('aria-label', landmark.name);
            
            const landmarkName = document.createElement('span');
            landmarkName.textContent = landmark.name;
            landmarkElement.appendChild(landmarkName);
            
            listItem.appendChild(landmarkElement);
            landmarksList.appendChild(listItem);
        });
    }
    
    landmarksSection.appendChild(landmarksList);
    indexContainer.appendChild(landmarksSection);
    
    // Append to main content
    mainContent.appendChild(indexContainer);
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);

  // Add accessible names to SVGs (example selectors and names)
  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screps icon"></svg>'
  };

  // Fix fake links
  fixFakeLinks();

  // Render the index view
  renderIndexView();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  // ... (assuming other initialization logic is present)
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Register the service worker
registerSW();

// Export functions for testing
// ... (only include exported functions if needed and remove unrelated code)