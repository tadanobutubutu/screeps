module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  setupKeyboardNavigation,
  addressAccessibilityIssues,
  trapFocus,
  ensureUniqueLandmarks,
  createAnnouncer,
  prefersReducedMotion,
  improveKeyboardNavigation,
  addLiveRegionForDynamicContent,
  initializeAccessibility,
  replaceMyButtonId,
  initializeButton,
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone,
  getLangAttribute
};

const _usedLandmarkIds = new Set();

function ensureUniqueLandmarkId(baseName) {
  let candidate = baseName;
  if (_usedLandmarkIds.has(candidate)) {
    // Collision handling: add random suffix
    const suffix = Math.random().toString(36).substring(2, 9);
    candidate = `${baseName}-${suffix}`;
  }
  _usedLandmarkIds.add(candidate);
  return candidate;
}

function uniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];
  for (const lm of landmarks) {
    if (!seen.has(lm.id)) {
      seen.add(lm.id);
      result.push(lm);
    }
  }
  return result;
}