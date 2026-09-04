const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const accessiblyHelper = require('./accessibly-helper');

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

let dependencyGraph = {};

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice,Dangerous Action,Potential Scam,Privacy Risk";

// ... existing code

// Function to perform harvest-related accessibility checks and enhancements (merged code from both branches)
async function performHarvestAccessibility() {
  try {
    const harvestElements = document.querySelectorAll('form, input[type="checkbox"], input[type="radio"], button, select, textarea');
    const harvestReport = {
      forms: [],
      controls: [],
      status: 'pending',
      issues: []
    };

    // Process form elements
    harvestElements.forEach(element => {
      if (element.tagName === 'FORM') {
        const formData = {
          id: element.id || `form-${Math.random().toString(36).substr(2, 9)}`,
          name: element.name || element.id || 'unnamed-form',
          method: element.method || 'get',
          action: element.action || window.location.href,
          fields: [],
          accessible: false
        };

        const inputs = element.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => {
          const field = {
            type: input.type || input.tagName.toLowerCase(),
            id: input.id,
            name: input.name,
            required: input.required || false,
            label: null,
            accessible: false
          };

          // Find associated label
          const label = element.querySelector(`label[for="${input.id}"]`) ||
                       input.closest('label');
          if (label) {
            field.label = label.textContent.trim();
          }

          // Check accessibility
          if (input.hasAttribute('aria-label') ||
              input.hasAttribute('aria-labelledby') ||
              (field.label && field.label.length > 0)) {
            field.accessible = true;
          } else {
            field.accessible = false;
            harvestReport.issues.push({
              element: input.tagName.toLowerCase(),
              id: input.id,
              issue: 'Missing label or aria-label'
            });
          }

          formData.fields.push(field);
        });

        // Check form accessibility
        const hasAccessibleFields = formData.fields.some(field => field.accessible);
        const hasFormLabel = element.querySelector('label') ||
                           element.hasAttribute('aria-label') ||
                           element.hasAttribute('aria-labelledby');

        formData.accessible = hasAccessibleFields && hasFormLabel;
        harvestReport.forms.push(formData);
      } else if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
        const control = {
          type: element.type || element.tagName.toLowerCase(),
          id: element.id,
          name: element.name,
          required: element.required || false,
          accessible: false,
          issues: []
        };

        // Check control accessibility
        if (!element.hasAttribute('aria-label') &&
            !element.hasAttribute('aria-labelledby') &&
            !element.id) {
          control.issues.push('Missing identifying attributes');
        }

        if (element.tagName === 'INPUT' &&
            (element.type === 'checkbox' || element.type === 'radio')) {
          const name = element.name;
          const group = document.querySelectorAll(`input[name="${name}"]`);
          if (group.length > 1) {
            // Check if group has proper legend or label
            const formControl = element.closest('fieldset') ||
                              document.querySelector(`fieldset legend`);
            if (!formControl) {
              control.issues.push('Radio/checkbox group lacks fieldset/legend');
            }
          }
        }

        if (control.issues.length === 0) {
          control.accessible = true;
        }

        harvestReport.controls.push(control);
      }
    });

    // Update status based on findings
    const hasIssues = harvestReport.issues.length > 0 ||
                     harvestReport.forms.some(f => !f.accessible) ||
                     harvestReport.controls.some(c => !c.accessible);

    harvestReport.status = hasIssues ? 'needs_improvement' : 'accessible';

    return harvestReport;
  } catch (error) {
    console.error('Error in harvest accessibility check:', error.message);
    return {
      status: 'error',
      issues: [`Harvest check failed: ${error.message}`]
  }
}

// Add harvest-specific CSS to improve visibility and accessibility (merged code from both branches)
function addHarvestStyles() {
  const styleId = 'harvest-accessibility-styles';
  if (document.getElementById(styleId)) {
    return; // Already added
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .harvest-accessible {
      border-color: #22c55e !important;
      background-color: #f0fdf4 !important;
    }

    .harvest-inaccessible {
      border-color: #ef4444 !important;
      background-color: #fef2f2 !important;
    }

    .harvest-warning {
      border-color: #f59e0b !important;
      background-color: #fffbeb !important;
    }

    .harvest-element:focus {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px !important;
    }

    .harvest-form-container {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }

    .harvest-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .harvest-stat-card {
      padding: 1rem;
      border-radius: 0.375rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }

    .harvest-stat-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .harvest-stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }
  `;

  document.head.appendChild(style);
}

// Generate a harvest report and write it to file (merged code from both branches)
async function generateHarvestReport() {
  const harvestReport = await performHarvestAccessibility();
  const reportFile = path.join(__dirname, 'harvest_report.json');

  // Add harvest metadata
  harvestReport.generatedAt = new Date().toISOString();
  harvestReport.pageUrl = window.location.href;
  harvestReport.pageTitle = document.title;

  // Write the report to file
  fs.writeFileSync(reportFile, JSON.stringify(harvestReport, null, 2));

  return harvestReport;
}

// Function to increment the version number and write it to the package.json file
function incrementVersion() {
  // Read the current version from package.json
  const packageJson = require('./package.json');
  const currentVersion = packageJson.version;

  // Increment the version number (SemVer compatible)
  const semver = require('semver');
  const newVersion = semver.inc(currentVersion, 'patch');

  // Update the package.json file with the new version number
  packageJson.version = newVersion;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}

// Initialize harvest accessibility functionality (merged code from both branches with updated fn name)
function initializeHarvestAccessibility() {
  addHarvestStyles();

  // Perform initial harvest check (merged code from both branches)
  performHarvestAccessibility().then(report => {
    // Add visual indicators for harvest elements (merged code from both branches)
    document.querySelectorAll('form, input, button, select, textarea').forEach(element => {
      element.classList.add('harvest-element');

      if (element.tagName === 'FORM') {
        element.classList.add('harvest-form-container');
      }
    });

    // Log harvest report for debugging (merged code from both branches)
    if (report.status !== 'accessible') {
      console.warn('Harvest accessibility issues found:', report.issues);
    }
  });
}

// Update the addressAccessibilityIssues function to include harvest logic (merged code from both branches)
const originalAddressAccessibilityIssues = addressAccessibilityIssues;

addressAccessibilityIssues = function() {
  const result = originalAddressAccessibilityIssues();

  // Add harvest accessibility checks
  const harvestResult = initializeHarvestAccessibility();

  return {
    ...result,
    harvest: harvestResult || {
      success: true,
      message: 'Harvest accessibility checks performed',
      fixesApplied: ['harvest_accessibility']
    }
  };
};

// Export the harvest functions (merged code from both branches)
module.exports = {
  ...module.exports,
  performHarvestAccessibility,
  addHarvestStyles,
  generateHarvestReport,
  initializeHarvestAccessibility,
  incrementVersion
};