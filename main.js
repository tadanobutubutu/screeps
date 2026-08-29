// Add your new function here
const myNewFunction = () => {
  // Implementation of your new function goes here
};

// Function to check link accessibility
function isLinkAccessible(link) {
  if (!link || typeof link !== 'string') {
    return false;
  }
  
  try {
    const url = new URL(link);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Preserve all current exports and functions
// ... existing exports and functions ...

// Function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    throw new TypeError('Input must be an array of landmarks');
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark || typeof landmark !== 'object') {
      return false;
    }
    
    // Create a unique identifier based on landmark name and coordinates (if available)
    const identifier = landmark.id || `${landmark.name}-${landmark.coordinates?.lat}-${landmark.coordinates?.lng}`;
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

module.exports = {
  myNewFunction,
  isLinkAccessible,
  ensureUniqueLandmarks
};