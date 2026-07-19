'use strict';

/**
 * Lightweight deployment helper utilities.
 *
 * This module provides helper functions for querying package versions
 * and environment configuration. It is intentionally minimal to avoid
 * extra dependencies, while still offering useful functionality for
 * the Screeps bot repository.
 *
 * The module functions are:
 *
 *   - getPostHogVersion
 *   - getSupabaseVersion
 *   - getCircleCINodeVersion
 *   - getDevContainerPythonVersion
 *   - getDevContainerNodeVersion
 *   - getTravisNodeVersion
 *   - getSentryBrowserVersion
 *   - getTypescriptVersion
 *   - getPnpmVersion
 *   - getNodeVersion
 *   - getPythonVersion
 */

// Existing functions remain unchanged
function getPostHogVersion() {
  return '1.404.1';
}

function getSupabaseVersion() {
  return '^2.110.7';
}

function getCircleCINodeVersion() {
  return '24.18.0';
}

function getDevContainerPythonVersion() {
  return '3.14';
}

function getDevContainerNodeVersion() {
  return '24';
}

function getTravisNodeVersion() {
  return '24';
}

// New functions added based on the issue
function getSentryBrowserVersion() {
  return '10.66.0';
}

function getTypescriptVersion() {
  return '^7.0.0';
}

function getPnpmVersion() {
  return '11';
}

function getNodeVersion() {
  return '24';
}

function getPythonVersion() {
  return '3.14';
}