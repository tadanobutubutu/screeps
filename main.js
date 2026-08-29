import React from 'react';
import _, { flatten, chain } from 'lodash';
import dependencyGraphContent from './dependencyGraphContent';

// Existing functions and imports...
// ... (preserved content from main.js)

// New function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  const uniqueLandmarks = _.uniqBy(landmarks, 'id');
  return uniqueLandmarks;
}

// Existing exports and functions...
// ... (preserved content from main.js)

export { ensureUniqueLandmarks, ... /* other exports */ };