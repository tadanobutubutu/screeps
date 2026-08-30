import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fa5]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäéèêëïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  setHtmlLangAttribute(lang);
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues (combined from both branches)
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });

  // Check if data cells have headers association
  const cells = tableElement.querySelectorAll('td[headers]');
  if (thElements.length > 0 && cells.length === 0) {
    errors.push('Table has headers but no data cells with headers attribute');
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues (combined from both branches)
function validateLandmark(element) {
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

  if (!element) {
    element = document.body;
  }

  landmarkRoles.forEach(role => {
    const landmarks = element.querySelectorAll(`[role="${role}"]`);
    landmarks.forEach((landmark, index) => {
      // Check for accessible name on landmark
      const hasLabel = landmark.getAttribute('aria-label') ||
                       landmark.getAttribute('aria-labelledby') ||
                       landmark.querySelector('h1, h2, h3, h4, h5, h6');

      if (!hasLabel && landmarkRoles.indexOf(role) !== landmarkRoles.indexOf('main')) {
        issues.push({
          code: 'REACT_017',
          message: `Landmark with role="${role}" is missing accessible name at index ${index}`
        });
      }
    });
  });

  return issues;
}

// New function to address REACT_041: Add accessible names to 2 SVGs (combined from both branches)
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }

  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  return null;
}

// New function to address REACT_025: Ensure unique landmarks (2 issues) (the base function with improvements)
function ensureUniqueLandmarks() {
  const issues = [];

  if (typeof document === 'undefined') {
    return issues;
  }

  const landmarkLabels = {};

  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkLabels[identifier]) {
        issues.push(`Duplicate main landmark found (${landmarkLabels[identifier]})`);
      } else {
        landmarkLabels[identifier] = 1;
      }
    } else {
      // Collect all landmarks with their labels
      const role = landmark.getAttribute('role');
      const label = landmark.getAttribute('aria-label') ||
                    landmark.getAttribute('aria-labelledby') ||
                    (landmark.querySelector('h1, h2, h3, h4, h5, h6') || {}).textContent;

      if (label) {
        const key = `${role}:${label}`;
        if (landmarkLabels[key]) {
          issues.push({
            code: 'REACT_025',
            message: `Duplicate landmark: role="${role}" with label "${label}" appears ${landmarkLabels[key] + 1} times`
          });
          landmarkLabels[key]++;
        } else {
          landmarkLabels[key] = 1;
        }
      }
    }
  });

  return issues;
}

export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks
};