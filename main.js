const handlers = require('handlers');
const roles = require('roles');
const utils = require('utils');

// Main module for the application
// Contains core functionality and accessibility issue resolution

/**
 * Fixes accessibility issues in an HTML string (from HEAD).
 * @param {string} html - The HTML string to fix.
 * @returns {string} The fixed HTML string.
 */
function fixHtmlAccessibility(html) {
  // Fix font-family placeholder [ADDRESS] which was flagged as an invalid/placeholder value
  let accessibleHtml = html.replace('[ADDRESS]', 'Arial, Helvetica, sans-serif');

  // Ensure the html element has a lang attribute for screen readers
  if (/<html(?![^>]*\slang=)[^>]*>/i.test(accessibleHtml)) {
    accessibleHtml = accessibleHtml.replace(/<html([^>]*)>/i, '<html lang="en"$1>');
  }

  // Ensure all img tags have an alt attribute for screen readers
  accessibleHtml = accessibleHtml.replace(/<img(?![^>]*\salt=)[^>]*>/gi, (match) => {
    if (/\salt=/i.test(match)) {
      return match;
    }
    return match.replace(/<img/i, '<img alt=""');
  });

  // Add role="main" to the main content container for better ARIA support
  accessibleHtml = accessibleHtml.replace(
    /<div id="game"><\/div>/i,
    '<div id="game" role="main" aria-label="Game area"></div>'
  );

  // Ensure the h1 has an appropriate aria-label for better screen reader navigation
  accessibleHtml = accessibleHtml.replace(
    /<h1>Screeps Game<\/h1>/i,
    '<h1 aria-label="Screeps Game">Screeps Game</h1>'
  );

  return accessibleHtml;
}

/**
 * Addresses accessibility issues identified in an insight report (from origin/main).
 * @param {Array<Object>} issues - Array of accessibility issue objects from the insight report.
 * @param {Object} [options={}] - Optional configuration for addressing issues.
 * @param {boolean} [options.autoFix=true] - Whether to automatically apply known fixes.
 * @param {Array<string>} [options.ignore=[]] - List of issue types to ignore.
 * @returns {Object} An object containing the addressed issues, skipped issues, and a summary.
 */
function addressAccessibilityIssues(issues, options = {}) {
  const { autoFix = true, ignore = [] } = options;

  const addressed = [];
  const skipped = [];
  const summary = {
    total: issues.length,
    addressed: 0,
    skipped: 0,
    byType: {},
  };

  if (!Array.isArray(issues)) {
    throw new TypeError('issues must be an array');
  }

  for (const issue of issues) {
    if (!issue || typeof issue !== 'object' || !issue.type) {
      skipped.push({ issue, reason: 'Invalid issue format or missing type' });
      summary.skipped++;
      continue;
    }

    if (ignore.includes(issue.type)) {
      skipped.push({ issue, reason: 'Ignored by configuration' });
      summary.skipped++;
      continue;
    }

    summary.byType[issue.type] = (summary.byType[issue.type] || 0) + 1;

    let fix = null;

    if (autoFix) {
      switch (issue.type) {
        case 'missing-alt-text':
          fix = {
            action: 'add-alt-text',
            target: issue.selector || issue.element,
            value: issue.suggestedAlt || 'Image description needed',
          };
          break;
        case 'low-contrast':
          fix = {
            action: 'adjust-contrast',
            target: issue.selector || issue.element,
            value: issue.suggestedContrast || 'min-4.5:1',
          };
          break;
        case 'missing-label':
          fix = {
            action: 'add-label',
            target: issue.selector || issue.element,
            value: issue.suggestedLabel || 'Form field label',
          };
          break;
        case 'missing-lang':
          fix = {
            action: 'add-lang-attribute',
            target: 'html',
            value: issue.suggestedLang || 'en',
          };
          break;
        case 'empty-heading':
          fix = {
            action: 'add-heading-content',
            target: issue.selector || issue.element,
            value: issue.suggestedText || 'Heading',
          };
          break;
        case 'missing-button-text':
          fix = {
            action: 'add-button-text',
            target: issue.selector || issue.element,
            value: issue.suggestedText || 'Button',
          };
          break;
        case 'missing-skip-link':
          fix = {
            action: 'add-skip-link',
            target: 'body',
            value: 'Skip to main content',
          };
          break;
        case 'invalid-aria':
          fix = {
            action: 'fix-aria',
            target: issue.selector || issue.element,
            value: issue.suggestedAria || null,
          };
          break;
        default:
          fix = {
            action: 'manual-review',
            target: issue.selector || issue.element,
            value: issue.description || 'Manual review required',
          };
          break;
      }
    } else {
      fix = {
        action: 'manual-review',
        target: issue.selector || issue.element,
        value: issue.description || 'Manual review required',
      };
    }

    addressed.push({
      issue,
      fix,
    });
    summary.addressed++;
  }

  return { addressed, skipped, summary };
}

// Function to ensure the element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Function to add aria-label to the element
function addAriaLabel(element, labelText) {
  element.setAttribute('aria-label', labelText);
  return element;
}

// Main game loop function (from HEAD)
function main() {
  // Game initialization
  if (!Memory.initialized) {
    Memory.rooms = {};
    Memory.rooms.W0N0 = { towers: [], sources: [] };
    Memory.initialized = true;
  }

  // Generate HTML for the game client/server response
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screeps Game</title>
    <style>
        body { font-family: [ADDRESS], sans-serif; margin: 0; padding: 20px; }
    </style>
</head>
<body>
    <h1>Screeps Game</h1>
    <div id="game"></div>
    <script>
        // Game client code would go here
    </script>
</body>
</html>`;

  // Address accessibility issues from insight report
  return fixHtmlAccessibility(html);
}

// Export the main function as default, and attach additional functions as properties
module.exports = main;
module.exports.fixHtmlAccessibility = fixHtmlAccessibility;
module.exports.addressAccessibilityIssues = addressAccessibilityIssues;
module.exports.ensureElementHasId = ensureElementHasId;
module.exports.addAriaLabel = addAriaLabel;