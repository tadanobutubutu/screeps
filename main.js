// Import dependencyGraphContent content from its respective module
import { dependencyGraphContent } from './dependencyGraphContent.js';

// Import indexContent content from its respective module
import { indexContent } from './indexContent.js';

// Import the existing getLandmarks from landmarksManager
import { getLandmarks as getLandmarksOriginal } from './landmarksManager.js';

// Import the new landmarks management function
import { ensureUniqueLandmarkNames } from './landmarksManager.js';

// Implement the new function for getting landmarks
function getLandmarks() {
  // Use the original function to get landmarks and ensure their unique names
  const landmarks = getLandmarksOriginal();
  return ensureUniqueLandmarkNames(landmarks);
}

// REACT_015: Add lang attribute to HTML content for accessibility
function addLangAttribute(content) {
  // Add lang attribute to the html tag if not already present
  if (content && !content.includes('<html lang=')) {
    return content.replace('<html>', '<html lang="en">');
  }
  return content;
}

// Apply lang attribute to indexContent for accessibility compliance
const indexContentWithLang = addLangAttribute(indexContent);

// Rest of the existing functions, imports, and exports remain the same

// Update the export for new functions
export {
  dependencyGraphContent,
  indexContent: indexContentWithLang,
  getLandmarks,
  ensureUniqueLandmarkNames,
};