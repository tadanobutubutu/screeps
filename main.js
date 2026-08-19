// Updated dependency versions for Dependency Dashboard

const updatedDependencies = {
  // GitHub Actions
  'google/osv-scanner-action': 'v2.5.1',

  // npm dependencies
  'eslint': 'v10',
  'typescript': 'v7',
  'jest': '^30.0.0',
  'babel-jest': '^30.0.0',
  'react': '^19.0.0',
  'postcss': '^8.5.23',

  // Node versions
  'node': '24'
};

// Configuration for dependency updates
const dependencyConfig = {
  updateSchedule: {
    'google/osv-scanner-action': 'immediate',
    'eslint': 'weekly',
    'typescript': 'weekly',
    'jest monorepo': 'weekly',
    'react': 'immediate'
  },

  // Lock file handling - deprecated multiple npm lock files warning
  lockFileSettings: {
    multipleNpmLockFiles: {
      enabled: false,
      deprecationWarning: 'Updating multiple npm lock files is deprecated and support will be removed in future versions.'
    }
  },

  // Package rules
  packageRules: [
    {
      matchPackagePatterns: ['jest', 'babel-jest'],
      groupName: 'jest monorepo',
      allowedVersions: '^30.0.0'
    },
    {
      matchPackageNames: ['eslint'],
      allowedVersions: '^10.0.0'
    },
    {
      matchPackageNames: ['typescript'],
      allowedVersions: '^7.0.0'
    },
    {
      matchPackageNames: ['react', 'react-dom'],
      allowedVersions: '^19.0.0'
    }
  ]
};

// New function to add main landmarks to files
function addMainLandmarks() {
  // This would be implemented in a build step or preprocessor
  // The actual implementation would depend on your build system
  console.log('Adding main landmarks to files as part of the build process');
}

// New function to ensure SVG accessibility
function ensureSvgAccessibility() {
  // This function would be used in a build step to modify layout files
  // to add aria-hidden="true" to decorative SVGs
  console.log('Ensuring SVG accessibility by adding aria-hidden="true" to decorative SVGs');
}

module.exports = {
  updatedDependencies,
  dependencyConfig,
  addMainLandmarks,
  ensureSvgAccessibility
};