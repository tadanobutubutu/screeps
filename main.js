// main.js

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

module.exports = { validateLandmark };