// Main application logic for landmark management
const landmarkData = require('./landmark-data');

// validateLandmark checks if a landmark object has all required properties
function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'name', 'latitude', 'longitude'];
  
  for (const field of requiredFields) {
    if (!landmark[field]) {
      return false;
    }
  }
  
  // Validate coordinate values are numbers within valid ranges
  if (typeof landmark.latitude !== 'number' || typeof landmark.longitude !== 'number') {
    return false;
  }
  
  if (landmark.latitude < -90 || landmark.latitude > 90) {
    return false;
  }
  
  if (landmark.longitude < -180 || landmark.longitude > 180) {
    return false;
  }
  
  return true;
}

function getAllLandmarks() {
  return landmarkData.getAll();
}

function getLandmarkById(id) {
  const landmarks = getAllLandmarks();
  return landmarks.find(l => l.id === id);
}

function addLandmark(landmark) {
  if (!validateLandmark(landmark)) {
    throw new Error('Invalid landmark data');
  }
  return landmarkData.add(landmark);
}

module.exports = {
  validateLandmark,
  getAllLandmarks,
  getLandmarkById,
  addLandmark
};