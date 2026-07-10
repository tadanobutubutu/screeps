'use strict';

// Helper to safely require modules. If the module cannot be loaded,
// the returned value is undefined and can be checked before use.
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module does not exist or failed to load – just return undefined
        return undefined;
    }
}

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (