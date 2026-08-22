const tableHeaders = [
  {
    label: 'src/constants.js',
    value: 'Constants',
    scope: 'col'
  },
  {
    label: 'src/managers/roomManager.js',
    value: 'Room Manager',
    scope: 'col'
  },
  {
    label: 'src/managers/spawnManager.js',
    value: 'Spawn Manager',
    scope: 'col'
  },
  {
    label: 'src/managers/towerManager.js',
    value: 'Tower Manager',
    scope: 'col'
  },
  {
    label: 'src/roles/builder.js',
    value: 'Builder',
    scope: 'col'
  },
  // ... add scope: 'col' to all other headers
];

// Existing main.js content...

// Hypothetical code changes for Jest update to v30

// If you have custom Jest configuration, you might need to update it.
// For example, if you have a Jest config file like 'jest.config.js':
module.exports = {
  // ... existing configuration ...
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  // ... more configuration ...
};

// If you use any Jest-specific features in your code, ensure they are still compatible with Jest v30.
// For example, if you use async/await in tests, make sure your code is compatible:
async function myAsyncTest() {
  try {
    // ... some asynchronous test logic ...
  } catch (error) {
    // ... handle errors ...
  }
}

// Hypothetical test that uses the async/await feature:
describe('My async test', () => {
  it('should run correctly', async () => {
    await expect(myAsyncTest).resolves.toEqual(true);
  });
});

// ... rest of the main.js content ...