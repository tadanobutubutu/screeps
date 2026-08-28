function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = typeof landmark === 'object' ? landmark.id || landmark.name : landmark;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export { ensureUniqueLandmarks };