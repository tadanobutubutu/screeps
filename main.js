/**
 * Main entry point for dependency management and configuration
 * Handles updates for: jest, typescript, react, eslint, and other dependencies
 */

// Addressed accessibility issues from insight report:
const accessibilityHelpers = {
  // Accessibility helper exports
  getLangAttribute,
  validateLandmark,
  getSvgAccessibleName,
  validateTableAccessibility,
  getTableScopeRecommendation,
  validateLinkAccessibility,
  createInPageButton,
  // New accessibility functions
  validateUniqueLandmarks,
  validateLandmarkStructure,
  validateTableStructure,
  getTableCellAttributes,
  createSvgAccessibilityProps,
  validateSvgAccessibility,
  validateLinkOrButton,
  createAccessibleLink,
  getFullLangAttribute,
  validateLangAttribute
};

/**
 * Version compatibility matrix for the updates mentioned in the dashboard
 */
const DEPENDENCY_UPDATES = {
  jest: {
    current: '^29.6.1',
    next: '^30.0.0',
    packages: ['jest', 'babel-jest']
  },
  typescript: {
    current: '^5.7.3',
    next: '^7.0.0'
  },
  react: {
    current: '^18.2.0',
    next: '^19.0.0',
    packages: ['react', 'react-dom']
  },
  eslint: {
    current: '^8.47.0',
    next: '^10.0.0'
  }
};

/**
 * Validate all detected dependencies from Renovate dashboard
 * @param {Object} dependencies - Object containing dependency versions
 * @returns {Object} Validation results with errors and warnings
 */
function validateDependencies(dependencies) {
  const errors = [];
  const warnings = [];
  
  if (dependencies.jest && dependencies.typescript) {
    const result = checkCompatibility(
      'jest', dependencies.jest,
      'typescript', dependencies.typescript
    );
    if (!result.compatible) {
      errors.push(result.reason);
    }
  }
  
  if (dependencies.eslint && dependencies.typescript) {
    const result = checkCompatibility(
      'eslint', dependencies.eslint,
      'typescript', dependencies.typescript
    );
    if (!result.compatible) {
      errors.push(result.reason);
    }
  }
  
  return { errors, warnings };
}

/**
 * Get recommended update order based on dependency tree
 */

// ... (the rest of the code omitted for brevity)

// Export both dependencies compatibility matrix and accessibility helpers
module.exports = {
  DEPENDENCY_UPDATES,
  accessibilityHelpers
};

// Run if executed directly
if (require.main === module) {
  console.log('Processing dependency updates...\n');
  const updates = processDependencyUpdates();

  updates.forEach(update => {
    console.log(`Updating ${update.dependency}:`);
    console.log(`  ${update.from} → ${update.to}`);
    if (update.breaking.hasBreaking) {
      console.log(`  WARNING: ${update.breaking.note}`);
    }
    console.log();
  });
}