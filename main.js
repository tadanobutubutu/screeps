// Existing code preserved below

// TODO: Implement this function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
  const uniqueLandmarks = new Set();
  landmarks.forEach(landmark => {
    if (!uniqueLandmarks.has(landmark)) {
      uniqueLandmarks.add(landmark);
    }
  });
  return Array.from(uniqueLandmarks);
}

// Existing code preserved above