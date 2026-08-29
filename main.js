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

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

module.exports = {
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    divide
};