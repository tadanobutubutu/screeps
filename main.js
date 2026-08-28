// Main application module

const fs = require('fs');
const path = require('path');

/**
 * Validates a landmark object
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} - Returns true if valid, throws error if invalid
 */
function validateLandmark(landmark) {
  if (!landmark) {
    throw new Error('Landmark cannot be null or undefined');
  }
  
  if (typeof landmark !== 'object') {
    throw new Error('Landmark must be an object');
  }
  
  // Validate required fields
  if (!landmark.name || typeof landmark.name !== 'string') {
    throw new Error('Landmark must have a valid name property');
  }
  
  if (!landmark.latitude || typeof landmark.latitude !== 'number') {
    throw new Error('Landmark must have a valid latitude property');
  }
  
  if (!landmark.longitude || typeof landmark.longitude !== 'number') {
    throw new Error('Landmark must have a valid longitude property');
  }
  
  // Validate coordinate ranges
  if (landmark.latitude < -90 || landmark.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  
  if (landmark.longitude < -180 || landmark.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  
  return true;
}

/**
 * Validates the structure of a landmark object
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} - Returns true if structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  
  // Check for essential properties
  const requiredProperties = ['name', 'latitude', 'longitude'];
  
  for (const prop of requiredProperties) {
    if (!landmark.hasOwnProperty(prop)) {
      return false;
    }
  }
  
  // Validate types of essential properties
  if (typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }
  
  if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    return false;
  }
  
  if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    return false;
  }
  
  return true;
}

// // TODO: Implement validateLandmark(), ... and validateLandmarkStructure() functions here

/**
 * Load landmarks from a JSON file
 * @param {string} filePath - Path to the landmarks file
 * @returns {Array} - Array of landmark objects
 */
function loadLandmarks(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const data = fs.readFileSync(absolutePath, 'utf8');
    const landmarks = JSON.parse(data);
    
    // Validate all landmarks
    landmarks.forEach(landmark => {
      validateLandmark(landmark);
    });
    
    return landmarks;
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

/**
 * Save landmarks to a JSON file
 * @param {string} filePath - Path to save the file
 * @param {Array} landmarks - Array of landmark objects
 */
function saveLandmarks(filePath, landmarks) {
  try {
    // Validate all landmarks before saving
    landmarks.forEach(landmark => {
      validateLandmark(landmark);
    });
    
    const absolutePath = path.resolve(filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(landmarks, null, 2));
    console.log('Landmarks saved successfully');
  } catch (error) {
    console.error('Error saving landmarks:', error.message);
  }
}

module.exports = {
  validateLandmark,
  validateLandmarkStructure,
  loadLandmarks,
  saveLandmarks
};