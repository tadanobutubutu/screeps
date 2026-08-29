const landmarkStructureCheck = (landmark) => {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  // Add a check for accessibility-related properties
  if (!landmark.accessible || !landmark.accessible.description || !landmark.accessible.type) {
    return false;
  }
  return true;
};

function ensureUniqueLandmarks(landmarks) {
    const uniqueLandmarks = [];
    const seen = new Set();

    for (const landmark of landmarks) {
        // Use id if available, otherwise fall back to name
        const key = landmark.id || landmark.name;

        if (key && !seen.has(key)) {
            seen.add(key);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

// New function to check the accessibility of landmarks based on the insight report
const checkLandmarkAccessibility = (landmarks) => {
  const invalidLandmarks = landmarks.filter(landmark => {
    // Check for the existence of required accessibility properties
    return !landmark.accessible || !landmark.accessible.description || !landmark.accessible.type;
  });

  if (invalidLandmarks.length > 0) {
    console.error('Accessibility issues found:', invalidLandmarks);
    return false;
  }

  return true;
};

module.exports = {
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    checkLandmarkAccessibility
};