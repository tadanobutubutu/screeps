// TODO: This is the existing code that needs to be preserved

module.exports = {
  validateLandmark: (landmark) => {
    // Validates a landmark object for required properties and constraints.
    // The landmark should be an object with 'name', 'type', and 'coordinates'.
    // 'name' must be a non-empty string.
    // 'type' must be one of the allowed types: 'natural', 'cultural', 'historical', 'archaeological'.
    // 'coordinates' must be an object with numeric 'latitude' and 'longitude' values within valid ranges.
    if (!landmark || typeof landmark !== 'object' || Array.isArray(landmark)) {
      return false;
    }

    const { name, type, coordinates } = landmark;

    // Validate name
    if (typeof name !== 'string' || name.trim().length === 0) {
      return false;
    }

    // Validate type
    const allowedTypes = ['natural', 'cultural', 'historical', 'archaeological'];
    if (!allowedTypes.includes(type)) {
      return false;
    }

    // Validate coordinates
    if (!coordinates || typeof coordinates !== 'object' || Array.isArray(coordinates)) {
      return false;
    }
    const { latitude, longitude } = coordinates;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }
    if (latitude < -90 || latitude > 90) {
      return false;
    }
    if (longitude < -180 || longitude > 180) {
      return false;
    }

    // All checks passed
    return true;
  },
};

// Export the validation function
module.exports.validateLandmark = module.exports.validateLandmark;