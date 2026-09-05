function ensureUniqueLandmarks(landmarks) {
  const uniqueLandmarks = [];
  const existingLandmarks = uniqueLandmarks.slice(); // Get a copy of existing landmarks to compare with new ones

  landmarks.forEach((landmark) => {
    if (!existingLandmarks.some((existing) => existing === landmark)) {
      uniqueLandmarks.push(landmark);
    } else {
      console.error(`Duplicate landmark found: ${landmark}`);
    }
  });

  return uniqueLandmarks;
}

// Usage:
const landmarks = [/* your landmark array */];
const uniqueLandmarks = ensureUniqueLandmarks(landmarks);