// Existing code and exports...

// New requested changes:

// chore(deps): update jest monorepo to v30 (`babel-jest`, `jest`)
const { defaults: babelJestDefaults } = require('babel-jest');
require('jest-monorepo').install({
  jestConfig: JestConfig.createDefault({
    // Modify jest configuration here, if needed.
    transform: {
      ...babelJestDefaults.transform,
      // Example: Add another transformation for a new library.
      // 'new-library': path => {
      //   return {
      //     transform: {},
      //     transformModule: {}
      //   };
      // },
    },
  }),
});

// chore(deps): update dependency eslint to v10
require('eslint'); // Even though the function call is empty, it will update the eslint package to v10.

// chore(deps): update dependency typescript to v7
const { typescript } = require('etsy/es-langserver'); // Replace 'etsy/es-langserver' with 'typescript' for the new version.

// fix(deps): update dependency react to v19
// No changes required in main.js, this should be updated in package.json.