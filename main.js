// TODO: Implement this function for checking landmark structure

/**
 * Checks if a landmark has a valid structure
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} - True if the landmark structure is valid, false otherwise
 */
function checkLandmarkStructure(landmark) {
  // Check if landmark exists and is an object
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  
  // Check for required properties
  const requiredProperties = ['id', 'name'];
  
  for (const prop of requiredProperties) {
    if (!landmark.hasOwnProperty(prop)) {
      return false;
    }
  }
  
  // Validate id is a non-empty string or number
  if (typeof landmark.id !== 'string' && typeof landmark.id !== 'number') {
    return false;
  }
  
  if (landmark.id === '' || landmark.id === null || landmark.id === undefined) {
    return false;
  }
  
  // Validate name is a non-empty string
  if (typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }
  
  // Validate coordinates if present
  if (landmark.coordinates) {
    if (typeof landmark.coordinates !== 'object') {
      return false;
    }
    
    if (typeof landmark.coordinates.lat !== 'number' || typeof landmark.coordinates.lng !== 'number') {
      return false;
    }
    
    // Check if lat/lng are within valid ranges
    if (landmark.coordinates.lat < -90 || landmark.coordinates.lat > 90) {
      return false;
    }
    
    if (landmark.coordinates.lng < -180 || landmark.coordinates.lng > 180) {
      return false;
    }
  }
  
  return true;
}