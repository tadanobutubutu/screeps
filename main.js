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
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || 'en';
}

// Add a new function: addProperButtonId
function addProperButtonId() {
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
    button.classList.remove('my-button');
  }
}

// Add a new function: addSpecialClassToButton
function addSpecialClassToButton() {
  const button = document.querySelector('.my-different-button');
  if (button) {
    button.classList.add('mySpecialClass');
  }
}

// Replace the existing replaceMyButtonId function with this updated version
function replaceMyButtonIdAndAddSpecialClass() {
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
    button.classList.remove('my-button');
    addSpecialClassToButton(); // Call the new addSpecialClassToButton function
  }
}

// Function to remove the 'my-button' class, add a specific id for the button element if it exists, and add a special class to another button element with class 'my-different-button'
replaceMyButtonIdAndAddSpecialClass();

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();
addProperButtonId(); // Add the new function at the end

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonIdAndAddSpecialClass, // Update the existing export with the newer replaceMyButtonId function
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  addProperButtonId
};