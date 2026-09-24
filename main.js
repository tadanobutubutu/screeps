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

let icons = {};

// ... (previous and updated code remains as it is)

// New function: Adds proper ARIA roles and properties to the dependencyGraph container
function addDependencyGraphAccessibility() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-multiselectable', 'true');
  }
}

// New function: Notifies about possible limitations when the dependencyGraph container is not found
function warnOnMissingDependencyGraph() {
  if (!document.getElementById('dependencyGraph')) {
    console.warn('Missing dependencyGraph container with id "dependencyGraph". Please ensure it is present in the DOM.');
  }
}

// Updated function: Adds proper ARIA roles and properties to landmarks
function addLandmarkRoles() {
  const landmarkElements = document.querySelectorAll('[aria-labelledby]:not([role]),[role="landmark"]');

  // Add landmarks to the landmarks array
  for (const landmarkElement of landmarkElements) {
    const landmarkData = landmarkElement.dataset.landmark;
    if (landmarkData) {
      const landmark = JSON.parse(landmarkData);
      landmarks.push(landmark);
      landmarkElement.setAttribute('aria-labelledby', landmark.name);
    }

    if (landmarkElement.getAttribute('role') === undefined) {
      landmarkElement.setAttribute('role', landmarkElement.getAttribute('aria-labelledby').trim());
    }
  }
}

// ... (previous and updated code remains as it is)

// Export functions for testing
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  addDependencyGraphAccessibility, // New function
  warnOnMissingDependencyGraph, // New function
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies
};