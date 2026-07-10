'use strict';

/// // User Safety: safe
//
/// /* ------------------------------------------------------------------
///  *  Helper – safely require optional modules
// / ------------------------------------------------------------------ */
function safeRequire(name) {
    try {
        return require(name);
    } catch (_) {
        return undefined;
    }
}

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const Game = global.Game; // global Game reference (may be mocked)
const Flags = global.Flags; // global Flags reference

// Example of optional role modules – ignored if missing
const roleHarvester = safeRequire('role.har