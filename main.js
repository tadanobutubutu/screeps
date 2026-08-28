// TODO: Implement validateLandmark functionality

/**
 * Validates a landmark object
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} - Returns true if the landmark is valid, false otherwise
 */
function validateLandmark(landmark) {
  // Check if landmark exists
  if (!landmark) {
    return false;
  }

  // Validate name is present and non-empty
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Validate coordinates if present
  if (landmark.latitude !== undefined || landmark.longitude !== undefined) {
    if (typeof landmark.latitude !== 'number' || typeof landmark.longitude !== 'number') {
      return false;
    }
    // Validate latitude range (-90 to 90)
    if (landmark.latitude < -90 || landmark.latitude > 90) {
      return false;
    }
    // Validate longitude range (-180 to 180)
    if (landmark.longitude < -180 || landmark.longitude > 180) {
      return false;
    }
  }

  return true;
}

module.exports = {
  validateLandmark
};