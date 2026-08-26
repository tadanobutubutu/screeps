// main.js - Landmark validation and utilities

/**
 * Validates a landmark object
 * @param {Object} landmark - The landmark object to validate
 * @returns {Object} - Validation result with isValid boolean and error message if invalid
 */
function validateLandmark(landmark) {
    // Check if landmark exists
    if (!landmark) {
        return { isValid: false, error: 'Landmark is required' };
    }

    // Check if landmark has required properties
    if (!landmark.id) {
        return { isValid: false, error: 'Landmark must have an id' };
    }

    if (!landmark.name || typeof landmark.name !== 'string') {
        return { isValid: false, error: 'Landmark must have a valid name' };
    }

    if (!landmark.latitude || !landmark.longitude) {
        return { isValid: false, error: 'Landmark must have coordinates (latitude and longitude)' };
    }

    // Validate latitude range
    const lat = parseFloat(landmark.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
        return { isValid: false, error: 'Latitude must be between -90 and 90' };
    }

    // Validate longitude range
    const lng = parseFloat(landmark.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
        return { isValid: false, error: 'Longitude must be between -180 and 180' };
    }

    return { isValid: true };
}

module.exports = {
    validateLandmark
};