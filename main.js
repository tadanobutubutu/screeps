'use strict';

// User Safety: safe

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
  try {
    return require(name);
  } catch (_) {
    return undefined;
  }
}

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

/* ------------------------------------------------------------------
 *  Ensure Jest is available for CI test runs; install if missing
 * ------------------------------------------------------------------ */
function ensureJestForTests() {
  try {
    // Attempt to load jest; if it resolves, we are good
    require('jest');
  } catch (_) {
    // If jest is not installed, install it locally as a dev dependency
    const { execSync } = require('child_process');
    // Use npm to install jest; --save-dev marks it as a devDependency
    execSync('npm install jest --save-dev', { stdio: 'inherit' });
    // After installation, try to require jest again
    require('jest');
  }
}

// If this file is the entry point (e.g., run directly or via jest), bootstrap jest
if (require.main === module) {
 



---

**Support Pollinations.AI:**

---

🌸 **Ad** 🌸
Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.