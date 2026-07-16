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
    lodashVersion = v || '';
} catch (_) {}

try {
    const packageInfo = require('posthog-js/package.json');
    posthogVersion = packageInfo.version || '';
} catch (_) {
    // Fallback to posthog-node if posthog-js not available
    try {
        const packageInfo = require('posthog-node/package.json');
        posthogVersion = packageInfo.version || '';
    } catch (_) {}
}

try {
    const packageInfo = require('@supabase/supabase-js/package.json');
    supabaseVersion = packageInfo.version || '';
} catch (_) {}

try {
    // Attempt to load a node-specific