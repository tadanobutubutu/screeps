/**
 * Main entry point for the application
 */

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match;
    return `<html${attrs} lang="en">`;
  });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
  if (typeof html !== 'string') return html;

  // Ensure every table has proper structure
  // ... (rest of the function code)
}

// TODO: Implement function for generating a report based on accessibility issues
function generateAccessibilityReport(html) {
  // Initialize an empty array to store the issues
  const issues = [];

  // Check for accessibility issues
  // ... (add your code to detect and collect accessibility issues)

  // Return the generated report
  return {
    issues,
    summary: `Total Accessibility Issues Found: ${issues.length}`
  };
}

// Function to create in-page buttons - supports both signatures for backward compatibility
function createInPageButton(buttonIdOrText, buttonTextOrHandler, buttonClassOrUndefined) {
  const button = document.createElement('button');
  
  // Detect which signature is being used
  if (arguments.length === 2 && typeof buttonTextOrHandler === 'function') {
    // Signature: (buttonText, onClickHandler)
    button.textContent = buttonIdOrText;
    button.addEventListener('click', buttonTextOrHandler);
  } else {
    // Signature: (buttonId, buttonText, buttonClass)
    button.id = buttonIdOrText;
    button.textContent = buttonTextOrHandler;
    if (buttonClassOrUndefined) {
      button.className = buttonClassOrUndefined;
    }
  }
  
  return button;
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        if (!document.querySelector(landmark)) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// Harvest logic to collect and aggregate accessibility results
function harvestLogic() {
  return new Promise((resolve, reject) => {
    // Check if axe is available (for browser environments)
    if (typeof axe !== 'undefined' && typeof axe.run === 'function') {
      axe.run((err, results) => {
        if (err) {
          reject(err);
          return;
        }

        const harvestData = {
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'node-environment',
          summary: {
            totalViolations: results.violations.length,
            totalPasses: results.passes.length,
            totalIncomplete: results.incomplete.length,
            totalInapplicable: results.inapplicable.length,
          },
          violations: results.violations.map(violation => ({
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,
            nodes: violation.nodes.map(node => ({
              html: node.html,
              target: node.target,
              any: node.any.map(item => item.id),
              all: node.all.map(item => item.id),
            })),
          })),
          passes: results.passes.map(pass => ({
            id: pass.id,
            impact: pass.impact,
            description: pass.description,
            help: pass.help,
            nodes: pass.nodes.map(node => ({
              html: node.html,
              target: node.target,
            })),
          })),
          incomplete: results.incomplete.map(incomplete => ({
            id: incomplete.id,
            impact: incomplete.impact,
            description: incomplete.description,
            nodes: incomplete.nodes.map(node => ({
              html: node.html,
              target: node.target,
              any: node.any.map(item => item.id),
            })),
          })),
        };

        resolve(harvestData);
      });
    } else {
      // Node.js environment or axe not available
      reject(new Error('axe-core not available in this environment'));
    }
  });
}

// Save harvest results to a file (Node.js environment)
function saveHarvestResults(harvestData, outputPath) {
  try {
    // Check if we're in Node.js environment with fs module
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const jsonData = JSON.stringify(harvestData, null, 2);
      fs.writeFileSync(outputPath, jsonData, 'utf8');
      return true;
    } else {
      console.warn('saveHarvestResults: fs module not available (browser environment)');
      return false;
    }
  } catch (error) {
    console.error('Error saving harvest results:', error);
    return false;
  }
}

// Universal module export pattern (works for both CommonJS and ES6)
const accessibilityUtils = {
  addLangAttribute,
  fixTableStructure,
  generateAccessibilityReport,
  createInPageButton,
  validateLandmarkStructure,
  harvestLogic,
  saveHarvestResults
};

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = accessibilityUtils;
}

// ES6 export
if (typeof exports !== 'undefined') {
  Object.assign(exports, accessibilityUtils);
}

// Also support direct browser global if needed
if (typeof window !== 'undefined') {
  window.accessibilityUtils = accessibilityUtils;
}