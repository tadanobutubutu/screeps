const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');

const accessiblyHelper = async (html, config) => {
  // Check if axe is available (axe-core should be loaded in the environment)
  if (typeof axe === 'undefined') {
    throw new Error('axe-core is not loaded. Please include axe-core before running this function.');
  }

  try {
    // Configure axe-core options for WCAG 2.1 AA compliance
    const options = {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        // Enable all recommended rules
        'color-contrast': { enabled: true },
        'heading-order': { enabled: true },
        'link-name': { enabled: true },
        'button-name': { enabled: true },
        'image-alt': { enabled: true },
        'form-field': { enabled: true },
        'keyboard-access': { enabled: true },
        'focus-order': { enabled: true },
        'region': { enabled: true },
        'page-has-main-content': { enabled: true }
      },
      resultTypes: {
        violations: true,
        passes: true,
        incomplete: true,
        inapplicable: true
      }
    };

    // Run accessibility scan on the provided HTML
    const results = await axe.run(html, options);

    // Format the report with additional metadata and the provided config
    const report = {
      timestamp: new Date().toISOString(),
      url: config.apiUrl || 'unknown',
      violations: results.violations.map(violation => ({
        id: violation.id,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
          impact: node.impact
        }))
      })),
      passes: results.passes.map(pass => ({
        id: pass.id,
        description: pass.description,
        help: pass.help,
        helpUrl: pass.helpUrl,
        nodes: pass.nodes.map(node => ({
          target: node.target,
          html: node.html
        }))
      })),
      incomplete: results.incomplete.map(incomplete => ({
        id: incomplete.id,
        description: incomplete.description,
        help: incomplete.help,
        helpUrl: incomplete.helpUrl,
        nodes: incomplete.nodes.map(node => ({
          target: node.target,
          html: node.html
        }))
      })),
      inapplicable: results.inapplicable.map(inapplicable => ({
        id: inapplicable.id,
        description: inapplicable.description,
        help: inapplicable.help,
        helpUrl: inapplicable.helpUrl
      })),
      testEngine: results.testEngine,
      testRunner: results.testRunner,
      testEnvironmentInfo: results.testEnvironmentInfo,
      summary: {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
        total: results.violations.length + results.passes.length + results.incomplete.length + results.inapplicable.length
      },
      config
    };

    return report;
  } catch (error) {
    console.error('Error scanning accessibility:', error);
    return {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

function validateConfig(cfg) {
  const errors = [];
  // Update landmark validation logic if needed
  const role = cfg && cfg.allowedRoles && Array.isArray(cfg.allowedRoles) && cfg.allowedRoles.find(r => r === 'main');
  if (!role) {
    errors.push('Missing "main" role in allowedRoles');
  }
  // Additional validation for null/undefined configuration
  if (!cfg) {
    errors.push('Configuration is null or undefined');
  }
  // Additional check for non-object input
  if (typeof cfg !== 'object') {
    errors.push('Configuration must be an object');
  }
  return errors;
}

function isValidLandmark(landmark) {
  const role = landmark && landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
  return role && Array.isArray(VALID_LANDMARK_ROLES) && VALID_LANDMARK_ROLES.includes(role.toLowerCase());
}

const VALID_LANDMARK_ROLES = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

module.exports = {
  accessiblyHelper,
  validateConfig,
  isValidLandmark
};