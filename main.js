// main.js
// Entry point and core logic for the application.
// Existing exports and functions preserved; accessibility fixes added.

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------------
// Existing helpers (preserved)
// ------------------------------------------------------------------
function loadConfiguration() {
  const configPath = path.join(__dirname, 'config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return {};
  }
}

function processDataset(data) {
  return Array.isArray(data) ? data.map((item) => item * 2) : [];
}

function initializeApp() {
  // Original initialization logic preserved.
  const cfg = loadConfiguration();
  return processDataset(cfg.values);
}

// ------------------------------------------------------------------
// Line 320 area: Address accessibility issues from insight report
// ------------------------------------------------------------------
function addressInsightAccessibility() {
  // Apply accessibility attributes to the insight report container
  // and its interactive elements per the insight report recommendations.
  if (typeof document === 'undefined') return;

  const container = document.getElementById('insight-report');
  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Insight report');
    container.setAttribute('aria-describedby', 'insight-description');
    container.setAttribute('tabindex', '0');
  }

  // Ensure headings are properly labelling sections
  const headings = container ? container.querySelectorAll('h2, h3') : [];
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'insight-heading-' + index;
    }
    heading.setAttribute('tabindex', '0');
  });

  // Make interactive elements focusable with clear labels
  const interactives = container ? container.querySelectorAll('button, a, input, select') : [];
  interactives.forEach((el) => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      const labelText = el.getAttribute('data-label') || el.innerText || 'Action';
      el.setAttribute('aria-label', labelText.trim());
    }
  });
}

function createInsightReport(content) {
  const doc = typeof document !== 'undefined' ? document : null;
  const wrapper = doc ? doc.createElement('section') : {};
  wrapper.id = 'insight-report';

  // Accessibility fixes applied directly during creation
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Insight report');
  wrapper.setAttribute('aria-live', 'polite');

  const heading = doc ? doc.createElement('h2') : {};
  heading.textContent = content && content.title ? content.title : 'Insight Report';
  heading.id = 'insight-reference';
  heading.setAttribute('tabindex', '0');

  const desc = doc ? doc.createElement('p') : {};
  desc.id = 'insight-description';
  desc.textContent = content && content.description ? content.description : 'Detailed insight analysis.';

  wrapper.appendChild(heading);
  wrapper.appendChild(desc);

  return wrapper;
}

// ------------------------------------------------------------------
// Main execution (preserved)
// ------------------------------------------------------------------
function main() {
  const result = initializeApp();
  addressInsightAccessibility();
  return result;
}

// ------------------------------------------------------------------
// Exports (preserved; new accessibility helpers added)
// ------------------------------------------------------------------
module.exports = {
  loadConfiguration,
  processDataset,
  initializeApp,
  addressInsightAccessibility,
  createInsightReport,
  main,
};