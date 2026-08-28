function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(item => {
    if (seen.has(item)) {
      return false;
    }
    seen.add(item);
    return true;
  });
}

export { ensureUniqueLandmarks };