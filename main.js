import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import './accessibilityFixes';

const landmarks = [];
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};
let icons = {};

function validateLandmark(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
  } else {
    // Validate name
    if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
      errors.push('Landmark must have a valid name');
    }

    // Validate latitude and longitude
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
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

import * as newFunctions from './accessibilityFixes';

// ... (previous and updated code remains as it is)

let app;

function initialize() {
  app = initializeApp();
  newFunctions.addressInsightIssues(document);
  registerSW();
}

initialize();