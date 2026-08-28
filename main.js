// Main application file

import './styles.css'
import { getUserData, calculateTotalPrice } from './utils.js';

// Sample data for the application
const appData = {
    title: 'Landmark Checker',
    version: '1.0.0'
};

const landmarks = [];

// Existing landmark tracking
function addLandmark(name, coordinates) {
    const landmark = {
        id: Date.now(),
        name: name,
        coordinates: coordinates
    };
    landmarks.push(landmark);
    return landmark;
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = `${landmark.name}-${landmark.coordinates}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function isLandmarkUnique(name, coordinates) {
    return !landmarks.some(
        landmark => 
            landmark.name === name && 
            landmark.coordinates === coordinates
    );
}

function removeDuplicateLandmarks() {
    const uniqueLandmarks = ensureUniqueLandmarks();
    landmarks.length = 0;
    landmarks.push(...uniqueLandmarks);
    return landmarks;
}

function getUniqueLandmarkByName(name) {
    const matches = landmarks.filter(l => l.name === name);
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    return matches[0];
}

function helloWorld() {
  return 'Hello, World!';
}

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

// Function to render the dependency graph
function renderDependencyGraph(containerId) {
  const container = initDependencyGraph(containerId);
  if (container) {
    // Add the logic to render the dependency graph inside the container
    // This is a placeholder for the actual rendering logic
    container.innerHTML = 'Dependency Graph Data';
  }
}

// Function to render the index view
function renderIndexView(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<h1>Index View</h1><p>List of landmarks:</p>';
    landmarks.forEach(landmark => {
      const div = document.createElement('div');
      div.textContent = `${landmark.name} at ${landmark.coordinates}`;
      container.appendChild(div);
    });
  }
  return container;
}

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
    const landmarkElements = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};
    
    landmarkElements.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });
    
    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };
    
    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Missing required <main> landmark element');
    }
    
    if (!results.header.exists) {
        validation.warnings.push('No <header> landmark element found');
    }
    
    if (!results.nav.exists) {
        validation.warnings.push('No <nav> landmark element found');
    }
    
    if (!results.footer.exists) {
        validation.warnings.push('No <footer> landmark element found');
    }
    
    return validation;
}

// Initialize application
function init() {
    console.log('Initializing ' + appData.title + ' v' + appData.version);
    return checkLandmarkElements();
}

// Export all functions
export {
  addLandmark,
  ensureUniqueLandmarks,
  isLandmarkUnique,
  removeDuplicateLandmarks,
  getUniqueLandmarkByName,
  landmarks,
  renderDependencyGraph,
  renderIndexView,
  helloWorld,
  initDependencyGraph,
  checkLandmarkElements,
  validateLandmarkStructure,
  getElementById,
  queryElements,
  init,
  appData
};