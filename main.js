// main.js

/**
 * Landmarks application
 */

/**
 * Ensures unique landmarks by removing duplicates based on their id or name
 * @param {Array} landmarks - Array of landmark objects
 * @returns {Array} - Array of unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const uniqueLandmarks = [];
    const seen = new Set();
    
    for (const landmark of landmarks) {
        const key = landmark.id || landmark.name;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueLandmarks.push(landmark);
        }
    }
    
    return uniqueLandmarks;
}

/**
 * Calculate distances between landmarks
 * @param {Array} landmarks - Array of landmark objects with latitude and longitude
 */
function calculateDistances(landmarks) {
    const uniqueLandmarks = ensureUniqueLandmarks(landmarks);
    // Some implementation for calculating distances
    return uniqueLandmarks;
}

module.exports = {
    ensureUniqueLandmarks,
    calculateDistances
};