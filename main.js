// main.js - Main application file

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)

/**
 * Ensures that all landmarks in the given array are unique based on their identifier
 * @param {Array} landmarks - Array of landmark objects to validate
 * @returns {Array} - Array of unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const seen = new Set();
    return landmarks.filter(landmark => {
        if (!landmark || !landmark.id) {
            return true; // Keep invalid landmarks (let validation handle them)
        }
        
        if (seen.has(landmark.id)) {
            return false; // Duplicate - filter out
        }
        
        seen.add(landmark.id);
        return true;
    });
}

/**
 * Process landmarks with uniqueness guarantee
 * @param {Array} landmarks - Array of landmark objects
 * @returns {Array} - Processed unique landmarks
 */
function processLandmarks(landmarks) {
    const uniqueLandmarks = ensureUniqueLandmarks(landmarks);
    return uniqueLandmarks;
}

// Export functions for use in tests and other modules
module.exports = {
    ensureUniqueLandmarks,
    processLandmarks
};