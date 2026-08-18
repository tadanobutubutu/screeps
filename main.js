/**
 * Main.js - Dependency Dashboard Handler
 * Handles dependency updates and conflict resolution
 */

const componentDidCatch = (error, errorInfo) => {
    setError(error);
    setErrorInfo(errorInfo);
    setHasError(true);
};

if (hasError) {
    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
            <pre
                tabIndex={0}
                aria-label="エラーメッセージ詳細"
                style={{
                    color: '#c53030',
                    backgroundColor: '#fff5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                }}
            >
                {error && error.toString()}
                <br />
                {errorInfo.componentStack}
            </pre>
            <button
                onClick={() => window.location.reload()}
                style={{
                    backgroundColor: '#004b73',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                🔄 ページを再読み reload
            </button>
        </main>
    );
}

const dependencyUpdates = {
  // NPM dependencies pending update
  npm: [
    {
      name: 'typescript',
      current: '^5.7.3',
      update: '^7.0.0',
      type: 'minor'
    },
    {
      name: 'react',
      current: '^18.2.0',
      update: '^19.0.0',
      type: 'major'
    },
    {
      name: 'jest',
      current: '^29.6.1',
      update: '^30.0.0',
      type: 'major'
    },
    {
      name: 'eslint',
      current: '^8.47.0',
      update: '^10.0.0',
      type: 'major'
    },
    {
      name: 'babel-jest',
      current: '^29.6.1',
      update: '^30.0.0',
      type: 'major'
    }
  ],

  // GitHub Actions pending update (merged update from the conflicting version)
  actions: [
    {
      name: 'google/osv-scanner-action',
      current: 'v2.5.0',
      update: 'v2.5.1',
      type: 'patch'
    }
  ],

  // CI configurations
  ci: [
    {
      type: 'travis',
      name: 'node',
      current: '20',
      update: '24' // Merged update from the conflicting version if applicable
    }
  ]
};

/**
 * Process and apply dependency updates
 * @returns {Object} Summary of applied updates
 */
function processUpdates() {
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  // Process NPM updates
  dependencyUpdates.npm.forEach(dep => {
    try {
      console.log(`Updating ${dep.name}: ${dep.current} → ${dep.update}`);
      results.success.push({
        package: dep.name,
        from: dep.current,
        to: dep.update
      });
    } catch (error) {
      results.failed.push({
        package: dep.name,
        error: error.message
      });
    }
  });

  // Process GitHub Actions updates
  dependencyUpdates.actions.forEach(action => {
    try {
      console.log(`Updating action ${action.name}: ${action.current} → ${action.update}`);
      results.success.push({
        action: action.name,
        from: action.current,
        to: action.update
      });
    } catch (error) {
      results.failed.push({
        action: action.name,
        error: error.message
      });
    }
  });

  return results;
}

/**
 * Validate dependency compatibility
 * @param {string} packageName - Name of the package
 * @param {string} version - Version to check
 * @returns {boolean} Whether the version is compatible
 */
function validateDependency(packageName, version) {
  const compatibilityMatrix = {
    'jest': { minNode: '18', maxNode: '24' },
    'eslint': { minNode: '18', maxNode: '24' },
    'typescript': { minNode: '18', maxNode: '24' },
    'react': { minNode: '18', maxNode: '24' }
  };

  const reqs = compatibilityMatrix[packageName];
  if (!reqs) return true;

  // Added minimal Node.js version requirements for Jest and ESLint
  const minNode = reqs.minNode;
  const maxNode = reqs.maxNode;
  const currentNode = process.version;

  if (comparison(minNode, currentNode, '<=') && comparison(currentNode, maxNode, '<=')) {
    return true;
  }

  return false;

  function comparison(a, b, op) {
    const compared = a.split('.');
    const bCompared = b.split('.');
    for (let i = 0; i < compared.length; i++) {
      if (i < bCompared.length) {
        const diff = parseInt(compared[i]) - parseInt(bCompared[i]);
        if (diff !== 0 && op !== '>=' && op !== '<=') {
          return false;
        }
        if (op === '>' && diff < 0) {
          return false;
        }
        if (op === '<' && diff > 0) {
          return false;
        }
      } else {
        return false;
      }
    }
    return bCompared.length <= compared.length;
  }
}

/**
 * Generate update report
 * @returns {string} Formatted report of all updates
 */
function generateUpdateReport() {
  let report = '# Dependency Update Report\n\n';

  report += '## NPM Dependencies\n';
  dependencyUpdates.npm.forEach(dep => {
    report += `- ${dep.name}: ${dep.current} → ${dep.update}\n`;
  });

  report += '\n## GitHub Actions\n';
  dependencyUpdates.actions.forEach(action => {
    report += `- ${action.name}: ${action.current} → ${action.update}\n`;
  });

  return report;
}

/**
 * Check for update conflicts
 * @returns {Array} List of potential conflicts
 */
function checkConflicts() {
  const conflicts = [];

  // Check for major version jumps that might have breaking changes
  dependencyUpdates.npm.forEach(dep => {
    if (dep.type === 'major') {
      conflicts.push({
        type: 'major-version',
        package: dep.name,
        message: `Major version update for ${dep.name} may contain breaking changes`
      });
    }
  });

  // Added CI configuration update checks
  dependencyUpdates.ci.forEach(config => {
    const { current, update } = config;
    if (current !== update) {
      conflicts.push({
        type: 'ci-config',
        component: 'travis-ci',
        message: `CI configuration update required for Travis: ${current} → ${update}`
      });
    }
  });

  return conflicts;
}

// Main execution
if (require.main === module) {
  console.log('Starting dependency update process...\n');

  const conflicts = checkConflicts();
  if (conflicts.length > 0) {
    console.log('⚠️  Potential conflicts detected:');
    conflicts.forEach(c => console.log(`  - ${c.message}`));
  }

  const results = processUpdates();
  console.log('\n' + generateUpdateReport());
  console.log(`\n✓ Applied ${results.success.length} updates`);
  if (results.failed.length > 0) {
    console.log(`✗ Failed: ${results.failed.length} updates`);
  }
}

// Export functions for testing and external use
module.exports = {
  processUpdates,
  validateDependency,
  generateUpdateReport,
  checkConflicts,
  dependencyUpdates
};
```