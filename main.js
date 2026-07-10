// User Safety: safe
"use strict"; /* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

// Helper to safely require modules. If the module cannot be loaded,
// the returned value is undefined and can be checked before use.
function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (_) {
    // Module not found or failed to load – just return undefined.
    return undefined;
  }
}

// ------------------------- Imports ----------------------------
const Game = global.Game;
const Flags = global.Flags;

// Roles - use safeRequire for missing modules.
const roleHarvester = safeRequire('role.harvester');
const roleUp



---

**Support Pollinations.AI:**

---

🌸 **Ad** 🌸
Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.