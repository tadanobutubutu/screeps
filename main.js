// main.js

// Imported modules for rendering
const DOM = require('./dom-utils');
const EventEmitter = require('./events');

// TODO: Implement validateLandmark functionality
function validateLandmark(landmark) {
  // Check if landmark exists
  if (!landmark) {
    return false;
  }

  // Check if landmark has required properties
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Check if landmark has valid coordinates
  if (landmark.coordinates) {
    if (typeof landmark.coordinates.lat !== 'number' || typeof landmark.coordinates.lng !== 'number') {
      return false;
    }
    
    // Validate latitude range (-90 to 90)
    if (landmark.coordinates.lat < -90 || landmark.coordinates.lat > 90) {
      return false;
    }
    
    // Validate longitude range (-180 to 180)
    if (landmark.coordinates.lng < -180 || landmark.coordinates.lng > 180) {
      return false;
    }
  }

  return true;
}

// Render a single landmark on the map
function renderLandmark(landmark, container) {
  if (!validateLandmark(landmark)) {
    return null;
  }
  
  const landmarkElement = DOM.createElement('div', {
    className: 'landmark-marker',
    'data-lat': landmark.coordinates.lat,
    'data-lng': landmark.coordinates.lng
  });
  
  landmarkElement.textContent = landmark.name;
  
  if (container) {
    DOM.appendChild(container, landmarkElement);
  }
  
  return landmarkElement;
}

// Render all landmarks to a container
function renderLandmarks(landmarks, container) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const rendered = [];
  
  landmarks.forEach(landmark => {
    const element = renderLandmark(landmark, container);
    if (element) {
      rendered.push(element);
    }
  });
  
  return rendered;
}

// Initialize the map renderer
function initMapRenderer(containerId) {
  const container = DOM.getElementById(containerId);
  
  if (!container) {
    return null;
  }
  
  const emitter = new EventEmitter();
  
  return {
    container,
    events: emitter,
    renderLandmarks
  };
}

module.exports = { validateLandmark, renderLandmark, renderLandmarks, initMapRenderer };