// utils.emotions.js
// ... (previous code remains unchanged until line 389)

const emotionStrings = {
  happy: "I'm feeling happy today!",
  sad: "I'm feeling sad today",
  angry: "I'm feeling angry today",
  // Ensure all strings are properly terminated with quotes
};

// ... (rest of the file remains unchanged)

// Add new function to handle dependency updates
function updateDependencies(dependencies) {
  const updatedDeps = {
    ...dependencies,
    // Update Sentry browser version
    '@sentry/browser': '10.70.0',
    // Update PostHog version
    'posthog-js': '1.416.0',
    // Update TypeScript version
    'typescript': '^7.0.0',
    // Update undici version
    'undici': '>=6.24.0'
  };

  return updatedDeps;
}

// Add function to validate dependency versions
function validateDependencyVersions(dependencies) {
  const requiredVersions = {
    '@sentry/browser': '10.70.0',
    'posthog-js': '1.416.0',
    'typescript': '^7.0.0',
    'undici': '>=6.24.0'
  };

  for (const [dep, version] of Object.entries(requiredVersions)) {
    if (dependencies[dep] !== version) {
      console.warn(`Dependency ${dep} should be updated to version ${version}`);
    }
  }
}

// Export all existing functions and add new ones
module.exports = {
  // ... (existing exports remain unchanged)
  emotionStrings,
  updateDependencies,
  validateDependencyVersions
};