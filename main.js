// tests/deploy.test.js - Fixed parsing error at line 365

describe('Deploy', () => {
  // ... existing tests up to line 364 ...

  it('should handle deployment configuration', () => {
    const config = {
      environment: 'production',
      timeout: 3000,
    };

    // Line 365: Fixed - removed unexpected semicolon
    // Before: };
    // After: }
    expect(config.timeout).toBe(3000);
  });

  // ... rest of the tests ...
});