/**
 * Checks landmark elements on the page for accessibility
 * @returns {Object} An object containing landmark analysis results
 */
function checkLandmarkElements() {
  // Landmark elements and their corresponding roles
  const landmarkSelectors = [
    'header[role="banner"], [role="banner"]',
    'nav, [role="navigation"]',
    'main, [role="main"]',
    'aside, [role="complementary"]',
    'footer[role="contentinfo"], [role="contentinfo"]',
    'section[aria-label], section[aria-labelledby], [role="region"]',
    'article, [role="article"]',
    'form[aria-label], form[aria-labelledby], [role="form"]',
    'search, [role="search"]',
    '[role="application"]',
    '[role="banner"]',
    '[role="contentinfo"]'
  ];

  const allLandmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  const landmarks = Array.from(allLandmarks);

  const result = {
    totalLandmarks: landmarks.length,
    landmarks: [],
    warnings: [],
    hasMain: false
  };

  // Categorize landmarks
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    
    let type = tagName;
    if (role) {
      type = role;
    }
    
    const accessibleName = landmark.getAttribute('aria-label') || 
                          landmark.getAttribute('aria-labelledby') ||
                          landmark.id || '';
    
    result.landmarks.push({
      type,
      tagName,
      accessibleName,
      hasAccessibleName: !!accessibleName
    });

    // Check for main landmark
    if (type === 'main' || tagName === 'main') {
      result.hasMain = true;
    }
  });

  // Check for common accessibility issues
  const mainLandmarks = result.landmarks.filter(l => l.type === 'main' || l.tagName === 'main');
  if (mainLandmarks.length === 0) {
    result.warnings.push('No main landmark found. Pages should have exactly one main landmark for accessibility.');
  } else if (mainLandmarks.length > 1) {
    result.warnings.push(`Found ${mainLandmarks.length} main landmarks. Consider having only one main landmark.`);
  }

  const navLandmarks = result.landmarks.filter(l => l.type === 'navigation' || l.tagName === 'nav');
  if (navLandmarks.length > 5) {
    const unnamedNavs = navLandmarks.filter(n => !n.hasAccessibleName);
    if (unnamedNavs.length > 1) {
      result.warnings.push(`Found ${navLandmarks.length} navigation landmarks. Consider adding aria-label to distinguish them.`);
    }
  }

  // Check for sections without accessible names
  const sections = result.landmarks.filter(l => l.tagName === 'section' && !l.hasAccessibleName);
  if (sections.length > 3) {
    result.warnings.push(`${sections.length} sections without accessible names found. Consider adding aria-label or aria-labelledby.`);
  }

  // New accessibility checks
  // Check for landmarks with duplicate accessible names
  const nameCounts = {};
  result.landmarks.forEach(landmark => {
    if (landmark.hasAccessibleName) {
      nameCounts[landmark.accessibleName] = (nameCounts[landmark.accessibleName] || 0) + 1;
    }
  });
  for (const [name, count] of Object.entries(nameCounts)) {
    if (count > 1) {
      result.warnings.push(`Duplicate accessible name "${name}" found ${count} times. Consider using unique names.`);
    }
  }

  // Check for landmarks without roles
  const landmarksWithoutRoles = result.landmarks.filter(l => !l.type && !l.tagName);
  if (landmarksWithoutRoles.length > 0) {
    result.warnings.push(`Found ${landmarksWithoutRoles.length} landmarks without roles. Consider adding roles for better accessibility.`);
  }

  return result;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkLandmarkElements };
}