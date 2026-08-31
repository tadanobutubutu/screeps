const landmarks = [];

// Landmark validation function with merged logic from both branches
function validateLandmark(landmark) {
  const errors = [];

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return errors;
}

// Final exports - combining all functionality
module.exports = {
    User,
    spawnNewUser,
    config,
    initialize,
    initializeApp,
    main,
    visualizeDependencyTree,
    processData,
    checkLandmarkElement,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    addLandmarkRegions,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    ensureLandmarkUniqueness,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    appData,
    initApp,
    getConfig,
    getVersion,
    ensureRootContainerAccessible,
    fetchUser,
    clearCache,
    someFunction,
    helper,
    formatDate,
    validateInput,
    getLangAttribute,
    addLangAttribute,
    setLanguageAttribute,
    addLandmarkRoles,
    fixFakeLinks,
    icons,
    renderDependencyGraph,
    renderDependencyGraphContent,
    addressInsightIssues,
    addressAccessibilityIssues,
    getInsightReport,
    validateLandmark
};