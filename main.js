// TODO: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...

export function validateLandmark(landmark) {
  if (!landmark) return false;
  
  // Check for required properties
  if (typeof landmark.x !== 'number' || typeof landmark.y !== 'number') {
    return false;
  }
  
  // Validate coordinates are within valid range
  if (landmark.x < 0 || landmark.y < 0) {
    return false;
  }
  
  // If name property exists, validate it
  if (landmark.name !== undefined && typeof landmark.name !== 'string') {
    return false;
  }
  
  return true;
}

export function validateLandmarkStructure(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  
  // Must have valid coordinates
  if (typeof landmark.x !== 'number' || typeof landmark.y !== 'number') {
    return false;
  }
  
  // Coordinates must be non-negative integers
  if (!Number.isInteger(landmark.x) || !Number.isInteger(landmark.y)) {
    return false;
  }
  
  if (landmark.x < 0 || landmark.y < 0) {
    return false;
  }
  
  // If description exists, it must be a string
  if (landmark.description !== undefined && typeof landmark.description !== 'string') {
    return false;
  }
  
  // Validate type if present
  if (landmark.type !== undefined && typeof landmark.type !== 'string') {
    return false;
  }
  
  return true;
}