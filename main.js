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
    const candidate = `${baseName}-${Date.now()}`;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${candidate}-${suffix}`;
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
 * Calculates the discount for a given price.
 * @param {number} price - The price of the item.
 * @param {number} discountRate - The discount rate as a decimal (e.g., 0.10 for 10%).
 * @returns {number} The discounted price.
 */
function calculateDiscount(price, discountRate) {
    return price * (1 - discountRate);
}

module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    calculateDiscount,
    // Preserve any other existing exports here
};