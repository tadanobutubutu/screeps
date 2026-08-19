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

module.exports = {
  updatedDependencies,
  dependencyConfig
};