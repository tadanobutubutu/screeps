// main.js

// Function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (typeof landmark === 'object' && landmark !== null) {
      const key = landmark.id || landmark.name || JSON.stringify(landmark);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    } else {
      if (seen.has(landmark)) {
        return false;
      }
      seen.add(landmark);
      return true;
    }
  });
}

module.exports = {
  ensureUniqueLandmarks
};