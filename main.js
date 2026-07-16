'use strict';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Pad a number with a leading zero if it is less than 10.
 *
 * @param {number} value
 * @returns {string}
 */
function addZero(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

/* -------------------------------------------------------------------------- */
/* Legacy compatibility (kept for completeness)                              */
/* -------------------------------------------------------------------------- */

/**
 * Safely invoke hotKidCounts if it is defined.
 * (This is kept for backward compatibility with older scripts.)
 */
if (typeof hotKidCounts === 'function') {
  hotKidCounts();
}

/* -------------------------------------------------------------------------- */
/* Deprecations / fixes                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Get the current Lodash version (if present).
 *
 * @returns {string | undefined}
 */
function getLodashVersion() {
  try {
    return require('lodash/package.json').version;
  } catch (e) {
    // Lodash may not be installed – expose that fact to the caller.
    return undefined;
  }
}

/**
 * Get the current PostHog version (if present).
 *
 * @returns {string | undefined}
 */
function getPostHogVersion() {
  try {
    return require('posthog/package.json').version;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the current Supabase SDK version (if present).
 *
 * @returns {string | undefined}
 */
function getSupabaseVersion() {
  try {
    return require('@supabase/supabase-js/package.json').version;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the Node version used by CircleCI (if present).
 *
 * @returns {string | undefined}
 */
function getCircleCINodeVersion() {
  try {
    // CircleCI ships with a 'circleci' package that exposes the node version
    return require('circleci/package.json').engines.node;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the Python version used in a VS Code dev container (if present).
 *
 * @returns {string | undefined}
 */
function getDevContainerPythonVersion() {
  try {
    const devContainer = require('./devcontainer.json');
    return devContainer.python?.version || undefined;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the Node version used in a VS Code dev container (if present).
 *
 * @returns {string | undefined}
 */
function getDevContainerNodeVersion() {
  try {
    const devContainer = require('./devcontainer.json');
    return devContainer.node?.version || undefined;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the Node version reported by Travis CI (if present).
 *
 * @returns {string | undefined}
 */
function getTravisNodeVersion() {
  try {
    return require('travis-ci/sdk/package.json').engines.node;
  } catch (e) {
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                */
/* -------------------------------------------------------------------------- */

/