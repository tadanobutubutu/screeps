// Address accessibility issues from insight report

const landmarkStructureCheck = (landmark) => {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark.name || !landmark.coordinates) {
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

function checkLandmarkAccessibility(landmark) {
    const issues = [];
    
    if (!landmark.name || landmark.name.trim() === '') {
        issues.push('Landmark must have a descriptive name for screen readers');
    }
    
    if (!landmark.role) {
        issues.push('Landmark should have a semantic role for accessibility');
    }
    
    return {
        accessible: issues.length === 0,
        issues: issues
    };
}

function ensureAccessibleLandmarks(landmarks) {
    const accessibleLandmarks = [];
    
    for (const landmark of landmarks) {
        const accessibilityCheck = checkLandmarkAccessibility(landmark);
        
        if (accessibilityCheck.accessible) {
            accessibleLandmarks.push(landmark);
        }
    }
    
    return accessibleLandmarks;
}

module.exports = {
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    checkLandmarkAccessibility,
    ensureAccessibleLandmarks
};