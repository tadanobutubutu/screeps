// main.js
// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${baseName}_${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Calculates the sum of an array of numbers.
 * @param {Array<number>} numbers - Array of numbers to sum.
 * @returns {number} The sum of all numbers in the array.
 */
function calculateSum(numbers) {
    if (!Array.isArray(numbers)) {
        throw new TypeError('Input must be an array');
    }
    return numbers.reduce((sum, num) => sum + num, 0);
}

module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    calculateSum,
    // Preserve any other existing exports here
};