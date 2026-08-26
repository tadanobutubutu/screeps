// ... existing imports and declarations ...

// NEW FUNCTION FROM ISSUE REPORT: Ensure unique landmark names and add scope to table headers
function ensureUniqueLandmarkNames() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], th');
  const landmarkNames = new Set();

  landmarks.forEach((landmark) => {
    if (landmark.tagName === 'TH') {
      landmark.setAttribute('scope', 'col');
    }

    const landmarkName = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');

    if (landmarkName && !landmarkNames.has(landmarkName)) {
      landmarkNames.add(landmarkName);
    } else {
      // Generate a unique id and add to the landmark
      const id = Math.floor(Math.random() * 100000);
      landmark.setAttribute('id', `landmark-${id}`);
    }
  });
}

// EXPORTS
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addSvgAltText,
  fixAccessibilityIssues,
  ensureUniqueLandmarkIds,
  ensureUniqueLandmarkNames
};