// Main application module

const landmarks = [];

/**
 * Ensures unique landmarks by removing duplicates based on their id or name.
 * @param {Array} landmarksList - Array of landmark objects
 * @returns {Array} - Array of unique landmarks
 */
function ensureUniqueLandmarks(landmarksList) {
  const seen = new Set();
  return landmarksList.filter(landmark => {
    const key = landmark.id || landmark.name;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Adds a landmark to the collection if it's unique.
 * @param {Object} landmark - The landmark object to add
 * @returns {boolean} - True if landmark was added, false if duplicate
 */
function addLandmark(landmark) {
  const uniqueLandmarks = ensureUniqueLandmarks([...landmarks, landmark]);
  if (uniqueLandmarks.length === landmarks.length + 1) {
    landmarks.push(landmark);
    return true;
  }
  return false;
}

/**
 * Gets all current landmarks.
 * @returns {Array} - Array of all landmarks
 */
function getLandmarks() {
  return [...landmarks];
}

module.exports = {
  ensureUniqueLandmarks,
  addLandmark,
  getLandmarks
};