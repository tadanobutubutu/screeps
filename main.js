// Existing code preserved below

// TODO: Implement this function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
  const uniqueLandmarks = new Set();
  landmarks.forEach(landmark => {
    if (!uniqueLandmarks.has(landmark)) {
      uniqueLandmarks.add(landmark);
    }
  });
  return Array.from(uniqueLandmarks);
}

// Existing code preserved above

// existing code preserved...

// TODO: Create or update the affected functions to be accessible

function checkLandmarkStructure(landmark) {
  const errors = [];
  
  // Check if landmark exists
  if (!landmark || typeof landmark !== 'object') {
    return {
      valid: false,
      errors: ['Landmark must be a valid object']
    };
  }
  
  // Check for required properties
  if (!landmark.id) {
    errors.push('Landmark must have an id property');
  }
  
  if (!landmark.name || typeof landmark.name !== 'string') {
    errors.push('Landmark must have a name property of type string');
  }
  
  // Check coordinates structure
  if (!landmark.coordinates || typeof landmark.coordinates !== 'object') {
    errors.push('Landmark must have coordinates property of type object');
  } else {
    if (typeof landmark.coordinates.lat !== 'number' || 
        typeof landmark.coordinates.lng !== 'number') {
      errors.push('Coordinates must have numeric lat and lng properties');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

module.exports = { checkLandmarkStructure, ensureUniqueLandmarks };