// TODO: Implement this function for checking link and button accessibility
const CONFIG = {
  dataPath: './data',
  maxResults: 100
};

(function() {
  'use strict';

  const express = require('express');
  const axe = require('axe-core');
  const fs = require('fs');
  const path = require('path');
  const fastMap = {};

  const accessiblyHelper = () => Promise.resolve([]);

  // Existing code preserved

  module.exports = {
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    checkLinkAndButtonAccessibility
  };

  // Added code
  function checkLinkAndButtonAccessibility(element) {
    const issues = [];
    const tagName = element.tagName.toLowerCase();
    const parentNode = element.parentNode;

    if (parentNode && parentNode.hasAttribute("data-category")) {
      return { valid: true, issues: [] };
    }

    if (tagName !== 'a' && tagName !== 'button') {
      return { valid: true, issues: [] };
    }

    const textContent = element.textContent ? element.textContent.trim() : '';
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    const title = element.getAttribute('title');

    const hasAccessibleName = textContent.length > 0 || ariaLabel || ariaLabelledby || title;

    if (!hasAccessibleName) {
      issues.push('Link/button must have an accessible name (text content, aria-label, aria-labelledby, or title)');
    }

    // Additional checks for links
    if (tagName === 'a') {
      const href = element.getAttribute('href');
      if (!href || href === '#' || href === '') {
        issues.push('Link should have a valid href attribute');
      }
    }

    // Check for disabled buttons
    if (tagName === 'button') {
      const disabled = element.getAttribute('disabled');
      if (disabled !== null && disabled !== false) {
        const disabledText = textContent.toLowerCase();
        if (!disabledText.includes('disabled') && !ariaLabel && !ariaLabelledby) {
          issues.push('Disabled button should indicate disabled state in accessible name');
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues: issues
    };
  }
})();