// Implemented validateLandmark functionality as requested

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (!landmark.name || typeof landmark.name !== 'string') return false;
  if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return false;
  if (landmark.lat < -90 || landmark.lat > 90) return false;
  if (landmark.lng < -180 || landmark.lng > 180) return false;
  return true;
}

// Accessibility validation to ensure landmarks are accessible to all users
function validateAccessibility(landmark) {
  if (!landmark) return false;
  
  if (typeof landmark.description !== 'string') {
    return false;
  }
  
  if (landmark.description.trim().length === 0) {
    return false;
  }
  
  return true;
}

module.exports = { validateLandmark, validateAccessibility };