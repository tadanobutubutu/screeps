// main.js

// TODO: Implement this function for ensuring unique landmarks

function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = JSON.stringify(landmark);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

module.exports = { ensureUniqueLandmarks };