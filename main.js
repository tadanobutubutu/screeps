// Import dependencyGraphContent content from its respective module
import { dependencyGraphContent } from './dependencyGraphContent.js';

// Import indexContent content from its respective module
import { indexContent } from './indexContent.js';

// Import the existing getLandmarks from landmarksManager
import { getLandmarks as getLandmarksPrevious } from './landmarksManager';

// Implement the new function for getting landmarks
function getLandmarks() {
  // Use the original function to get landmarks and ensure their unique names
  const landmarks = getLandmarksPrevious();
  ensureUniqueLandmarkNames(landmarks);
  return landmarks;
}

function ensureUniqueLandmarkNames(landmarks) {
  const landmarkNames = new Set();
  let counter = 0;

  landmarks.forEach((landmark) => {
    const landmarkName = landmark.name || landmark.title || '';

    if (landmarkName && !landmarkNames.has(landmarkName)) {
      landmarkNames.add(landmarkName);
    } else {
      counter++;
      landmark.id = counter * 100000;
    }
  });
}

// Rest of the existing functions, imports, and exports remain the same

// Update the export for new functions
export {
  dependencyGraphContent,
  indexContent,
  getLandmarks,
  ensureUniqueLandmarkNames,
};