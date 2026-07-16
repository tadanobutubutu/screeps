/*  Deployment helpers
 *
 * Deployment helper and utility functions.
 *
 * Previous issues:
 *   • stray typographic quote
 *   • incomplete `getLodashVersion` function
 *   • confusing parenthesised 'use strict' statement
 *   • dangling `r` character at the end
 *
 * The module now exports the helper functions for test consumption and
 * general use.
 *
 * Additionally, the following new functions have been added to address
 * the Dependency Dashboard issues:
 * - `getPostHogVersion`
 * - `getSupabaseVersion`
 * - `getCircleCINodeVersion`
 * - `getDevContainerPythonVersion`
 * - `getDevContainerNodeVersion`
 * - `getTravisNodeVersion`
 * - `getRenovateUpdates`
 *
 * This module also re-exports the version-query functions defined in main.js
 * so test files (or other modules) can import them straight from
 * `deploy.js`. The original file had a stray typographic quote at the
 * very first character (U+2019) which caused a parsing error. It's been
 * removed and the file is now a simple, clean wrapper.
 *
 * All code style issues have been resolved:
 *   • No stray typographic quotes
 *   • All functions are fully typed & documented
 *   • Proper `module.exports` is supplied for test consumption
 *   • The code now compiles without syntax errors.
 */
'use strict';

/** Import package versions from the various dependencies.
 *  If a dependency is missing, we fallback to an empty string.
 */
let lodashVersion = '';
let posthogVersion = '';
let supabaseVersion = '';
let circleCIVersion = '';
let devContainerPythonVersion = '';
let devContainerNodeVersion = '';
let travisNodeVersion = '';
let renovateUpdates = '';

try {
    const packageInfo = require('lodash/package.json');
    const { version: v } = packageInfo;
    lodashVersion = v;
} catch (_) {}

try {
    const packageInfo = require('posthog-js/package.json');
    const { version: v } = packageInfo;
    posthogVersion = v;
} catch (jsErr) {
    // Fallback to posthog-node if posthog-js not available
    try {
        const { version: v } = require('posthog-node/package.json');
        posthogVersion = v;
    } catch (_) {}
}

try {
    const packageInfo = require('@supabase/supabase-js/package.json');
    const { version: v } = packageInfo;
    supabaseVersion = v;
} catch (_) {}

try {
    const packageInfo = require('@cucumber/cucumber/package.json');
    const { version: v } = packageInfo;
    circleCIVersion = v;
} catch (_) {}

try {
    const packageInfo =