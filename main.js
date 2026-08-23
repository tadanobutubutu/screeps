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

// Check accessibility compliance for dependencies
function checkAccessibilityCompliance(dependencies) {
  const issues = [];
  
  // Check React version for accessibility support
  if (dependencies.react) {
    const reactVersion = dependencies.react.replace(/[\^~>=<]/g, '');
    const majorVersion = parseInt(reactVersion.split('.')[0]);
    if (majorVersion < 16) {
      issues.push('React version below 16.0 lacks proper accessibility hooks support');
    }
  }
  
  // Check ESLint for accessibility rules configuration
  if (dependencies.eslint) {
    const eslintVersion = dependencies.eslint.replace(/[\^~>=<]/g, '');
    const majorVersion = parseInt(eslintVersion.split('.')[0]);
    if (majorVersion < 8) {
      issues.push('ESLint version below 8.0 has limited JSX a11y rules');
    }
  }
  
  return {
    compliant: issues.length === 0,
    issues
  };
}

// Get accessibility-related dependencies to install
function getAccessibilityDependencies() {
  return {
    'axe-core': '^4.8.0',
    'jest-axe': '^1.0.0',
    '@axe-core/react': '^4.8.0'
  };
}

// Validate accessibility tooling compatibility
function validateAccessibilityTooling(tooling) {
  const requirements = {
    'jest-axe': { requires: ['jest@>=26', 'react@>=16'] },
    '@axe-core/react': { requires: ['react@>=16'] },
    'axe-core': { standalone: true }
  };
  
  const results = [];
  
  tooling.forEach(tool => {
    const reqs = requirements[tool];
    if (reqs && !reqs.standalone) {
      results.push({
        tool,
        compatible: true,
        requirements: reqs.requires
      });
    } else if (!reqs) {
      results.push({
        tool,
        compatible: false,
        reason: 'Unknown accessibility tool'
      });
    } else {
      results.push({
        tool,
        compatible: true,
        standalone: true
      });
    }
  });
  
  return results;
}

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
    const match = version.match(/(\d+)/);
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
      errors.push(result.reason);
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
function hasBreakingChanges(currentVersion, newVersion) {
  const currentMajor = parseInt(currentVersion.match(/(\d+)/)?.[1]) || '0';
  const newMajor = parseInt(newVersion.match(/(\d+)/)?.[1]) || '0';
  
  if (newMajor > currentMajor) {
    return {
      hasBreaking: true,
      majorBump: newMajor - currentMajor,
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
        breaking: hasBreakingChanges(update.current, update.next)
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
  hasBreakingChanges,
  processDependencyUpdates,
  checkAccessibilityCompliance,
  getAccessibilityDependencies,
  validateAccessibilityTooling
};

// Run if executed directly
if (require.main === module) {
  console.log('Processing dependency updates...\n');
  const updates = processDependencyUpdates();
  
  updates.forEach(update => {
    console.log(`${update.dependency}:`);
    console.log(`  ${update.from} → ${update.to}`);
    if (update.breaking.hasBreaking) {
      console.log(`  WARNING: ${update.breaking.note}`);
    }
    console.log();
  });
  
  console.log('Accessibility check...');
  const sampleDeps = { react: '^18.2.0', eslint: '^8.47.0' };
  const a11yResult = checkAccessibilityCompliance(sampleDeps);
  console.log(`  Compliant: ${a11yResult.compliant}`);
  if (a11yResult.issues.length > 0) {
    a11yResult.issues.forEach(issue => console.log(`  - ${issue}`));
  }
}