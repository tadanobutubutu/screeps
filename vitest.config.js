import { defineConfig } from 'vitest/config';
import TestDriver from 'testdriverai/vitest';

// Note: dotenv is loaded automatically by the TestDriver SDK.
// Scoped to the TestDriver end-to-end tests so it does not collide with the
// repository's existing Jest suite under tests/*.test.js.
export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.test.mjs'],
    testTimeout: 900000,
    hookTimeout: 900000,
    reporters: [
      'default',
      TestDriver(),
    ],
    setupFiles: ['testdriverai/vitest/setup'],
  },
});
