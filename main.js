// @ts-check

// Existing code...

/**
 * New function requested in the issue: update Jest
 */
function updateJest() {
  const jestMonorepo = require('jest-monorepo');

  jestMonorepo.init('.', { version: '30.0.0' });
}

/**
 * New function requested in the issue: update TypeScript
 */
function updateTypeScript() {
  const tsConfig = require('../tsconfig.json');

  tsConfig.compilerOptions.target = 'ES2022';
  tsConfig.compilerOptions.typescript = '7.x';

  // Write the updated tsconfig.json file
  require('fs').writeFileSync(
    './tsconfig.json',
    JSON.stringify(tsConfig, null, 2)
  );
}

// Call the new functions to apply the updates
updateTypeScript();
updateJest();

// Existing code...