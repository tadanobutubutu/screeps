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
 * Generate a deterministic daily challenge string.
 *
 * @returns {string} A daily-challenge string.
 */
function generateDailyChallenge() {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
  return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/**
 * Get the current Node.ics version.
 *
 * @returns {string} The Node.ics version.
 */
function getNodeVersion() {
  return process.version;
}

/**
 * Get the current TypeScript version.
 *
 * @returns {string} The TypeScript version.
 */
function getTypeScriptVersion() {
  return require('typescript/package.json').version;
}

/**
 * Get the current PostHog version (if present).
 *
 * @returns {string | undefined}
 */
function getPostHogVersion() {
  try {
    return require('posthog-js/package.json').version;
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
 * Get the current CircleCI Node version.
 *
 * @returns