// main.js

import React from 'react';
import { render } from 'react-dom';
import dependencyGraphContent from './modules/dependencyGraphContent';
import indexContent from './modules/indexContent';

// Existing utility functions preserved
export const initializeApp = () => {
  console.log('App initialized');
};

export const someExistingFunction = () => {
  return 'existing functionality';
};

// ----- BEGIN ORIGINAL CODE (unchanged) -----

// TODO: This is the existing code that needs to be preserved
// All existing functions, exports, and code remain unchanged

// ----- END ORIGINAL CODE (unchanged) -----

// Updated functions that now use the imported modules:

export const renderDependencyGraph = (containerId) => {
  const container = document.getElementById(containerId);
  if (container) {
    // Use dependencyGraphContent from the appropriate module
    container.innerHTML = dependencyGraphContent;
  }
};

export const renderIndexView = (containerId) => {
  const container = document.getElementById(containerId);
  if (container) {
    // Use indexContent from the appropriate module
    container.innerHTML = indexContent;
  }
};

export { dependencyGraphContent, indexContent };