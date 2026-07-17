'use strict';

/* deploy.js – Deployment helper utilities
 *
 * The original file contained typographic quotation marks (smart
 * quotes) that caused a linting / parsing error. Those have been
 * straightened out and the module is now syntactically valid.
 *
 * The module now exports the helper functions for test consumption and
 * general use.
 *
 * Additionally, the following new functions have been added to address
 * the Dependency Dashboard issues:
 * - getPostHogVersion
 * - getSupabaseVersion
 * - getCircleCINodeVersion
 * - getDevContainerPythonVersion
 * - getDevContainerNodeVersion
 * - getTravisNodeVersion
 * - getRenovateUpdates
 * - getSentryVersion
 *
 * This module also re-exports the version-query functions so test
 * files can access them.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

/**
 * Helper to safely fetch a package version from node_modules or return an
 * empty string if the package cannot be resolved.
 *
 * @param {string} pkg   - The package name to look up.
 * @param {string} [depName= pkg] - Optional dependency name to resolve against.
 * @returns {string