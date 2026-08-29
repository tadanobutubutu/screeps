const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark storage for ensuring uniqueness
const landmarks = [];

function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

// Functions to ensure unique landmarks
function addLandmark(landmark) {
    // Add a landmark only if it doesn't already exist
    if (!landmarks.includes(landmark)) {
        landmarks.push(landmark);
        return true;
    }
    return false;
}

function getLandmarks() {
    // Return a copy to prevent external modification of internal state
    return [...landmarks];
}

function hasLandmark(landmark) {
    // Check if a landmark already exists
    return landmarks.includes(landmark);
}

function removeLandmark(landmark) {
    // Remove a landmark if it exists
    const index = landmarks.indexOf(landmark);
    if (index !== -1) {
        landmarks.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = {
    // Preserve all existing exports
    // ...
    calculateDiscount: calculateDiscount,
    addLandmark: addLandmark,
    getLandmarks: getLandmarks,
    hasLandmark: hasLandmark,
    removeLandmark: removeLandmark
};