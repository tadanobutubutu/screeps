/**
 * Main entry point for dependency management and configuration
 * Handles updates for: jest, typescript, react, eslint, and other dependencies
 */

// Version compatibility matrix for the updates mentioned in the dashboard
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

// Check compatibility between dependencies
function checkCompatibility(dep1, dep1Version, dep2, dep2Version) {
  const compatibilityMatrix = {
    'jest+typescript': { min: '5.0', max: '7.0' },
    'jest+react': { min: '18.0', max: '19.0' },
    'eslint+typescript': { min: '5.0', max: '7.0' }
  };
  
  const key = `${dep1}+${dep2}`;
  const range = compatibilityMatrix[key];
  
  if (!range) return { compatible: true };
  
  const majorVersion = (version) => {
    const match = version.match(/^(\d+)/);
    return match ? parseInt(match[1]) : null;
  };
  
  const version = majorVersion(dep2Version);
  
  if (version < parseInt(range.min) || version > parseInt(range.max)) {
    return {
      compatible: false,
      reason: `${dep1} may have compatibility issues with ${dep2} ${dep2Version}`
    };
  }
  
  return { compatible: true };
}

// Validate all detected dependencies from Renovate dashboard
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
      warnings.push(result.reason);
    }
  }
  
  return { errors, warnings };
}

// Get recommended update order based on dependency tree
function getRecommendedUpdateOrder() {
  return [
    'typescript',  // Update TypeScript first as other tools depend on types
    'eslint',      // Update ESLint to v10
    'jest',        // Update Jest to v30 (includes babel-jest)
    'react'        // Update React to v19 last
  ];
}

// Check for breaking changes in major version updates
function checkBreakingChanges(currentVersion, newVersion) {
  const currentMajor = (currentVersion.match(/^(\d+)/) || [])[1] || '0';
  const newMajor = (newVersion.match(/^(\d+)/) || [])[1] || '0';
  
  if (newMajor > currentMajor) {
    return {
      hasBreaking: true,
      majorBump: parseInt(newMajor) - parseInt(currentMajor),
      note: `Major version update from ${currentMajor} to ${newMajor}`
    };
  }
  
  return { hasBreaking: false };
}

// Main function to process dependency updates
function processDependencyUpdates() {
  const updateOrder = getRecommendedUpdateOrder();
  const results = [];
  
  updateOrder.forEach(dep => {
    const update = DEPENDENCY_UPDATES[dep];
    if (update) {
      results.push({
        dependency: dep,
        from: update.current,
        to: update.next,
        packages: update.packages || [dep],
        breaking: checkBreakingChanges(update.current, update.next)
      });
    }
  });
  
  return results;
}

// Export all utilities
module.exports = {
  DEPENDENCY_UPDATES,
  checkCompatibility,
  validateDependencies,
  getRecommendedUpdateOrder,
  checkBreakingChanges,
  processDependencyUpdates
};

// Run if executed directly
if (require.main === module) {
  console.log('Processing dependency updates...\n');
  const updates = processDependencyUpdates();
  
  updates.forEach(update => {
    console.log(`${update.dependency}:`);
    console.log(`  ${update.from} → ${update.to}`);
    if (update.breaking.hasBreaking) {
      console.log(`  ⚠️  ${update.breaking.note}`);
    }
    console.log();
  });
}