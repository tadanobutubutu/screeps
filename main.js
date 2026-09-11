// Implemented validateLandmark functionality as requested

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
    result.warnings.push('Multiple main landmarks. Consider having only one main landmark.');
  }

  const navLandmarks = result.landmarks.filter(l => l.type === 'navigation' || l.tagName === 'nav');
  if (navLandmarks.length > 5) {
    const unnamedNavs = navLandmarks.filter(n => !n.hasAccessibleName);
    if (unnamedNavs.length > 1) {
      result.warnings.push('Multiple navigation landmarks. Consider adding aria-label to distinguish them.');
    }
  }

  // Check for sections without accessible names
  const sections = result.landmarks.filter(l => l.tagName === 'section' && !l.hasAccessibleName);
  if (sections.length > 3) {
    result.warnings.push('Multiple sections without accessible names found. Consider adding aria-label or aria-labelledby.');
  }

  return result;
}

// Accessibility validation to ensure landmarks are accessible to all users
function validateAccessibility(landmark) {
  if (!landmark) return false;
  
  if (typeof landmark.description !== 'string') {
    return false;
  }
  
  if (landmark.description.trim().length === 0) {
    return false;
  }
  
  return true;
}

module.exports = { validateLandmark, validateAccessibility };